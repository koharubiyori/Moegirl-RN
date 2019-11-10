import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Dimensions,
  StyleSheet
} from 'react-native'
import { WebView } from 'react-native-webview'

export default class ArticleEditor extends React.Component{
  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string,
    onChangeText: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {
      html: ''
    }

    this.content = this.props.value

    var js = (function(){
      var edit = document.querySelector('#editArea')
      edit.addEventListener('input', e =>{
        ReactNativeWebView.postMessage(JSON.stringify({ type: 'onInput', data: { text: e.target.value } }))
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

    this.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
          html, body{
            height: 100%;
            margin: 0;
          }
          
          #editArea{
            width: 100%;
            height: 100%;
            overflow-y: auto;
            border: none;
            outline: none;
            box-sizing: border-box;
            background-color: white;
            font-size: 14px;
            caret-color: #3CAD3D;
          }
        </style>
      </head>
      <body>
        <textarea id="editArea">${this.content}</textarea>
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          ${injectJsCodes};
        </script>
      </body>
      </html>      
    `   
  }
  
  receiveMessage = e =>{
    const {type, data} = JSON.parse(e.nativeEvent.data)

    if(type === 'print'){
      console.log('=== print ===', data)
    }

    if(type === 'error'){
      console.log('--- WebViewError ---', data)
    }

    if(type === 'onInput'){
      console.log(data)
      this.props.onChangeText(data.text)
    }
  }

  render (){
    return (
      <WebView
        scalesPageToFit={false}
        source={{ html: this.html }}
        style={{ ...this.props.style, width: Dimensions.get('window').width }}
        onMessage={this.receiveMessage}
      />
    )
  }
}

const styles = StyleSheet.create({
  
})