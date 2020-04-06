import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState, FC } from 'react'
import { ActivityIndicator, BackHandler, Dimensions, Linking, NativeModules, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle, Vibration } from 'react-native'
import { WebView } from 'react-native-webview'
import articleApi from '~/api/article'
import store from '~/redux'
import { articleViewHOC, ArticleViewConnectedProps } from '~/redux/articleView/HOC'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import request from '~/utils/request'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import controlsCodeString from './controls/index'
import scriptCodeString from './scripts'
import hmoeControlsCodeString from './controls/hmoe'
import { ArticleApiData } from '~/api/article.d'
import homeStyleSheet from './styles/home'
import articleStyleSheet from './styles/article'
import nightModeStyleSheet from './styles/nightMode'
import hmoeHomeStyleSheet from './styles/hmoeHome'
import { DOMParser } from 'react-native-html-parser'
import { useTheme } from 'react-native-paper'
import { configHOC, ConfigConnectedProps } from '~/redux/config/HOC'
import { colors } from '~/theme'
import articleCacheController from '~/utils/articleCacheController'

const styleSheets = {
  home: homeStyleSheet,
  article: articleStyleSheet,
  nightMode: nightModeStyleSheet,
  hmoeHome: hmoeHomeStyleSheet,
}

export type InjectStyleSheetName = keyof typeof styleSheets

export interface Props {
  navigation: __Navigation.Navigation
  style?: StyleProp<ViewStyle>
  link?: string
  html?: string
  disabledLink?: boolean
  injectStyle: InjectStyleSheetName[]
  injectCss?: string
  injectJs?: string
  autoPaddingTopForHeader?: boolean
  onMessages?: { [msgName: string]: (data: any) => void }
  onLoaded? (articleData: ArticleApiData.GetContent): void
  onMissing? (link: string): void
  getRef?: MutableRefObject<any>
}

export interface ArticleViewRef {
  loadContent (forceLoad?: boolean): void
  injectScript (script: string): void
}

(ArticleView as DefaultProps<Props>).defaultProps = {
  onLoaded: () => {},
  onMissing: () => {}
}

type FinalProps = Props & UserConnectedProps & ArticleViewConnectedProps & ConfigConnectedProps

function ArticleView(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [html, setHtml] = useState('')
  const [originalImgUrls, setOriginalImgUrls] = useState<{ name: string, url: string }[]>()
  const [articleData, setArticleData] = useState<ArticleApiData.GetContent>()
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(1)
  const lastProps = useRef(props)
  const config = useRef(store.getState().config)
  const refs = {
    webView: useRef<any>()
  }

  if (props.getRef) props.getRef.current = { loadContent, injectScript }

  const libScript = ['fastclick.min', 'jquery.min', 'hammer.min']
  const baseUrl = 'file:///android_asset/assets'

  useEffect(() => {
    const listener = props.navigation.addListener('willFocus', () => {
      // 获取配置，注入webView
      let newConfig = store.getState().config
      if (JSON.stringify(config.current) !== JSON.stringify(newConfig || {})) {
        config.current = newConfig
        if (props.html) {
          setHtml(createDocument(props.html))
        } else {
          loadContent()
        }
      }
    })

    return () => listener.remove()
  }, [])

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (global.$isVisibleLoading) {
        toast.hide()
        return true
      }
    })

    return () => listener.remove()
  }, [])

  useEffect(() => {
    if (props.link) {
      loadContent()
    } else {
      setHtml(createDocument(props.html!))
      setStatus(3)
    }
  }, [])

  useEffect(() => {
    if (lastProps.current.state.config.theme !== props.state.config.theme) {
      setTimeout(() => {
        if (props.link) {
          loadContent()
        } else {
          setHtml(createDocument(props.html!))
          setStatus(3)
        }
      })
    }

    return () => { lastProps.current = props }
  })

  function createDocument(content: string, categories?: string[]) {
    let injectRequestUtil = function() {
      // 注入一个请求器，用于通信
      window._request = function(config, callback) {
        if (!window._request_id) window._request_id = 0 

        let callbackName = '_request_' + window._request_id
        
        ;(window as any)[callbackName] = callback
        window._request_id++

        // 必须返回，之后单独使用postMessage发送出去，不能对postMessage进行封装，否则webView无法接收到
        return { config, callbackName }
      }
    }.toString()

    injectRequestUtil = `(${injectRequestUtil})();`

    // 不知道为什么在props上拿不到最新state，而且整个props都是旧的
    const currentConfig = store.getState().config

    const injectStyles = props.injectStyle
      // 本来是根据props传入的injectStyle来动态加载样式表的，但不知道为什么无论如何在这里拿到的props1都是第一次传入的旧props
      // 只好在这里判断是否加载黑夜模式的样式了
      .concat(currentConfig.theme === 'night' ? ['nightMode'] : [])
      .map(name => styleSheets[name])
      .join('')
    const scriptTags = libScript.reduce((prev, next) => prev + `<script src="js/lib/${next}.js"></script>`, '')

    let injectJsCodes = `
      ${global.__DEV__ ? 'try{' : ''}
        ${injectRequestUtil};
        ${props.state.config.source === 'hmoe' ? hmoeControlsCodeString : ''};
        ${scriptCodeString};
        ${controlsCodeString};
        ${props.injectJs || ''}
      ${global.__DEV__ ? `
        }catch(e){
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: { name: e.name, message: e.message } }))
        }
      ` : ''}
    `
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>${injectStyles}</style>
        ${props.autoPaddingTopForHeader ? `
          <style>
            body {
              padding-top: ${currentConfig.immersionMode ? 55 : 55 + NativeModules.StatusBarManager.HEIGHT}px;
            }
          </style>
        ` : ''}
        <style>${props.injectCss || ''}</style>
      </head>
      <body>
        <div id="articleContentContainer" style="padding:0 5px; box-sizing:border-box;">${content}</div>
        ${scriptTags}
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          // 用户设置
          window._appConfig = ${JSON.stringify(currentConfig || {})}     
          // 当前主题色（不止props，这里拿到的theme也是旧的，目前只好这样）
          window._themeColors = ${JSON.stringify(colors[currentConfig.theme])}
          // 所有主题色
          window._colors = ${JSON.stringify(colors)}
          // 分类信息
          ${categories ? ('window._categories = ' + JSON.stringify(categories)) : ''};
          // 当前页面名
          window._articleTitle = '${props.link}'
          // 执行全部脚本代码
          $(function(){ 
            ${injectJsCodes};
            ReactNativeWebView.postMessage(JSON.stringify({ type: 'onReady' }))
          })
        </script>
      </body>
      </html>        
    `
  }

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

  function loadContent(forceLoad = false) {
    if (status === 2) { return }
    setStatus(2)
    props.$articleView.getContent(props.link!, forceLoad)
      .then(data => {
        let html = data.parse.text['*']
        // 如果为分类页，则从html字符串中抽取数据，然后交给category界面处理
        if (/^([Cc]ategory|分类):/.test(props.link!)) {
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
            props.navigation.replace('category', { 
              title: props.link!.split(':')[1], 
              branch: categoryBranch,
              articleTitle 
            })
          }, 250) // 延迟250毫秒，防止动画还没播完就跳转了
        }
        
        setHtml(createDocument(html, data.parse.categories.filter(item => !('hidden' in item)).map(item => item['*'])))
        // 本身在webview里也会向外发送渲染完毕的消息，这里也写一个防止出现什么问题导致一直status:2
        setTimeout(() => setStatus(3), 1000)
        // 无法显示svg，这里过滤掉
        loadOriginalImgUrls(data.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
        setArticleData(data)
      })
      .catch(async e => {
        console.log(e)
        if (e && e.code === 'missingtitle') return props.onMissing && props.onMissing(props.link!)

        try {
          const redirectMap = storage.get('articleRedirectMap') || {}
          let trueTitle = redirectMap[props.link!] || props.link
          
          let articleData = await articleCacheController.getCacheData(trueTitle!)
          if (!articleData) throw new Error('文章缓存不存在')
          
          let html = articleData.parse.text['*']
          setHtml(createDocument(html, articleData.parse.categories.map(item => item['*'])))
          $dialog.snackBar.show('因读取失败，载入条目缓存')
          setTimeout(() => setStatus(3), 1000)
          loadOriginalImgUrls(articleData.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
          setArticleData(articleData)
        } catch (e) {
          console.log(e)
          toast.show('网络超时，读取失败')
          setStatus(0)
        }
      })
  }

  function injectScript(script: string) {
    refs.webView.current.injectJavaScript(script)
  }

  function receiveMessage(event: any) {
    type EventParamsMap = {
      print: string
      error: string
      onReady: undefined
      onPressNote: { content: string }
      request: {
        config: {
          url: string
          method: 'get' | 'post'
          params: object
        }
        callbackName: string
      }
      onPressLink: {
        type: 'inner' | 'outer' | 'notExists'
        link: string
      }
      openApp: { url: string }
      onPressEdit: {
        page: string
        section: number
      }
      onPressImage: { name: string }
      onPressBiliVideo: {
        avId: string | number
        page: string | number
      }
      vibrate: undefined
    }

    const { type, data }: { type: keyof EventParamsMap, data: EventParamsMap[keyof EventParamsMap] } = JSON.parse(event.nativeEvent.data)

    // 拿这个函数做数据结构映射
    function setEventHandler<EventName extends keyof EventParamsMap>(eventName: EventName, handler: (data: EventParamsMap[EventName]) => void) {
      eventName === type && handler(data as any)
    } 

    setEventHandler('print', msg => console.log('=== print ===', msg))
    setEventHandler('error', msg => console.log('--- WebViewError ---', msg))
    setEventHandler('onReady', () => {
      props.onLoaded && props.onLoaded(articleData!)
      setStatus(3)
    })
    setEventHandler('onPressNote', data => {
      $dialog.alert.show({
        title: '注释',
        content: data.content,
        checkText: '关闭'
      })
    })
    setEventHandler('request', data => {
      let { config, callbackName } = data

      request({
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

    setEventHandler('vibrate', () => setTimeout(() => Vibration.vibrate(25)))

    if (props.disabledLink) { return }
    
    setEventHandler('onPressLink', data => {
      ;({
        inner: () => {
          let [link, anchor] = data.link.split('#')
          props.navigation.push('article', { link, anchor }) 
        },

        outer () {
          Linking.openURL(data.link)
        },

        notExists () {
          $dialog.alert.show({ content: '该条目还未创建' })
        }
      })[data.type]()
    })
    setEventHandler('openApp', data => Linking.openURL(data.url))
    setEventHandler('onPressEdit', data => {
      if (props.state.user.name) {
        props.navigation.push('edit', { title: data.page, section: data.section })
      } else {
        $dialog.confirm.show({
          content: '登录后才可以进行编辑，要前往登录界面吗？',
          onPressCheck: () => props.navigation.push('login')
        })
      }
    })
    setEventHandler('onPressImage', data => {
      if (originalImgUrls) {
        props.navigation.push('imageViewer', { 
          imgs: originalImgUrls.map(img => ({ url: img.url })),
          index: originalImgUrls.findIndex(img => img.name === data.name)
        })
      } else {
        toast.showLoading('获取链接中')
        articleApi.getImageUrl(data.name)
          .finally(toast.hide)
          .then(url => {
            props.navigation.push('imageViewer', { imgs: [{ url }], index: 0 })
          })
      }
    })
    setEventHandler('onPressBiliVideo', data => props.navigation.push('biliPlayer', data))

    if (props.onMessages) {
      ;(props.onMessages[type] || (() => {}))(data)
    }
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
      {status !== 3 ? <>
        <View style={{ ...styles.mask, backgroundColor: theme.colors.background }}>
          {{
            0: () => 
              <TouchableOpacity onPress={() => loadContent(true)}>
                <Text style={{ fontSize: 18, color: theme.colors.accent }}>重新加载</Text>
              </TouchableOpacity>,
            1: () => null,
            2: () => <ActivityIndicator color={theme.colors.accent} size={50} />,
            3: () => null
          }[status]()}
        </View>
      </> : null}
    </View>
  )
}

export default configHOC(articleViewHOC(userHOC(ArticleView))) as FC<Props>

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