import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { BackHandler, StyleSheet } from 'react-native'
import { useTheme } from 'react-native-paper'
import editApi from '~/api/edit'
import { EditApiData } from '~/api/edit/types'
import MyStatusBar from '~/components/MyStatusBar'
import ViewContainer from '~/components/ViewContainer'
import useLockDrawer from '~/hooks/useLockDrawer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import store from '~/mobx'
import dialog from '~/utils/dialog'
import toast from '~/utils/toast'
import CaptchaDialog from './components/CaptchaDialog'
import Header from './components/Header'
import SubmitDialog from './components/SubmitDialog'
import EditTabs from './tabs'
import tabDataCommunicator from './utils/tabDataCommunicator'

export interface Props {

}

export interface RouteParams {
  title: string
  section?: number
  newSection?: boolean
  isCreate?: boolean
}

export const maxSummaryLength = 220
const SummarySuffix = '  // 来自Moegirl Viewer的编辑'

function EditPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const [summary, setSummary] = useState('')
  const [visibleSubmitDialog, setVisibleSubmitDialog] = useState(false)
  const [visibleCaptchaDialog, setVisibleCaptchaDialog] = useState(false)
  const [captcha, setCaptcha] = useState<EditApiData.GetCaptcha | null>(null)
  const articleReloadFlag = useRef(false)

  const { title, section, isCreate, newSection } = route.params

  useLockDrawer()

  // 没找到比较优雅的给tab内部传参的方法，只好这么搞了
  tabDataCommunicator.data.title = title
  tabDataCommunicator.data.section = section
  tabDataCommunicator.data.isCreate = isCreate
  tabDataCommunicator.data.newSection = newSection || false

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      checkAllowBack()
      return true
    })

    return () => listener.remove()
  }, [])

  // 离开页面时重置通信器
  useEffect(() => () => tabDataCommunicator.reset(), [])

  // 编辑成功后离开页面时执行所有route.params.pageName为当前编辑页面的article组件上暴露的route.params.reload
  useEffect(() => () => {
    if (!articleReloadFlag.current) { return }
    const routeState = navigation.dangerouslyGetState()
    routeState.routes
      .filter(item => item.name === 'article' && item.params && (item.params as any).pageName === route.params.title)
      .forEach(item => (item.params as any).reload(true))
  }, [])

  async function checkAllowBack() {
    if (tabDataCommunicator.data.isContentChanged) {
      await dialog.confirm.show({ content: '编辑还未保存，确定要放弃编辑的内容？' }) 
    }
    navigation.goBack()
  }

  function loadCaptcha() {
    return editApi.getCaptcha().then(setCaptcha)
  }

  function showSubmitDialog () {
    if (tabDataCommunicator.data.isContentChanged) {
      setVisibleSubmitDialog(true)
    } else {
      toast('内容未发生变化')
    }
  }

  function executeEdit(captchaId?: string, captchaVal?: string) {
    dialog.loading.show({ title: '提交中...' })
    const content = tabDataCommunicator.data.content
    editApi.editArticle({
      title, 
      section: newSection ? 'new' : section, 
      content,
      summary: newSection ? '' : summary!.trim() + SummarySuffix,
      captchaid: captchaId,
      captchaword: captchaVal
    })
      .finally(dialog.loading.hide)
      .then(() => {
        toast.success('编辑成功')
        articleReloadFlag.current = true
        navigation.goBack()
      })
      .catch(code => {
        if (code) {
          const msg = (({
            editconflict: '出现编辑冲突，请复制编辑的内容后再次进入编辑界面，并检查差异',
            protectedpage: '没有权限编辑此页面！',
            readonly: '目前数据库处于锁定状态，无法编辑'
          } as { [code: string]: string })[code] || '未知错误')

          dialog.alert.show({ content: msg })
        } else {
          dialog.alert.show({ content: '网络错误，请稍候再试' })
        }             
      })
  }

  function submit () {
    dialog.loading.show({ title: '提交中...' })
    store.user.isAutoConfirmed()
      .finally(dialog.loading.hide)
      .then(isAutoConfirmed => {
        if (isAutoConfirmed) {
          executeEdit()
        } else {
          dialog.loading.show({ title: '提交中...' })
          loadCaptcha()
            .finally(dialog.loading.hide)
            .then(() => setVisibleCaptchaDialog(true))
            .catch(console.log)
        }
      })
  }

  return (
    <ViewContainer>
      <MyStatusBar />
      <Header title={title} onPressBack={checkAllowBack} onPressDoneBtn={showSubmitDialog} />
      <EditTabs />

      <SubmitDialog
        visible={visibleSubmitDialog}
        value={summary}
        onChangeText={setSummary}
        onDismiss={() => setVisibleSubmitDialog(false)}
        onSubmit={submit}
      />
      <CaptchaDialog
        visible={visibleCaptchaDialog}
        img={captcha ? captcha.path : undefined}
        onDismiss={() => setVisibleCaptchaDialog(false)}
        onPressImg={loadCaptcha}
        onSubmit={captchaVal => executeEdit(captcha!.id, captchaVal)}
      />
    </ViewContainer>
  )
}

export default EditPage

const styles = StyleSheet.create({
  tabStyle: {
    color: 'white',
  }
})