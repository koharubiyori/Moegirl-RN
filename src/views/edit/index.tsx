import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, BackHandler, DeviceEventEmitter,
  StyleSheet, 
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Header from './components/Header'
import TabNavigator from './TabNavigator'
import { editArticle } from '~/api/edit'
import toast from '~/utils/toast'
import { NavigationState } from 'react-navigation'

export interface Props {

}

export interface RouteParams {
  title: string
  section: number
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function Edit(props: PropsWithChildren<FinalProps>) {
  const [status, setStatus] = useState(1)
  const [content, setContent] = useState('')
  const essentialUpdate = useRef(false)
  const articleReloadFlag = useRef(false)
  const refs = {
    tabNavigator: useRef<any>()
  }

  const title = props.navigation.getParam('title')
  const section = props.navigation.getParam('section')

  // 监听stackNavigator的变化，如果离开时已编辑flag为true，且页面堆栈最后一个为article，则执行那个article页面实例上在params暴露的reload方法
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('navigationStateChange', (prevState, state) => {
      let lastRoute = state.routes[state.routes.length - 1]
      if (articleReloadFlag.current && lastRoute.routeName === 'article') {
        articleReloadFlag.current = false
        lastRoute.params!.reloadMethod()
      }
    })

    return () => listener.remove()
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
            onTapCheck: () => props.navigation.goBack()
          })
    
          return true
        }
      }
    })

    return () => listener.remove()
  })

  // 监听tab导航容器的状态变化，在编辑器内容变更且用户查看预览时refresh预览视图
  function navigationStateChange(prevState: NavigationState, state: NavigationState) {
    if (!state.routes[0].params) { return }
    const { status, content } = state.routes[0].params
    const { refresh } = state.routes[1].params

    setStatus(status)
    setContent(content)
    if (!prevState.routes[0].params && content) return refresh && refresh(content)

    // 如果内容不同，则标记为需要刷新
    if ((prevState.routes[0].params.content !== content) && state.index === 0) { essentialUpdate.current = true }
    if (essentialUpdate.current && state.index === 1) {
      essentialUpdate.current = false
      refresh && refresh(content)
    }
  }

  function submit () {
    const { content, isContentChanged } = refs.tabNavigator.current.state.nav.routes[0].params
    if (isContentChanged) {
      $dialog.confirm.show({
        hasInput: true,
        inputPlaceholder: '请输入编辑摘要',
        onTapCheck: text => {
          toast.showLoading('提交中')
          editArticle(title, section, content, text.trim())
            .finally(toast.hide)
            .then(() => {
              setTimeout(() => toast.show('编辑成功'))
              articleReloadFlag.current = true
              props.navigation.goBack()
            })
            .catch(code => {
              if (code) {
                $dialog.alert.show({
                  editconflict: '出现编辑冲突，请复制编辑的内容后再次进入编辑界面，并检查差异',
                  protectedpage: '没有权限编辑此页面！',
                  readonly: '目前数据库处于锁定状态，无法编辑'
                }[code] || '未知错误')
              } else {
                $dialog.alert.show({ content: '网络错误，请稍候再试' })
              }             
            })
        }
      })
    } else {
      toast.show('内容未发生变化')
    }
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar />
      <Header title={title} navigation={props.navigation} onTapDoneBtn={submit} />
      <TabNavigator 
        screenProps={{ title, section, content }}
        onNavigationStateChange={navigationStateChange}
        ref={refs.tabNavigator}
      />
    </View>
  )
}

export default Edit