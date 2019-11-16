import React from 'react'
import PropTypes from 'prop-types'
import Orientation from 'react-native-orientation';
import {
  View, Text,
  StyleSheet
} from 'react-native'
import WebView from 'react-native-webview'

export default class BiliPlayer extends React.Component{
  static propTypes = {

  }

  constructor (props){
    super(props)
    this.state = {
      
    }

    this.avId = props.navigation.getParam('avId')
    this.page = props.navigation.getParam('page')
  }

  createHtmlDocument (){
    var js = (function(){
      window.addEventListener('fullscreenchange', function(){
        ReactNativeWebView.postMessage(JSON.stringify({ type: 'onFullScreenChange', data: { isFullScreen: !!document.fullscreenElement } }))
      })
    }).toString()

    // 要传入的html代码
    var injectJsCodes = `
      ${global.__DEV__ ? 'try{' : ''}
        (${js})();
      ${global.__DEV__ ? `
        }catch(e){
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: { name: e.name, message: e.message } }))
        }
      ` : ''}
    `

   
    var html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
          html{
            height: 100%;
          }

          body{
            height: 100%;
            background: black;
            display: flex;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <iframe src="https://player.bilibili.com/player.html?aid=${this.avId}&page=${this.page}" scrolling="no" framespacing="0" border="0" frameborder="no"  allowfullscreen="true" style="width:100%; background-color:#ccc;" class="bilibili-player"></iframe>
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          ${injectJsCodes};
        </script>
      </body>
      </html>      
    `   

    return html
  }

  receiveMessage = e =>{
    const {type, data} = JSON.parse(e.nativeEvent.data)

    if(type === 'print'){
      console.log('=== print ===', data)
    }

    if(type === 'error'){
      console.log('--- WebViewError ---', data)
    }

    if(type === 'onFullScreenChange'){
      data.isFullScreen ? Orientation.lockToLandscape() : Orientation.lockToPortrait()
    }
  }
  
  render (){
    return (
      <View style={{ flex: 1 }}>
        <WebView allowsFullscreenVideo
          scalesPageToFit={false}
          source={{ html: this.createHtmlDocument() }}
          onMessage={this.receiveMessage}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})