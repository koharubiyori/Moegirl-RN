import React, { useState, useEffect, useRef } from 'react'
import { 
  View, Text,
  StyleSheet, NativeModules, DeviceEventEmitter
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/articleView/Index'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import CatalogTriggerView from './catalogTriggerView/index'
import CommentButton from './CommentButton'
import storage from '~/utils/storage'
import saveHistory from '~/utils/saveHistory'
import toast from '~/utils/toast'
import commentHOC from '~/redux/comment/HOC'
import store from '~/redux'

function Article(props){
  const [loadedPageInfo, setLoadedPageInfo] = useState({
    pageName: props.navigation.getParam('link'),
    catalogItems: [],
    id: 0
  })
  const [visibleHeader, setVisibleHeader] = useState(true)
  const prevProps = useRef(props)
  const refs = {
    header: useRef(),
    articleView: useRef(),
    commentButton: useRef(),
    catalog: useRef()
  }
  const link = props.navigation.getParam('link')
  const anchor = props.navigation.getParam('anchor')
  const articleViewInjectCss = `
    body {
      padding-top: 55px;
    }
  `
  const articleViewInjectJs = function(){
    let codeStr = (function(){
      var lastPosition = 0,
      activeDistance = 0,       // 用于判断上划一定距离后再显示头栏和评论按钮
      postMessageFlag = false   // 设置一个标记，防止和webview通信过频降低性能
  
      $(window).scroll(function(){
        function changeHeaderVisible(status){
          if(postMessageFlag){ return }
          postMessageFlag = true
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'changeHeaderVisible', data: status }))
          setTimeout(() => postMessageFlag = false, 50)
        }
  
        if(window.scrollY < 100){
          activeDistance = 0
          changeHeaderVisible(true)
          return true
        }
  
        if(window.scrollY < lastPosition){
          activeDistance += 2
          if(activeDistance >= 100){
            activeDistance = 0
            changeHeaderVisible(true)
          }
        }else{
          activeDistance = 0
          changeHeaderVisible(false)
        }
        
        lastPosition = window.scrollY
      })
    }).toString()

    return `(${codeStr})();`
  }()

  // 后退后设置当前页面comment的activeId
  useEffect(() =>{
    const listener = props.navigation.addListener('didFocus', () =>{
      if(loadedPageInfo.id){
        props.comment.setActiveId(loadedPageInfo.id)
      }
    })

    return () => listener.remove()
  }, [])

  useEffect(() =>{
    const listener = DeviceEventEmitter.addListener('navigationStateChange', () => setVisibleHeader(true) )
    return () => listener.remove()
  }, [])

  useEffect(() =>{
    props.navigation.setParams({ reloadMethod: () => refs.articleView.current.loadContent(true) })
  }, [])

  // 如果退出沉浸模式，则立即显示头部
  useEffect(() =>{
    if(prevProps.current.state.config.immersionMode && !props.state.config.immersionMode){
      changeHeaderVisible(true)
    }else{
      changeHeaderVisible(visibleHeader)
    }
  })

  // 以一个值的变化映射头栏和评论按钮的显隐变化
  function changeHeaderVisible(isVisible){
    if(refs.header.current){
      let {show, hide} = refs.header.current
      isVisible ? show() : hide()
    }

    if(refs.commentButton.current){
      let {show, hide} = refs.commentButton.current
      isVisible ? show() : hide()
    }
  }

  function contentLoaded(data){
    var title = loadedPageInfo.pageName.replace(/_/g, ' ')
    var trueTitle = data.parse.title

    // 写入缓存
    storage.merge('articleCache', { [trueTitle]: data })

    if(title !== trueTitle){
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

    if(anchor){
      // 这里需要优化，因为不知道为什么导致语句没有执行，所以采取了等待500毫秒的手段
      // 考虑是dom还没能加载完毕导致的
      setTimeout(() =>{
        articleViewIntoAnchor(anchor, false)
        $dialog.snackBar.show(`该链接指向了“${decodeURIComponent(anchor.replace(/\./g, '%'))}”章节`)
      }, 500)
    }
  }

  function articleViewIntoAnchor(anchor, isSmooth = true){
    refs.articleView.current.injectScript(`
      document.getElementById('${anchor}').scrollIntoView({ behavior: '${isSmooth ? 'smooth' : 'instant'}' })
    `)
  }

  function toComment(){
    if([0, 1, 2].includes(props.comment.getActiveData().status)){ return toast.show('加载评论中，请稍候') }
    props.navigation.push('comment', { title: loadedPageInfo.pageName, id: loadedPageInfo.id })
  }

  function missingGoBack(){
    $dialog.alert.show({
      content: '该条目还未创建',
      onTapCheck: () => props.navigation.goBack()
    })
  }

  function isVisibleComment(){
    return !/^([Tt]alk|讨论|[Tt]emplate( talk|)|模板(讨论|)|[Mm]odule( talk|)|模块(讨论|)|[Cc]ategory( talk|)|分类(讨论|)):/.test(loadedPageInfo.pageName)
  }

  const {config} = store.getState()
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <>
      <StatusBar hidden={config.immersionMode} color={visibleHeader ? $colors.dark : 'white'} blackText={!visibleHeader} />
      <Header style={{ ...styles.header, top: config.immersionMode ? -statusBarHeight : 0 }} 
        navigation={props.navigation} 
        title={loadedPageInfo.pageName} 
        onTapRefreshBtn={() => refs.articleView.current.loadContent(true)}
        onTapOpenCatalog={() => refs.catalog.current.showCatalog()}
        getRef={refs.header} 
      />

      {/* 这只是一个普通的view，但被绑定了滑动显示catalog的事件 */}
      <CatalogTriggerView style={{ flex: 1 }} items={loadedPageInfo.catalogItems} onTapTitle={articleViewIntoAnchor} getRef={refs.catalog}>
       <ArticleView style={{ flex: 1 }} navigation={props.navigation}
          link={link} 
          injectStyle={['page']}
          injectCss={articleViewInjectCss}
          injectJs={articleViewInjectJs}
          onMessages={{ changeHeaderVisible: setVisibleHeader }}
          onLoaded={contentLoaded}
          onMissing={missingGoBack}
          getRef={refs.articleView}
        />       
      </CatalogTriggerView>

      {loadedPageInfo.id && isVisibleComment() ? <CommentButton 
        id={loadedPageInfo.id}
        onTap={toComment}
        getRef={refs.commentButton}
      /> : null } 
    </>
  )
}

export default commentHOC(Article)

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  }
})