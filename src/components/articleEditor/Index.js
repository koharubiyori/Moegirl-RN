import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Dimensions, Keyboard, ScrollView,
  StyleSheet
} from 'react-native'
import { WebView } from 'react-native-webview'
import Button from '~/components/Button'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ArticleEditor extends React.Component{
  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string,
    onChangeText: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {
      html: '',
      visibleQuickInsertBar: false
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
        ;(${js})();
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
          @font-face{
            font-family: 'Consolas';
            src: url('fonts/consolas.ttf');
          }

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
            caret-color: #007ACC;
            resize: none;
            font-family: 'Consolas'
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

    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ visibleQuickInsertBar: true }))
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ visibleQuickInsertBar: false }))
  }

  componentWillUnmount (){
    this.keyboardShowListener.remove()
    this.keyboardHideListener.remove()
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
      this.props.onChangeText(data.text)
    }
  }

  insertCodes = (codes, offset = 0) =>{
    var js = (function(codes, offset){
      var editor = document.querySelector('#editArea')
      var content = editor.value
      var nowLocation = editor.selectionStart
      var beforeContent = content.substring(0, nowLocation)
      var afterContent = content.substring(nowLocation)

      editor.value = beforeContent + codes + afterContent
      var location = nowLocation + codes.length - offset
      editor.selectionStart = location
      editor.selectionEnd = location
      editor.focus()
    }).toString()

    js = `(${js})("${codes}", ${offset})`

    this.refs.webView.injectJavaScript(js)
  }

  render (){
    return (
      <>
        <WebView
          scalesPageToFit={false}
          source={{ html: this.html, baseUrl: 'file:///android_asset/assets' }}
          style={{ ...this.props.style, width: Dimensions.get('window').width }}
          onMessage={this.receiveMessage}
          ref="webView"
        />
        {this.state.visibleQuickInsertBar ?
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickInsertBar}>
            <QuickInsertItem icon="fountain-pen-tip" onPress={() => this.insertCodes(' --~~~~')} />
            <QuickInsertItem title="[[ ]]" onPress={() => this.insertCodes('[[]]', 2)} />
            <QuickInsertItem title="{{ }}" onPress={() => this.insertCodes('{{}}', 2)} />
            <QuickInsertItem title="''' '''" onPress={() => this.insertCodes("''''''", 3)} />
            <QuickInsertItem title="|" onPress={() => this.insertCodes('|')} />
            <QuickInsertItem title="<del>" onPress={() => this.insertCodes('<del></del>', 6)} />
            <QuickInsertItem title="黑幕" onPress={() => this.insertCodes('{{黑幕|}}', 2)} />
            <QuickInsertItem title="== ==" onPress={() => this.insertCodes('==  ==', 3)} />
            <QuickInsertItem title="=== ===" onPress={() => this.insertCodes('===  ===', 4)} />
          </ScrollView>
        : null}
      </>
    )
  }
}

const styles = StyleSheet.create({
  quickInsertBar: {
    maxHeight: 40,
    backgroundColor: 'white',
    borderTopColor: '#ccc',
    borderTopWidth: 1
  }
})

function QuickInsertItem (props){
  var width = Dimensions.get('window').width / 5
  width = width - width / 2 / 5

  return (
    <Button 
      rippleColor="#ccc" 
      style={{ width }} 
      contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={props.onPress}
    >
      {props.title ? 
        <Text style={{ fontSize: 20, color: '#ABABAB' }}>{props.title}</Text>
      :
        <MaterialCommunityIcon name={props.icon} size={30} color="#ABABAB" />
      } 
    </Button>
  )
}