import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { BackHandler, DeviceEventEmitter, View } from 'react-native'
import { NavigationState } from 'react-navigation'
import editApi from '~/api/edit'
import StatusBar from '~/components/StatusBar'
import toast from '~/utils/toast'
import Header from './components/Header'
import TabNavigator from './components/TabNavigator'
import { useTheme } from 'react-native-paper'
import SubmitDialog from './components/SubmitDialog'
import ViewContainer from '~/components/ViewContainer'

export interface Props {

}

export interface RouteParams {
  title: string
  section?: number
  isCreate?: boolean
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

export const maxSummaryLength = 220
const SummarySuffix = '  // Edit via Moegirl Viewer'

function Edit(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [status, setStatus] = useState(1)
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [visibleSubmitDialog, setVisibleSubmitDialog] = useState(false)
  const essentialUpdate = useRef(false)
  const articleReloadFlag = useRef(false)
  const refs = {
    tabNavigator: useRef<any>()
  }

  const title = props.navigation.getParam('title')
  const section = props.navigation.getParam('section')
  const isCreate = props.navigation.getParam('isCreate')

  // 监听stackNavigator的变化，如果离开时已编辑flag为true，且页面堆栈最后一个为article，则执行那个article页面实例上在params暴露的reload方法
  useEffect(() => {
    if (!isCreate) {
      const listener = DeviceEventEmitter.addListener('navigationStateChange', (prevState, state) => {
        let lastRoute = state.routes[state.routes.length - 1]
        if (articleReloadFlag.current && lastRoute.routeName === 'article') {
          articleReloadFlag.current = false
          lastRoute.params!.reloadMethod()
        }
      })
  
      return () => listener.remove()
    }
  })

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (global.$isVisibleLoading) {
        return true
      } else {
        const { params } = refs.tabNavigator.current.state.nav.routes[0]
        if (params && params.isContentChanged) {
          $dialog.confirm.show({
            content: '编辑还未保存，确定要放弃编辑的内容？',
            onPressCheck: () => props.navigation.goBack()
          })
  
          return true
        }
      }
    })

    return () => listener.remove()
  })

  function checkAllowBack() {
    const { params } = refs.tabNavigator.current.state.nav.routes[0]
    if (params && params.isContentChanged) {
      $dialog.confirm.show({
        content: '编辑还未保存，确定要放弃编辑的内容？',
        onPressCheck: () => props.navigation.goBack()
      })
    } else {
      props.navigation.goBack()
    }
  }

  // 监听tab导航容器的状态变化，在编辑器内容变更且用户查看预览时refresh预览视图
  function navigationStateChange(prevState: NavigationState, state: NavigationState) {
    if (!state.routes[0].params) { return }
    const { status, content } = state.routes[0].params
    const { refresh } = state.routes[1].params! || {}

    setStatus(status)
    setContent(content)
    if (!prevState.routes[0].params && content) return refresh && refresh(content)

    // 如果内容不同，则标记为需要刷新
    if ((!prevState.routes[0].params || prevState.routes[0].params.content !== content) && state.index === 0) { essentialUpdate.current = true }
    if (essentialUpdate.current && state.index === 1) {
      essentialUpdate.current = false
      refresh && refresh(content)
    }
  }

  function showSubmitDialog () {
    const { isContentChanged } = refs.tabNavigator.current.state.nav.routes[0].params
    if (isContentChanged) {
      setVisibleSubmitDialog(true)
    } else {
      toast.show('内容未发生变化')
    }
  }

  function submit () {
    const { content } = refs.tabNavigator.current.state.nav.routes[0].params
    toast.showLoading('提交中')
    editApi.editArticle(title, section, content, summary!.trim() + SummarySuffix)
      .finally(toast.hide)
      .then(() => {
        setTimeout(() => toast.show('编辑成功'))
        articleReloadFlag.current = true
        props.navigation.goBack()
      })
      .catch(code => {
        if (code) {
          const msg = (({
            editconflict: '出现编辑冲突，请复制编辑的内容后再次进入编辑界面，并检查差异',
            protectedpage: '没有权限编辑此页面！',
            readonly: '目前数据库处于锁定状态，无法编辑'
          } as { [code: string]: string })[code] || '未知错误')

          $dialog.alert.show({ content: msg })
        } else {
          $dialog.alert.show({ content: '网络错误，请稍候再试' })
        }             
      })
  }
  
  return (
    <ViewContainer>
      <StatusBar />
      <Header title={title} onPressBack={checkAllowBack} onPressDoneBtn={showSubmitDialog} />
      <TabNavigator 
        screenProps={{ title, section, isCreate, content }}
        onNavigationStateChange={navigationStateChange}
        ref={refs.tabNavigator}
      />
      <SubmitDialog
        visible={visibleSubmitDialog}
        value={summary}
        onChangeText={setSummary}
        onDismiss={() => setVisibleSubmitDialog(false)}
        onSubmit={submit}
      />
    </ViewContainer>
  )
}

export default Edit