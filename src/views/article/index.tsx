import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { DeviceEventEmitter, NativeModules, StyleSheet } from 'react-native'
import ArticleView, { ArticleViewRef } from '~/components/articleView'
import StatusBar from '~/components/StatusBar'
import { commentHOC, CommentConnectedProps } from '~/redux/comment/HOC'
import { configHOC, ConfigConnectedProps } from '~/redux/config/HOC'
import saveHistory from '~/utils/saveHistory'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import CatalogTriggerView, { CatalogTriggerViewRef } from './components/catalogTriggerView'
import CommentButton, { CommentButtonRef } from './components/CommentButton'
import Header, { ArticleHeaderRef } from './components/Header'
import { ArticleApiData } from '~/api/article.d'
import store from '~/redux'
import { getUserInfo } from '~/redux/user/HOC'
import color from 'color'

export interface Props {

}

export interface RouteParams {
  link: string
  anchor?: string
  reloadMethod? (): void // 这个参数是用来设置后供其他位置使用的，相当于暴露出去一个方法
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & ConfigConnectedProps & CommentConnectedProps

function Article(props: PropsWithChildren<FinalProps>) {
  const [loadedPageInfo, setLoadedPageInfo] = useState<{
    pageName: string
    catalogItems: ArticleApiData.GetContent['parse']['sections']
    id: number
  }>({
    pageName: props.navigation.getParam('link'),
    catalogItems: [],
    id: 0
  })
  const [visibleHeader, setVisibleHeader] = useState(true)
  const [disabledMoreBtn, setDisabledMoreBtn] = useState(true)
  const [themeColor, setThemeColor] = useState({ backgroundColor: $colors.primary, blackText: false })
  const prevProps = useRef(props)
  const refs = {
    header: useRef<ArticleHeaderRef>(),
    articleView: useRef<ArticleViewRef>(),
    commentButton: useRef<CommentButtonRef>(),
    catalog: useRef<CatalogTriggerViewRef>()
  }
  const link = props.navigation.getParam('link')
  const anchor = props.navigation.getParam('anchor')

  // 注入webview的js
  const articleViewInjectJs = (function() {
    let codeStr = function() {
      // 监听滚动条变化用于响应头栏显隐
      let lastPosition = 0
      let activeDistance = 0 // 用于判断上划一定距离后再显示头栏和评论按钮
      let postMessageFlag = false // 设置一个标记，防止和webview通信过频降低性能
  
      $(window).scroll(function() {
        function changeHeaderVisible(status: boolean) {
          if (postMessageFlag) { return }
          postMessageFlag = true
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'changeHeaderVisible', data: status }))
          setTimeout(() => postMessageFlag = false, 50)
        }
  
        if (window.scrollY < 100) {
          activeDistance = 0
          changeHeaderVisible(true)
          return true
        }
  
        if (window.scrollY < lastPosition) {
          activeDistance += 2
          if (activeDistance >= 100) {
            activeDistance = 0
            changeHeaderVisible(true)
          }
        } else {
          activeDistance = 0
          changeHeaderVisible(false)
        }
        
        lastPosition = window.scrollY
      })

      // 注入一个主题色获取器
      if (!window._appConfig.changeThemeColorByArticleMainColor) { return }
      const firstInfobox = document.querySelector('table.infobox[align="right"] > tbody > tr > td') ||
        document.querySelector('table.navbox > tbody > tr > td > table > tbody > tr > th')
      if (firstInfobox) {
        const { backgroundColor, color } = window.getComputedStyle(firstInfobox)
        // 获取到默认颜色则不进行变色
        if (['rgb(38, 202, 155)', 'rgb(165, 228, 165)', 'rgb(255, 255, 255)'].includes(backgroundColor)) { return }
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'getArticleMainColor', data: { backgroundColor, color } }))
      }
    }.toString()

    return `(${codeStr})();`
  }())

  // 后退后设置当前页面comment的activeId
  useEffect(() => {
    const listener = props.navigation.addListener('didFocus', () => {
      if (loadedPageInfo.id) {
        props.$comment.setActiveId(loadedPageInfo.id)
      }
    })

    return () => listener.remove()
  }, [loadedPageInfo])

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('navigationStateChange', () => setVisibleHeader(true))
    return () => listener.remove()
  }, [])

  useEffect(() => {
    props.navigation.setParams({ reloadMethod: () => refs.articleView.current!.loadContent(true) })
  }, [])

  // 如果退出沉浸模式，则立即显示头部
  useEffect(() => {
    if (prevProps.current.state.config.immersionMode && !props.state.config.immersionMode) {
      changeHeaderVisible(true)
    } else {
      changeHeaderVisible(visibleHeader)
    }

    prevProps.current = props
  })

  // 以一个值的变化映射头栏和评论按钮的显隐变化
  function changeHeaderVisible(isVisible: boolean) {
    if (refs.header.current) {
      let { show, hide } = refs.header.current
      isVisible ? show() : hide()
    }

    if (refs.commentButton.current) {
      let { show, hide } = refs.commentButton.current
      isVisible ? show() : hide()
    }
  }

  function contentLoaded(data: ArticleApiData.GetContent) {
    setDisabledMoreBtn(false)
    console.log(data)
    let title = loadedPageInfo.pageName.replace(/_/g, ' ')
    let trueTitle = data.parse.title

    // 写入缓存
    storage.merge('articleCache', { [trueTitle]: data })

    if (title !== trueTitle) {
      $dialog.snackBar.show(`“${loadedPageInfo.pageName}”被重定向至此页`)

      // 记录至文章重定向表
      storage.merge('articleRedirectMap', { [title]: trueTitle })
    }

    saveHistory(trueTitle)

    setLoadedPageInfo({
      pageName: trueTitle,
      catalogItems: data.parse.sections,
      id: data.parse.pageid
    })

    if (anchor) {
      refs.articleView.current!.injectScript(`
        let target = document.getElementById('${anchor}')
        if(target){
          setTimeout(() => window.scrollTo(0, target.getBoundingClientRect().top))
        }else{
          window.onload = function(){
            document.getElementById('${anchor}').scrollIntoView()
          }
        }
      `)

      $dialog.snackBar.show(`该链接指向了“${decodeURIComponent(anchor.replace(/\./g, '%'))}”章节`)
    }
  }

  function articleViewIntoAnchor(anchor: string, isSmooth = true) {
    refs.articleView.current!.injectScript(`
      document.getElementById('${anchor}').scrollIntoView({ behavior: '${isSmooth ? 'smooth' : 'instant'}' })
    `)
  }

  function toComment() {
    if ([0, 1, 2].includes(props.$comment.getActiveData().status)) { return toast.show('加载评论中，请稍候') }
    props.navigation.push('comment', { title: loadedPageInfo.pageName })
  }

  function missingGoBack(link: string) {
    const userData = store.getState().user
    if (userData.name === link.split('User:')[1]) {
      getUserInfo()
        .then(userInfoData => {
          if (userInfoData.query.userinfo.implicitgroups.includes('autoconfirmed')) {
            props.navigation.replace('edit', { title: link, isCreate: true })
            toast.show('你的用户页不存在，请点击空白区域编辑并创建')
          } else {
            $dialog.alert.show({
              title: '抱歉，暂不支持非自动确认用户编辑',
              content: '请先通过网页端进行编辑10次以上，且注册时间超过24小时，即成为自动确认用户。',
              onPressCheck: () => props.navigation.goBack(),
              onClose: () => props.navigation.goBack()
            })
          }
        })
    } else {
      $dialog.alert.show({
        content: '该条目或用户页还未创建',
        onPressCheck: () => props.navigation.goBack(),
        onClose: () => props.navigation.goBack()
      })
    }
  }
  
  interface ArticleMainColor {
    backgroundColor: string
    color: string
  }
  function setThemeByArticleMainColor(mainColor: ArticleMainColor) {
    const blackText = color(mainColor.color).isDark()
    setThemeColor({ backgroundColor: mainColor.backgroundColor, blackText })
  }

  function isVisibleComment() {
    return !(/^([Tt]alk|讨论|[Tt]emplate( talk|)|模板(讨论|)|[Mm]odule( talk|)|模块(讨论|)|[Cc]ategory( talk|)|分类(讨论|)):/.test(loadedPageInfo.pageName))
  }

  const { config } = props.state
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  const themeColorProps = {
    backgroundColor: themeColor.backgroundColor,
    textColor: themeColor.blackText ? 'black' : 'white'
  }
  return (
    <CatalogTriggerView 
      {...themeColorProps}
      immersionMode={config.immersionMode}
      items={loadedPageInfo.catalogItems} 
      onPressTitle={articleViewIntoAnchor} 
      getRef={refs.catalog}
    >
      <StatusBar hidden={config.immersionMode} color="transparent" blackText={visibleHeader ? themeColor.blackText : true} />
      <Header 
        style={{ 
          ...styles.header, 
          top: config.immersionMode ? -statusBarHeight : 0
        }} 
        {...themeColorProps}
        navigation={props.navigation} 
        title={loadedPageInfo.pageName} 
        disabledMoreBtn={disabledMoreBtn}
        onPressRefreshBtn={() => refs.articleView.current!.loadContent(true)}
        onPressOpenCatalog={() => refs.catalog.current!.open()}
        getRef={refs.header} 
      />

      <ArticleView autoPaddingTopForHeader
        style={{ flex: 1 }} 
        navigation={props.navigation}
        link={link} 
        injectStyle={['article']}
        injectJs={articleViewInjectJs}
        onMessages={{ changeHeaderVisible: setVisibleHeader, getArticleMainColor: setThemeByArticleMainColor }}
        onLoaded={contentLoaded}
        onMissing={missingGoBack}
        getRef={refs.articleView}
      />       

      {loadedPageInfo.id && isVisibleComment() ? <CommentButton 
        id={loadedPageInfo.id}
        {...themeColorProps}
        onPress={toComment}
        getRef={refs.commentButton}
      /> : null } 
    </CatalogTriggerView>
  )
}

export default configHOC(commentHOC(Article))

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  }
})