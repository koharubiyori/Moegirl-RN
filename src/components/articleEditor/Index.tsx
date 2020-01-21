import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Dimensions, Keyboard, ScrollView, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview'
import Button from '~/components/Button'

export interface Props {
  style?: StyleProp<ViewStyle>
  content: string
  onChangeText? (content: string): void
}

type FinalProps = Props

function ArticleEditor(props: PropsWithChildren<FinalProps>) {
  const [html, setHtml] = useState('')
  const [visibleQuickInsertBar, setVisibleQuickInertBar] = useState(false)
  const refs = {
    webView: useRef<any>()
  }

  useEffect(() => {
    if (html === '' && props.content !== '') setHtml(createDocument(props.content)) 
  }, [props.content])

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setVisibleQuickInertBar(true))
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setVisibleQuickInertBar(false))

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  function createDocument(content: string) {
    let js = function() {
      let edit = document.querySelector('#editArea')
      edit!.addEventListener('input', (e: any) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onInput', data: { text: e.target.value } }))
      })
    }.toString()

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

  function receiveMessage(e: any) {
    const { type, data } = JSON.parse(e.nativeEvent.data)

    if (type === 'print') {
      console.log('=== print ===', data)
    }

    if (type === 'error') {
      console.log('--- WebViewError ---', data)
    }

    if (type === 'onInput') {
      props.onChangeText && props.onChangeText(data.text)
    }
  }

  function insertCodes (codes: string, offset = 0) {
    let js = function(codes: string, offset: number) {
      let editor = document.querySelector('#editArea')! as HTMLTextAreaElement
      let content = editor.value
      let nowLocation = editor.selectionStart
      let beforeContent = content.substring(0, nowLocation)
      let afterContent = content.substring(nowLocation)

      editor.value = beforeContent + codes + afterContent
      let location = nowLocation + codes.length - offset
      editor.selectionStart = location
      editor.selectionEnd = location
      editor.focus()

      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onInput', data: { text: editor.value } }))
    }.toString()

    js = `(${js})("${codes}", ${offset})`

    refs.webView.current.injectJavaScript(js)
  }

  return (
    <>
      <WebView
        scalesPageToFit={false}
        source={{ html, baseUrl: 'file:///android_asset/assets' }}
        style={{ ...(props.style as any), width: Dimensions.get('window').width }}
        onMessage={receiveMessage}
        ref={refs.webView}
      />
      {visibleQuickInsertBar ? <>
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
      </> : null}
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

export interface QuickInsertItemProps {
  title?: string
  icon?: string
  onPress (): void
}

function QuickInsertItem (props: PropsWithChildren<QuickInsertItemProps>) {
  let width = Dimensions.get('window').width / 5
  width = width - width / 2 / 5

  return (
    <Button 
      rippleColor="#ccc" 
      style={{ width }} 
      contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={props.onPress}
    >
      {props.title 
        ? <Text style={{ fontSize: 20, color: '#666' }}>{props.title}</Text>
        : <MaterialCommunityIcon name={props.icon!} size={30} color="#666" />
      } 
    </Button>
  )
}