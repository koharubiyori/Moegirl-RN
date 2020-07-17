import React, { PropsWithChildren, useRef, useState, useEffect, useCallback } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { ArticleApiData, ArticleSectionData } from '~/api/article/types'
import ArticleView, { ArticleViewRef } from '~/components/articleView'
import ViewContainer from '~/components/ViewContainer'
import useMyRoute from '~/hooks/useTypedRoute'
import ArticleContentsTriggerView, { ArticleContentTriggerViewRef } from './components/contentsTriggerView'
import ArticleHeader, { ArticleHeaderRef } from './components/Header'
import dialog from '~/utils/dialog'
import MyStatusBar from '~/components/MyStatusBar'
import CommentButton, { ArticleCommentButtonRef } from './components/CommentButton'
import store from '~/mobx'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import toast from '~/utils/toast'
import watchListApi from '~/api/watchList'
import saveHistory from '~/utils/saveHistory'
import { useFocusEffect } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'

export interface Props {
  
}

export interface RouteParams {
  pageName: string
  displayPageName?: string
  anchor?: string
}

function ArticlePage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const [trueTitle, setTrueTitle] = useState(route.params.pageName)
  const [displayTitle, setDisplayTitle] = useState(route.params.displayPageName || route.params.pageName)
  const [pageId, setPageId] = useState(0)
  const [contentsData, setContentsData] = useState<ArticleSectionData[]>([])
  const [isWatched, setIsWatched] = useState(false)

  const statusBarHeight = StatusBar.currentHeight!

  const refs = {
    header: useRef<ArticleHeaderRef>(),
    contents: useRef<ArticleContentTriggerViewRef>(),
    articleView: useRef<ArticleViewRef>(),
    commentButton: useRef<ArticleCommentButtonRef>()
  }

  // 进入页面时显示header
  useFocusEffect(useCallback(() => {
    if (!refs.header.current) { return }
    refs.header.current.show()
  }, []))
  
  // 进出页面时，启用&禁用音乐播放器
  useFocusEffect(useCallback(() => {
    const disableAllIframeScriptStr = (() => {
      const iframeList = document.querySelectorAll('iframe')
      iframeList.forEach(item => {
        // 通过清空src的方式停止播放
        const src = item.src
        item.src = ''
        item.dataset.src = src
      })
    }).toString()

    const enableAllIframeScriptStr = (() => {
      const iframeList = document.querySelectorAll('iframe')
      iframeList.forEach(item => {
        item.src = item.dataset.src!
      })
    }).toString()

    const pauseAllAudioScriptStr = (() => {
      const audioList = document.querySelectorAll('audio')
      audioList.forEach(item => item.pause())
    }).toString() 

    refs.articleView.current && refs.articleView.current!.injectScript(`(${enableAllIframeScriptStr})()`)
    
    return () => {
      refs.articleView.current!.injectScript(`
        (${pauseAllAudioScriptStr})();
        (${disableAllIframeScriptStr})();
      `)
    }
  }, []))

  // 获取当前页监视状态
  useEffect(() => {
    watchListApi.isWatched(route.params.pageName).then(setIsWatched)
  }, [])

  // 向外暴露reload方法
  useEffect(() => {
    navigation.setParams({ reload: refs.articleView.current!.reload })
  }, [])

  function handlerFor_articleData_wasLoaded(articleData: ArticleApiData.GetContent) {
    console.log(articleData)
    setDisplayTitle(articleData.parse.displaytitle)
    setPageId(articleData.parse.pageid)
    setTrueTitle(articleData.parse.title)
    navigation.setParams({ pageName: articleData.parse.title })
    setContentsData(articleData.parse.sections)
    saveHistory(articleData.parse.title)

    if (route.params.pageName !== articleData.parse.title) {
      dialog.snackBar.show({ title: `重定向自${route.params.pageName}` })
    }

    // 如果有anchor，则跳转至锚点
    if (route.params.anchor) {
      jumpToAnchor(route.params.anchor)
      dialog.snackBar.show({ title: `该链接指向了“${route.params.anchor}”章节` })
    }
  }

  // 注入webView的window.onscroll事件handler，并以滚动响应header顶部偏移
  const lastTopOffset = useRef(0)
  function changeHeaderTopOffset(topOffset: number) {
    
    if (topOffset < 200) {
      refs.commentButton.current && refs.commentButton.current!.show()
    } else {
      const diff = topOffset - lastTopOffset.current
      if (refs.commentButton.current) {
        diff < 0 ? refs.commentButton.current!.show() : refs.commentButton.current!.hide()
      }
      if (refs.header.current) {
        diff < 0 ? refs.header.current!.show() : refs.header.current!.hide()
      }
    }

    lastTopOffset.current = topOffset
  }
  
  // 注入webview的window.onscroll事件字符串
  const injectedWindowScrollEventHandlerStr = `(${(() => {
    window.onscroll = () => window._postRnMessage('onWindowScroll' as any, window.scrollY) 
  }).toString()})()`

  function toggleWatchStatus() {
    dialog.loading.show()
    watchListApi.setWatchStatus(trueTitle, !isWatched)
      .finally(dialog.loading.hide)
      .then(() => {
        toast(isWatched ? '已移出监视列表' : '已加入监视列表')
        setIsWatched(prevVal => !prevVal)
      })
      .catch(() => toast('网络错误'))
  }

  function jumpToAnchor(anchor: string) {
    refs.articleView.current!.injectScript(`
      document.getElementById('${anchor}').scrollIntoView()
      window.scrollTo(0, window.scrollY - ${56 + statusBarHeight})
    `)
  }

  function missingGoBack(link: string) {
    const userData = store.user
    if (userData.name === link.split('User:')[1]) {
      navigation.replace('edit', { title: link, isCreate: true })
      toast('你的用户页不存在，请点击空白区域编辑并创建')
    } else {
      dialog.alert.show({ content: '该条目或用户页还未创建' }).finally(navigation.goBack)
    }
  }
  
  const activityIndicatorTopOffset = (StatusBar.currentHeight! + 56) / 2
  const isLoaded = pageId !== 0
  const isVisibleCommentBtn = 
    !(/^([Tt]alk|讨论|[Tt]emplate( talk|)|模板(讨论|)|[Mm]odule( talk|)|模块(讨论|)|[Cc]ategory( talk|)|分类(讨论|)|[Uu]ser talk|用户讨论|萌娘百科 talk):/.test(trueTitle || route.params.pageName))
  const disabledEditFullText = /( talk|讨论):/.test(trueTitle || route.params.pageName)
  return useObserver(() =>
    <ViewContainer style={{ position: 'relative' }}>
      <MyStatusBar />
      <ArticleContentsTriggerView
        getRef={refs.contents}
        items={contentsData}
        onPressTitle={jumpToAnchor}
      >
        <ArticleHeader
          getRef={refs.header}
          title={displayTitle}
          isWatchedPage={isWatched}
          disabledEditFullText={disabledEditFullText}
          // 页面没加载完禁止点击搜索和action菜单
          rightBtnsDisabled={!isLoaded}
          onPressOpenContents={() => refs.contents.current!.open()}
          onPressRefreshBtn={() => refs.articleView.current!.reload(true)}
          onPressToggleWatchList={toggleWatchStatus}
        />

        <ArticleView
          getRef={refs.articleView}
          style={{ flex: 1 }}
          centerOffsetStyle={{ position: 'relative', top: activityIndicatorTopOffset }}
          pageName={route.params.pageName}
          styles={[
            'article', 
            ...(store.settings.theme === 'night' ? ['nightMode'] as any : []),
            ...(store.settings.source === 'hmoe' ? ['hmoeArticle'] as any : [])
          ]}
          injectCss={`body { padding-top: ${56 + statusBarHeight}px; }`}
          injectJs={injectedWindowScrollEventHandlerStr}
          onLoaded={handlerFor_articleData_wasLoaded}
          onMissing={missingGoBack}
          onMessages={{
            onWindowScroll: changeHeaderTopOffset
          }}
        />

      {(!!pageId && isVisibleCommentBtn) &&
        <CommentButton 
          getRef={refs.commentButton} 
          pageId={pageId} 
          pageName={trueTitle}
        />
      }
      </ArticleContentsTriggerView>
    </ViewContainer>
  )
}

export default ArticlePage

const styles = StyleSheet.create({
  
})