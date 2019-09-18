import React from 'react'
import {
  View, StyleSheet, Text, Dimensions, Linking, ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types'
import { WebView } from 'react-native-webview'
import { Button } from 'react-native-material-ui'
import toast from '~/utils/toast'
import storage from '~/utils/storage'
// import mainFuncForInjectScript from './mainFuncForInjectScript'
import store from '~/redux/webView'

import { controlsCodeString } from './controls/index' 

export default class ArticleView extends React.Component{
  static propTypes = {
    style: PropTypes.object,
    navigation: PropTypes.object,
    
    link: PropTypes.string,
    injectStyle: PropTypes.arrayOf(PropTypes.string),
    injectCss: PropTypes.string,
    // injectScript: PropTypes.arrayOf(PropTypes.string),
    injectJs: PropTypes.string,

    onMessages: PropTypes.objectOf(PropTypes.func),   // 接收webView的postMessage
    onLoaded: PropTypes.func
  }

  static defaultProps = {
    onLoaded: new Function
  }

  constructor (props){
    super(props)

    this.state = {
      html: '',
      status: 1
    }

    this.libScript = ['fastclick.min', 'jquery.min', 'require.min']

    this.baseUrl = 'file:///android_asset/assets'
  }
  
  componentDidMount (){
    this.loadContent()
  }

  writeContent (html){
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
        <div id="webViewContainer">${html}</div>
        ${scriptTags}
        <script>${this.props.injectJs || ''}</script>
      </body>
      </html>        
    `

    this.setState({ html })
  }

  loadContent = () =>{
    this.setState({ status: 2 })
    
    store._async.getContent(this.props.link).then(data =>{
      this.props.onLoaded(data)
      var html = data.parse.text['*']
      this.writeContent(html)
      this.setState({ status: 3 })
    }).catch(async e =>{
      console.log(e)
      try{
        const redirectMap = await storage.get('articleRedirectMap') || {}
        var link = redirectMap[this.props.link] || this.props.link
        const articleCache = await storage.get('articleCache') || {}
        const data = articleCache[link]
        console.log(redirectMap, articleCache)
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

  initialInjectScripts (){
    Object.values(webViewControls).split()
  }

  receiveMessage = e =>{
    const {type, data} = JSON.parse(e.nativeEvent.data)
    
    if(type === 'error'){
      console.log('--- WebViewError ---', data)
    }

    if(type === 'onTapLink'){
      ;({
        inner: () => this.props.navigation.push('article', { link: data.link }),

        outer (){
          Alert.alert('提示', '这是一个外链，是否要打开外部浏览器进行访问？', [
            { text: '确定', onPress: () => Linking.openURL('http://baidu.com') },
            { text: '取消' }
          ])
        },

        notExists (){
          $dialog.alert.show({ content: '该条目还未创建' })
        }
      })[data.type]()
    }

    if(this.props.onMessages){
      ;(this.props.onMessages[type] || new Function)(data)
    }
  }

  render (){
    return (
      <View style={{ ...styles.container, ...this.props.style }}>
        {{
          0: () => <Button primary text="重新加载" onPress={this.loadContent}></Button>,
          1: () => null,
          2: () => <ActivityIndicator color={$colors.main} size={50} />,
          3: () => <WebView allowFileAccess
            source={{ html: this.state.html, baseUrl: this.baseUrl }}
            originWhitelist={['*']}
            style={{ width: Dimensions.get('window').width }}
            onMessage={this.receiveMessage}
            onLoadEnd={() => this.injectScript(controlsCodeString)}
            ref="webView"
           />
        }[this.state.status]()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})