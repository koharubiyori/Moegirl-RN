import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Dimensions, Keyboard, ScrollView,
  StyleSheet
} from 'react-native'
import { WebView } from 'react-native-webview'
import Button from '~/components/Button'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

ArticleEditor.propTypes = {
  style: PropTypes.object,
  content: PropTypes.string,
  onChangeText: PropTypes.func
}

function ArticleEditor(props){
  const [html, setHtml] = useState('')
  const [visibleQuickInsertBar, setVisibleQuickInertBar] = useState(false)
  const refs = {
    webView: useRef()
  }

  useEffect(() =>{
    if(html === '' && props.content !== '') setHtml(createDocument(props.content)) 
  }, [props.content])

  useEffect(() =>{
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setVisibleQuickInertBar(true))
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setVisibleQuickInertBar(false))

    return () =>{
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  function createDocument(content){
    let js = (function(){
      var edit = document.querySelector('#editArea')
      edit.addEventListener('input', e =>{
        ReactNativeWebView.postMessage(JSON.stringify({ type: 'onInput', data: { text: e.target.value } }))
      })
    }).toString()

    let injectJsCodes = `
      ${global.__DEV__ ? 'try{' : ''}
        ;(${js})();
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
        <textarea id="editArea">${content}</textarea>
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          ${injectJsCodes};
        </script>
      </body>
      </html>      
    `  
  }

  function receiveMessage(e){
    const {type, data} = JSON.parse(e.nativeEvent.data)

    if(type === 'print'){
      console.log('=== print ===', data)
    }

    if(type === 'error'){
      console.log('--- WebViewError ---', data)
    }

    if(type === 'onInput'){
      props.onChangeText(data.text)
    }
  }

  function insertCodes (codes, offset = 0){
    let js = (function(codes, offset){
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

      ReactNativeWebView.postMessage(JSON.stringify({ type: 'onInput', data: { text: editor.value } }))
    }).toString()

    js = `(${js})("${codes}", ${offset})`

    refs.webView.current.injectJavaScript(js)
  }

  return (
    <>
      <WebView
        scalesPageToFit={false}
        source={{ html, baseUrl: 'file:///android_asset/assets' }}
        style={{ ...props.style, width: Dimensions.get('window').width }}
        onMessage={receiveMessage}
        ref={refs.webView}
      />
      {visibleQuickInsertBar ?
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickInsertBar}>
          <QuickInsertItem icon="fountain-pen-tip" onPress={() => insertCodes(' --~~~~')} />
          <QuickInsertItem title="[[ ]]" onPress={() => insertCodes('[[]]', 2)} />
          <QuickInsertItem title="{{ }}" onPress={() => insertCodes('{{}}', 2)} />
          <QuickInsertItem title="''' '''" onPress={() => insertCodes("''''''", 3)} />
          <QuickInsertItem title="|" onPress={() => insertCodes('|')} />
          <QuickInsertItem title="<del>" onPress={() => insertCodes('<del></del>', 6)} />
          <QuickInsertItem title="黑幕" onPress={() => insertCodes('{{黑幕|}}', 2)} />
          <QuickInsertItem title="==" onPress={() => insertCodes('==  ==', 3)} />
          <QuickInsertItem title="===" onPress={() => insertCodes('===  ===', 4)} />
        </ScrollView>
      : null}
    </>
  )
}

export default ArticleEditor

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
        <Text style={{ fontSize: 20, color: '#666' }}>{props.title}</Text>
      :
        <MaterialCommunityIcon name={props.icon} size={30} color="#666" />
      } 
    </Button>
  )
}