import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Dimensions, Linking, StyleProp, StyleSheet, Text, TouchableOpacity, Vibration, View, ViewStyle } from 'react-native'
import { DOMParser } from 'react-native-html-parser'
import { useTheme } from 'react-native-paper'
import { WebView } from 'react-native-webview'
import articleApi from '~/api/article'
import { ArticleApiData } from '~/api/article/types'
import useStateWithRef from '~/hooks/useStateWithRef'
import useMyNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import baseRequest from '~/request/base'
import articleCacheController from '~/utils/articleCacheController'
import dialog from '~/utils/dialog'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import MyActivityIndicator from '../MyActivityIndicator'
import hmoeControlsCodes from './controls/hmoe'
import hmoeScriptCodeString from './scripts/hmoe'
import controlsCodes from './controls/index'
import scriptCodeString from './scripts'
import { getArticleContent } from './utils/articleRamCache'
import createHTMLDocument, { ArticleViewStyleSheetName } from './utils/createHTMLDocument'
import { biliPlayerController } from '~/views/biliPlayer'

export interface Props {
  style?: StyleProp<ViewStyle>
  pageName?: string
  html?: string
  disabledLink?: boolean
  styles: ArticleViewStyleSheetName[]
  injectCss?: string
  injectJs?: string
  centerOffsetStyle?: StyleProp<ViewStyle>
  onMessages?: { [msgName: string]: (data: any) => void }
  onLoaded? (articleData: ArticleApiData.GetContent): void
  onMissing? (pageName: string): void
  getRef?: MutableRefObject<any>
}

export interface ArticleViewRef {
  reload(force?: boolean): void
  injectScript(script: string): void
}

;(ArticleView as DefaultProps<Props>).defaultProps = {
  onLoaded: () => {},
  onMissing: () => {}
}

const baseUrl = 'file:///android_asset/assets'

function ArticleView(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useMyNavigation()
  const [html, setHtml] = useState('')
  const [articleData, setArticleData] = useState<ArticleApiData.GetContent>()
  const [originalImgUrls, setOriginalImgUrls] = useState<{ name: string, url: string }[]>()
  const [status, setStatus, statusRef] = useStateWithRef<0 | 1 | 2 | 3>(1)
  const refs = {
    webView: useRef<any>()
  }

  if (props.getRef) props.getRef.current = { reload: loadContent, injectScript }

  // useEffect(() => {
  //   if (props.pageName) {
  //     loadContent()
  //   } else {
  //     setHtml(createDocument(props.html!))
  //     setStatus(3)
  //   }
  // }, [])

  const lastStyles = useRef<typeof props.styles>()
  useEffect(() => {
    let reloadFlag = !lastStyles.current // 没有上一个props，直接加载
    if (lastStyles.current) reloadFlag = lastStyles.current.length !== props.styles.length // 数组长度不同，说明变了
    if (lastStyles.current && lastStyles.current.length === props.styles.length) {
      // 所有的值互相包含，说明在不考虑位置变动的情况下两个数组的值没变
      reloadFlag = !(
        lastStyles.current.every(item => props.styles.includes(item)) && 
        props.styles.every(item => lastStyles.current!.includes(item))
      )
    }
    if (!reloadFlag) { return }

    if (reloadFlag) {
      if (props.pageName) {
        loadContent()
      } else {
        setHtml(createDocument(props.html!))
        setStatus(3)
      }
    }

    lastStyles.current = props.styles
  }, [props])

  // 创建HTML文档
  function createDocument(content: string, categories: string[] = []) {
    const createInjectData = (dataList: { [dataName: string]: any }) => {
      return Object.keys(dataList)
        .map(dataName => `window._${dataName} = ${JSON.stringify(dataList[dataName])}`)
        .join(';')
    }
    
    const injectedData = createInjectData({
      settings: store.settings,
      colors: theme.colors,
      categories,
      articleTitle: { text: props.pageName }
    })
    
    return createHTMLDocument({ 
      title: props.pageName,
      content,
      scripts: ['hammer', 'jquery'],
      styles: props.styles as any,
      injectCss: [
        controlsCodes.styleSheet,
        ...(store.settings.source === 'hmoe' ? [
          hmoeControlsCodes.styleSheet
        ] : []),
        props.injectCss
      ].join(''),
      
      injectJs: [
        injectedData, 
        controlsCodes.script,
        scriptCodeString,
        ...(store.settings.source === 'hmoe' ? [
          hmoeScriptCodeString,
          hmoeControlsCodes.script
        ] : []),
        props.injectJs,
      ].join(';\n')
    })
  }

  // 加载原始图片列表
  function loadOriginalImgUrls(imgs: string[]): Promise<{ url: string, name: string }[]> {
    return Promise.all(
      imgs.map(articleApi.getImageUrl)
    )
      .then((urls: string[]) => {
        const imgUrls = urls.map((url, index) => ({ url, name: imgs[index] }))
        setOriginalImgUrls(imgUrls)
        return imgUrls
      })
  }

  // 加载文章内容，有三层缓存机制，一层是运行时缓存，一层是每次加载完成后存的缓存文件(用到了缓存文件时，会发出提示)
  // 实际使用时发现还有接口缓存，缓存考虑可能是萌百的响应返回了max-age（已经禁用）
  async function loadContent(forceLoad = false) {
    if (statusRef.current === 2) { return }
    
    setStatus(2)
    // 如果启用了缓存优先模式且当前不是分类或讨论页
    const isCanUseCache = !/^([Cc]ategory|分类|[Tt]alk|.+ talk):/.test(props.pageName!)
    if (!forceLoad && store.settings.cachePriority && isCanUseCache) {
      const redirectMap = storage.get('articleRedirectMap') || {}
      let trueTitle = redirectMap[props.pageName!] || props.pageName
      
      let articleCache = await articleCacheController.getCacheData(trueTitle!)
      if (articleCache) {
        const { articleData, lastModified } = articleCache
        setHtml(createDocument(articleData.parse.text['*'], articleData.parse.categories.map(item => item['*'])))
        loadOriginalImgUrls(articleData.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
        setArticleData(articleData)
        // setTimeout(() => {
        //   dialog.snackBar.show({ title: `正在显示${diffDate(new Date(lastModified))}加载的版本`, actionText: '加载最新' })
        //     .then(() => loadContent(true))
        // }, 3000)

        // 后台请求一次文章数据，更新缓存
        getArticleContent(props.pageName!, true)
          .then(data => {
            const trueTitle = data.parse.title
            articleCacheController.addCache(trueTitle, data)
            // 如果请求title和真实title不同，则存入文章名重定向映射表
            if (props.pageName !== trueTitle) storage.merge('articleRedirectMap', { [trueTitle]: props.pageName! })
          })

        return
      }
    }

    getArticleContent(props.pageName!, forceLoad) // 这个函数封装了运行时缓存
      .then(data => {
        let html = data.parse.text['*']
        // 如果为分类页，则从html字符串中抽取数据，然后交给category界面处理
        if (/^([Cc]ategory|分类):/.test(props.pageName!)) {
          const htmlDoc = new DOMParser().parseFromString(html, 'text/html')
          let categoryBranchContainer = htmlDoc.getElementById('topicpath')
          let descContainer = htmlDoc.getElementById('catmore')
          let categoryBranch: string[] | null = null
          let articleTitle: string | null = null

          if (categoryBranchContainer) {
            categoryBranch = Array.from(categoryBranchContainer.getElementsByTagName('a')).map(item => item.textContent!)
          }
          if (descContainer) {
            articleTitle = descContainer.getElementsByTagName('a')[0].getAttribute('title')
          }

          return setTimeout(() => {
            navigation.replace('category', { 
              title: props.pageName!.replace(/^([Cc]ategory|分类):/, ''), 
              branch: categoryBranch,
              articleTitle 
            })
          }, 250) // 延迟250毫秒，防止动画还没播完就跳转了
        }

        setHtml(createDocument(html, data.parse.categories.filter(item => !('hidden' in item)).map(item => item['*'])))
        // 无法显示svg，这里过滤掉
        loadOriginalImgUrls(data.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
        setArticleData(data)

        const trueTitle = data.parse.title
        articleCacheController.addCache(trueTitle, data)
        // 如果请求title和真实title不同，则存入文章名重定向映射表
        if (props.pageName !== trueTitle) storage.merge('articleRedirectMap', { [trueTitle]: props.pageName! })
      })
      .catch(async e => {
        console.log(e)
        if (e && e.code === 'missingtitle') return props.onMissing && props.onMissing(props.pageName!)

        try {
          const redirectMap = storage.get('articleRedirectMap') || {}
          let trueTitle = redirectMap[props.pageName!] || props.pageName
          
          let articleCache = await articleCacheController.getCacheData(trueTitle!)
          if (!articleCache) throw new Error('文章缓存不存在')
          
          const articleData = articleCache.articleData
          let html = articleData.parse.text['*']
          setHtml(createDocument(html, articleData.parse.categories.map(item => item['*'])))
          console.log('cache')
          dialog.snackBar.show({ title: '因读取失败，载入条目缓存' })
          loadOriginalImgUrls(articleData.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
          setArticleData(articleData)
        } catch (e) {
          console.log(e)
          toast('网络超时，读取失败')
          setStatus(0)
        }
      })
  }

  // 注入脚本代码
  function injectScript(script: string) {
    refs.webView.current.injectJavaScript(script)
  }

  // 接收webView的消息
  function receiveMessage(event: any) {
    type MessagePayloadMaps = __ArticleWebView.MessagePayloadMaps
    const { type, payload }: { type: keyof MessagePayloadMaps, payload: MessagePayloadMaps[keyof MessagePayloadMaps] } = JSON.parse(event.nativeEvent.data)

    // 执行自定义webView事件
    if (props.onMessages) {
      ;(props.onMessages[type] || (() => {}))(payload)
    }

    // 拿这个函数做数据结构映射
    function setEventHandler<EventName extends keyof MessagePayloadMaps>(eventName: EventName, handler: (payload: MessagePayloadMaps[EventName]) => void) {
      eventName === type && handler(payload as any)
    } 

    // 发出log
    setEventHandler('print', msg => console.log('=== print ===', msg))
    // 抛出错误
    setEventHandler('error', msg => console.log('--- WebViewError ---', msg))
    // 页面js加载完毕
    setEventHandler('onReady', () => {
      props.onLoaded && props.onLoaded(articleData!)
      console.log('ready')
      setStatus(3)
    })
    // 点击注释
    setEventHandler('onPressNote', data => {
      dialog.alert.show({
        title: '注释',
        content: data.content,
        checkText: '关闭'
      })
    })
    // 发送请求
    setEventHandler('request', data => {
      console.log(data)
      let { config, callbackName } = data
      
      baseRequest({
        baseURL: config.url,
        method: config.method,
        params: config.params
      }).then(data => {
        // 数据中的换行会导致解析json失败
        injectScript(`window['${callbackName}'](${JSON.stringify(data).replace(/\\n/g, '')})`)
      }).catch(e => {
        console.log(e)
        injectScript(`window['${callbackName}']('${JSON.stringify({ error: true })}')`)
      })
    })

    // 发起振动
    setEventHandler('vibrate', () => setTimeout(() => Vibration.vibrate(25)))

    if (props.disabledLink) { return }
    
    // 点击链接
    setEventHandler('onPressLink', data => {
      ;({
        inner: () => {
          let [pageName, anchor] = data.link.split('#')
          navigation.push('article', { pageName, anchor }) 
        },

        outer () {
          Linking.openURL(data.link)
        },

        notExists () {
          dialog.alert.show({ content: '该条目还未创建' })
        }
      })[data.type]()
    })
    // 以url形式请求打开某个app
    setEventHandler('openApp', data => Linking.openURL(data.url))
    // 点击编辑按钮
    setEventHandler('onPressEdit', data => {
      if (store.user.isLoggedIn) {
        navigation.push('edit', { title: data.page, section: data.section })
      } else {
        dialog.confirm.show({ content: '登录后才可以进行编辑，要前往登录界面吗？' })
          .then(() => navigation.push('login'))
      }
    })
    // 点击图片
    setEventHandler('onPressImage', data => {
      if (originalImgUrls) {
        navigation.push('imageViewer', { 
          imgs: originalImgUrls.map(img => ({ url: img.url })),
          index: originalImgUrls.findIndex(img => img.name === data.name)
        })
      } else {
        dialog.loading.show({ title: '获取链接中...', allowUserClose: true })
        articleApi.getImageUrl(data.name)
          .finally(dialog.loading.hide)
          .then(url => {
            navigation.push('imageViewer', { imgs: [{ url }], index: 0 })
          })
      }
    })
    // 点击bili播放器
    setEventHandler('onPressBiliVideo', data => biliPlayerController.start(data.avId, data.page))
  }

  return (
    <View style={{ ...(props.style as any) }}>
      {/* 这个webView是一直显示的，因为要监听发出的onReady事件 */}
      <WebView allowFileAccess domStorageEnabled
        scalesPageToFit={false}
        source={{ html, baseUrl }}
        originWhitelist={['*']}
        style={{ width: Dimensions.get('window').width }}
        onMessage={receiveMessage}
        ref={refs.webView}
      />
      
      {/* 这个遮罩覆盖上面的webView */}
      {status !== 3 &&
        <View style={{ ...styles.mask, backgroundColor: theme.colors.background }}>
          {{
            0: () => 
              <TouchableOpacity onPress={() => loadContent(true)} style={props.centerOffsetStyle}>
                <Text style={{ fontSize: 18, color: theme.colors.accent, }}>重新加载</Text>
              </TouchableOpacity>,
            1: () => null,
            2: () => <MyActivityIndicator size={50} style={props.centerOffsetStyle} />,
            3: () => null
          }[status]()}
        </View>
      }
    </View>
  )
}

export default ArticleView

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
})