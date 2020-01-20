import React, { useState, useEffect, useRef, MutableRefObject, PropsWithChildren } from 'react'
import {
  View, StyleSheet, Text, Dimensions, Linking, ActivityIndicator, TouchableOpacity,
  BackHandler, NativeModules, StyleProp, ViewStyle
} from 'react-native'
import PropTypes from 'prop-types'
import { WebView } from 'react-native-webview'
import toast from '~/utils/toast'
import storage from '~/utils/storage'
import ImageViewer from './ImageViewer'
import articleViewHOC from '~/redux/articleView/HOC'
import userHOC from '~/redux/user/HOC'
import { controlsCodeString } from './controls/index' 
import { getImageUrl } from '~/api/article'
import request from '~/utils/request'
import store from '~/redux'

export interface Props {
  navigation: __Navigation.Navigation
  style?: StyleProp<ViewStyle>
  link?: string
  html?: string
  disabledLink?: boolean
  injectStyle?: string[]
  injectCss?: string
  injectJs?: string
  autoPaddingTopForHeader?: boolean
  onMessages?: { [msgName: string]: () => void }
  onLoaded? (): void
  onMissing? (): void
  getRef: MutableRefObject<any>
}

export interface ArticleViewRef {
  loadContent (forceLoad?: boolean): void
  injectScript (script: string): void
}

(ArticleView as DefaultProps<Props>).defaultProps = {
  onLoaded: () => {},
  onMissing: () => {}
}

type FinalProps = Props

function ArticleView(props: PropsWithChildren<FinalProps>) {
  const [html, setHtml] = useState('')
  const [status, setStatus] = useState(1)
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

  function createDocument(content: string) {
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

    // 载入资源（位于 /android/main/assets ）
    const styleTags = props.injectStyle ? props.injectStyle.reduce((prev, next) => 
      prev + `<link type="text/css" rel="stylesheet" href="css/${next}.css" />`, ''
    ) : ''

    const scriptTags = libScript.reduce((prev, next) => prev + `<script src="js/lib/${next}.js"></script>`, '')

    let injectJsCodes = `
      ${global.__DEV__ ? 'try{' : ''}
        ${injectRequestUtil};
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        ${styleTags}
        ${props.autoPaddingTopForHeader ? `
          <style>
            body {
              padding-top: ${store.getState().config.immersionMode ? 55 : 55 + NativeModules.StatusBarManager.HEIGHT}px;
            }
          </style>
        ` : ''}
        <style>${props.injectCss || ''}</style>
      </head>
      <body>
        <div id="webViewContainer" style="padding:0 5px; box-sizing:border-box;">${content}</div>
        ${scriptTags}
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          window._appConfig = ${JSON.stringify(config.current || {})}
          window._colors = ${JSON.stringify($colors)}
          $(function(){ 
            ${injectJsCodes};
          })
        </script>
      </body>
      </html>        
    `
  }

  function loadContent(forceLoad = false) {
    if (status === 2) { return }
    setStatus(2)
    props.articleView.getContent(props.link, forceLoad)
      .then(data => {
        let html = data.parse.text['*']
        setHtml(createDocument(html))
        setStatus(3)
        props.onLoaded(data)
      })
      .catch(async e => {
        console.log(e)
        if (e && e.code === 'missingtitle') return props.onMissing(props.link)

        try {
          const redirectMap = await storage.get('articleRedirectMap') || {}
          let link = redirectMap[props.link] || props.link
          const articleCache = await storage.get('articleCache') || {}
          const data = articleCache[link]
          if (data) {
            let html = data.parse.text['*']
            setHtml(createDocument(html))
            $dialog.snackBar.show('因读取失败，载入条目缓存')
            setStatus(3)
            props.onLoaded(data)
          } else {
            throw new Error()
          }
        } catch (e) {
          console.log(e)
          toast.show('网络超时，读取失败')
          setStatus(0)
        }
      })
  }

  function injectScript(script) {
    refs.webView.current.injectJavaScript(script)
  }

  function receiveMessage(e) {
    const { type, data } = JSON.parse(e.nativeEvent.data)
    
    if (type === 'print') {
      console.log('=== print ===', data)
    }

    if (type === 'error') {
      console.log('--- WebViewError ---', data)
    }

    if (type === 'onTapNote') {
      $dialog.alert.show({
        title: '注释',
        content: data.content,
        checkText: '关闭'
      })
    }

    if (type === 'request') {
      let { config, callbackName } = data
      request({
        baseURL: config.url,
        method: config.method,
        params: config.params
      }).then(data => {
        // 数据中的换行会导致解析json失败
        injectScript(`window.${callbackName}(\`${JSON.stringify(data).replace(/\\n/g, '')}\`)`)
      }).catch(e => {
        console.log(e)
        injectScript(`window.${callbackName}('${JSON.stringify({ error: true })}')`)
      })
    }

    if (props.disabledLink) { return }

    if (type === 'onTapLink') {
      ;({
        inner: () => {
          let [link, anchor] = data.link.split('#')
          props.navigation.push('article', { link, anchor }) 
        },

        outer () {
          $dialog.confirm.show({
            content: '这是一个外链，是否要打开外部浏览器进行访问？',
            onTapCheck: () => Linking.openURL(data.link)
          })
        },

        notExists () {
          $dialog.alert.show({ content: '该条目还未创建' })
        }
      })[data.type]()
    }

    if (type === 'openApp') {
      Linking.openURL(data.url)
    }

    if (type === 'onTapEdit') {
      if (props.state.user.name) {
        props.navigation.push('edit', { title: data.page, section: data.section })
      } else {
        $dialog.confirm.show({
          content: '登录后才可以进行编辑，要前往登录界面吗？',
          onTapCheck: () => props.navigation.push('login')
        })
      }
    }

    if (type === 'onTapImage') {
      toast.showLoading('获取链接中')
      getImageUrl(data.name)
        .finally(toast.hide)
        .then(url => {
          props.navigation.push('imageViewer', { imgs: [{ url }] })
        })
        .catch(e => {
          console.log(e)
          setTimeout(() => toast.show('获取链接失败'))
        })
    }

    if (type === 'onTapBiliVideo') {
      props.navigation.push('biliPlayer', data)
    }

    if (props.onMessages) {
      ;(props.onMessages[type] || () => {})(data)
    }
  }

  return (
    <View style={{ ...styles.container, ...(props.style as any) }}>
      {({
        0: () => 
          <TouchableOpacity onPress={() => loadContent(true)}>
            <Text style={{ fontSize: 18, color: $colors.main }}>重新加载</Text>
          </TouchableOpacity>,
        1: () => null,
        2: () => <ActivityIndicator color={$colors.main} size={50} />,
        3: () => 
          <WebView allowFileAccess
            scalesPageToFit={false}
            source={{ html, baseUrl }}
            originWhitelist={['*']}
            style={{ width: Dimensions.get('window').width }}
            onMessage={receiveMessage}
            ref={refs.webView}
          />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default articleViewHOC(userHOC(ArticleView))

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})