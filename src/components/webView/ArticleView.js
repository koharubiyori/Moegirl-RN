import React from 'react'
import {
  View, StyleSheet, Text, Dimensions, Linking, ActivityIndicator, TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { WebView } from 'react-native-webview'
import toast from '~/utils/toast'
import storage from '~/utils/storage'
import ImageViewer from './ImageViewer'
import webViewHOC from '~/redux/webView/HOC'
import userHOC from '~/redux/user/HOC'
import { controlsCodeString } from './controls/index' 
import { getImageUrl } from '~/api/article'
import request from '~/utils/request'

class ArticleView extends React.Component{
  static propTypes = {
    style: PropTypes.object,
    navigation: PropTypes.object,
    
    link: PropTypes.string,
    html: PropTypes.string,
    disabledLink: PropTypes.bool,
    injectStyle: PropTypes.arrayOf(PropTypes.string),   // 载入位于 /android/main/assets 的样式表
    injectCss: PropTypes.string,
    injectJs: PropTypes.string,

    onMessages: PropTypes.objectOf(PropTypes.func),   // 接收webView的postMessage
    onLoaded: PropTypes.func,
    getRef: PropTypes.func
  }

  static defaultProps = {
    onLoaded: new Function
  }

  constructor (props){
    super(props)
    props.getRef && props.getRef(this)

    this.state = {
      html: '',
      status: 1,

      showingImg: '',
      config: null
    }

    this.libScript = ['fastclick.min', 'jquery.min', 'hammer.min']

    this.baseUrl = 'file:///android_asset/assets'

    var injectRequestUtil = (function(){
      // 注入一个请求器，用于通信
      window._request = function(config, callback){
        if(!window._request_id) window._request_id = 0 

        var callbackName = '_request_' + window._request_id
        
        window[callbackName] = callback
        window._request_id++

        // 必须返回，之后单独使用postMessage发送出去，不能对postMessage进行封装，否则webView无法接收到
        return { config, callbackName }
      }
    }).toString()

    this.injectRequestUtil = `(${injectRequestUtil})();`

    this.props.navigation.addListener('willFocus', () =>{
      // 获取配置，注入webView
      storage.get('config').then(config =>{
        if(config){
          if(!this.state.config){ return this.setState({ config }, this.loadContent) }
          if(JSON.stringify(config) !== JSON.stringify(this.state.config)){
            this.setState({ config }, this.loadContent)
          }
        }
      })
    })
  }
  
  componentDidMount (){
    if(this.props.link){
      this.loadContent()
    }else{
      this.setState({ html: this.props.html })
      this.writeContent(this.props.html)
      this.setState({ status: 3 })
    }
  }

  writeContent = html =>{
    // 载入资源（位于 /android/main/assets ）
    const styleTags = this.props.injectStyle ? this.props.injectStyle.reduce((prev, next) => 
      prev + `<link type="text/css" rel="stylesheet" href="css/${next}.css" />`, ''
    ) : ''

    const scriptTags = this.libScript.reduce((prev, next) => prev + `<script src="js/lib/${next}.js"></script>`, '')

    html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        ${styleTags}
        <style>${this.props.injectCss || ''}</style>
      </head>
      <body>
        <div id="webViewContainer" style="padding:0 5px; box-sizing:border-box;">${html}</div>
        ${scriptTags}
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          window._appConfig = ${JSON.stringify(this.state.config)};
          $(function(){ 
            try{
              ${this.injectRequestUtil};
              ${controlsCodeString};
              ${this.props.injectJs || ''} 
            }catch(e){
              ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: { name: e.name, message: e.message } }))
            }
          })
        </script>
      </body>
      </html>        
    `

    this.setState({ html })
  }

  loadContent = (forceLoad = false) =>{
    this.setState({ status: 2 })
    this.props.webView.getContent(this.props.link, forceLoad).then(data =>{
      this.props.onLoaded(data)
      var html = data.parse.text['*']
      this.writeContent(html)
      this.setState({ status: 3 })
    }).catch(async e =>{
      try{
        const redirectMap = await storage.get('articleRedirectMap') || {}
        var link = redirectMap[this.props.link] || this.props.link
        const articleCache = await storage.get('articleCache') || {}
        const data = articleCache[link]
        if(data){
          this.props.onLoaded(data)
          var html = data.parse.text['*']
          this.writeContent(html)          
          $dialog.dropToast.show('因读取失败，载入条目缓存')
          this.setState({ status: 3 })    // 将状态标记为：读取失败，载入缓存
        }else{
          throw new Error
        }
      }catch(e){
        console.log(e)
        toast.show('网络超时，读取失败')
        this.setState({ status: 0 })
      }
    })
  }

  injectScript = script =>{
    this.refs.webView.injectJavaScript(script)
  }
  
  receiveMessage = e =>{
    const {type, data} = JSON.parse(e.nativeEvent.data)
    
    if(type === 'print'){
      console.log('=== print ===', data)
    }

    if(type === 'error'){
      console.log('--- WebViewError ---', data)
    }

    if(this.props.disabledLink){ return }

    if(type === 'onTapLink'){
      ;({
        inner: () => this.props.navigation.push('article', { link: data.link }),

        outer (){
          $dialog.confirm.show({
            content: '这是一个外链，是否要打开外部浏览器进行访问？',
            onTapCheck: () => Linking.openURL(data.link)
          })
        },

        notExists (){
          $dialog.alert.show({ content: '该条目还未创建' })
        }
      })[data.type]()
    }

    if(type === 'request'){
      var { config, callbackName } = data
      request({
        baseURL: config.url,
        method: config.method,
        params: config.params
      }).then(data =>{
        // 数据中的换行会导致解析json失败
        this.injectScript(`window.${callbackName}(\`${JSON.stringify(data).replace(/\\n/g, '')}\`)`)
      }).catch(e =>{
        console.log(e)
        this.injectScript(`window.${callbackName}('${JSON.stringify({ error: true })}')`)
      })
    }

    if(type === 'openApp'){
      Linking.openURL(data.url)
    }

    if(type === 'onTapEdit'){
      if(this.props.state.user.name){
        this.props.navigation.push('edit', { title: data.page, section: data.section })
      }else{
        $dialog.confirm.show({
          content: '登录后才可以进行编辑，要前往登录界面吗？',
          onTapCheck: () => this.props.navigation.push('login')
        })
      }
    }

    if(type === 'onTapImage'){
      toast.showLoading('获取链接中')
      getImageUrl(data.name)
      .finally(toast.hide)
      .then(url =>{
        this.setState({ showingImg: url })
      }).catch(() => toast.show('获取链接失败'))
    }

    if(this.props.onMessages){
      ;(this.props.onMessages[type] || new Function)(data)
    }
  }

  render (){
    return (
      <View style={{ ...styles.container, ...this.props.style }}>
        {{
          0: () => <TouchableOpacity onPress={this.loadContent}>
            <Text style={{ fontSize: 18, color: $colors.main }}>重新加载</Text>
          </TouchableOpacity>,
          1: () => null,
          2: () => <ActivityIndicator color={$colors.main} size={50} />,
          3: () => <>
            <WebView allowFileAccess allowsFullscreenVideo
              cacheMode="LOAD_CACHE_ELSE_NETWORK"
              scalesPageToFit={false}
              source={{ html: this.state.html, baseUrl: this.baseUrl }}
              originWhitelist={['*']}
              style={{ width: Dimensions.get('window').width }}
              onMessage={this.receiveMessage}
              ref="webView"
            />

            <ImageViewer visible={!!this.state.showingImg} imgs={[{ url: this.state.showingImg }]} onClose={() => this.setState({ showingImg: '' })} />
          </>
          
        }[this.state.status]()}
      </View>
    )
  }
}

export default webViewHOC(userHOC(ArticleView))

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})