import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Dimensions, Keyboard, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview'
import MyButton from '~/components/MyButton'
import store from '~/mobx'
import { colors } from '~/theme'
import i from './lang'

export interface Props {
  style?: StyleProp<ViewStyle>
  content: string | null
  onChangeText? (content: string): void
  getRef?: MutableRefObject<any>
}

export interface ArticleEditorRef {
  injectScript(script: string): void
}

function ArticleEditor(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const [html, setHtml] = useState('')
  // 用两个变量判断是否显示快速插入栏，防止页面上有其他输入栏被focus时显示快速插入栏或键盘没有展开时显示
  const [isShowKeyboard, setIsShowKeyboard] = useState(false)
  const [isFocusedEditor, setIsFocusedEditor] = useState(false)
  const [visibleQuickInsertBar, setVisibleQuickInertBar] = useState(false)
  const refs = {
    webView: useRef<any>()
  }

  if (props.getRef) {
    props.getRef.current = {
      injectScript: (script: string) => refs.webView.current.injectJavaScript(script)
    }
  }

  useEffect(() => {
    if (html === '' && props.content !== null) setHtml(createDocument(props.content)) 
  }, [props.content])

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setIsShowKeyboard(true))
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setIsShowKeyboard(false))

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  useEffect(() => {
    setVisibleQuickInertBar(isShowKeyboard && isFocusedEditor)
  }, [isShowKeyboard, isFocusedEditor])

  function createDocument(content: string) {
    let injectedJs = function() {
      let edit = document.querySelector('#editArea')
      edit!.addEventListener('input', (e: any) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onInput', data: { text: e.target.value } }))
      })

      edit!.addEventListener('focus', () => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onFocus' }))
      })

      edit!.addEventListener('blur', () => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onBlur' }))
      })
    }.toString()

    let injectJsCodes = `
      ;(${injectedJs})();
    `

    const isNightMode = store.settings.theme === 'night'
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>articleEditor</title>
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
            background-color: ${isNightMode ? colors.night.primary : 'white'};
            color: ${isNightMode ? colors.night.text : 'black'};
            font-size: 14px;
            caret-color: ${colors.teal.primary};
            resize: none;
            font-family: 'Consolas'
          }
        </style>
      </head>
      <body>
        <textarea id="editArea" placeholder="${i.index.placeholder}">${content.replace(/&/g, '&amp;')}</textarea>
        <script>
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
      console.log(data.text)
      props.onChangeText && props.onChangeText(data.text)
    }

    if (type === 'onFocus') {
      setIsFocusedEditor(true)
    }

    if (type === 'onBlur') {
      setIsFocusedEditor(false)
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
    <View renderToHardwareTextureAndroid>
      <WebView
        scalesPageToFit={false}
        androidLayoutType="hardware"
        source={{ html, baseUrl: 'file:///android_asset/assets' }}
        style={{ ...(props.style as any), width: Dimensions.get('window').width }}
        onMessage={receiveMessage}
        ref={refs.webView}
      />
      {visibleQuickInsertBar ? <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} 
          style={{ 
            ...styles.quickInsertBar, 
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.placeholder 
          }}>
          <QuickInsertItem title="[[ ]]" subtitle={i.index.quickInsert.link} onPress={() => insertCodes('[[]]', 2)} />
          <QuickInsertItem title="{{ }}" subtitle={i.index.quickInsert.template} onPress={() => insertCodes('{{}}', 2)} />
          <QuickInsertItem title="|" subtitle={i.index.quickInsert.pipe} onPress={() => insertCodes('|')} />
          <QuickInsertItem title="*" subtitle={i.index.quickInsert.unorderedList} onPress={() => insertCodes('* ')} />
          <QuickInsertItem title="#" subtitle={i.index.quickInsert.orderedList} onPress={() => insertCodes('# ')} />
          <QuickInsertItem icon="fountain-pen-tip" subtitle={i.index.quickInsert.sign} onPress={() => insertCodes(' --~~~~')} />
          <QuickInsertItem title="''' '''" subtitle={i.index.quickInsert.strong} onPress={() => insertCodes("''''''", 3)} />
          <QuickInsertItem title="<del>" subtitle={i.index.quickInsert.del} onPress={() => insertCodes('<del></del>', 6)} />
          <QuickInsertItem title="==" subtitle={i.index.quickInsert.title} onPress={() => insertCodes('==  ==', 3)} />
          <QuickInsertItem title="===" subtitle={i.index.quickInsert.subtitle} onPress={() => insertCodes('===  ===', 4)} />
          <QuickInsertItem title={i.index.quickInsert.heimu} onPress={() => insertCodes('{{黑幕|}}', 2)} />
          <QuickInsertItem title={i.index.quickInsert.coloredText} onPress={() => insertCodes('{{color|red|text}}', 2)} />
        </ScrollView>
      </> : null}
    </View>
  )
}

export default ArticleEditor

const styles = StyleSheet.create({
  quickInsertBar: {
    maxHeight: 45,
    borderTopWidth: 1
  }
})

export interface QuickInsertItemProps {
  title?: string
  icon?: string
  subtitle?: string
  onPress (): void
}

function QuickInsertItem (props: PropsWithChildren<QuickInsertItemProps>) {
  const theme = useTheme()
  let width = Dimensions.get('window').width / 5
  width = width - width / 2 / 5

  return (
    <MyButton noRippleLimit
      rippleColor={theme.colors.accent}
      style={{ width }} 
      contentContainerStyle={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
      onPress={props.onPress}
    >
      <View style={{ height: 25 }}>
        {props.title ? <>
          <Text style={{ fontSize: 18, color: theme.colors.disabled }}>{props.title}</Text>
        </> : <>
          <MaterialCommunityIcon name={props.icon!} size={28} color={theme.colors.disabled} style={{ marginVertical: -2 }} />
        </>}
      </View>

      {props.subtitle ? <>
        <Text style={{ fontSize: 9, textAlign: 'center', color: theme.colors.disabled, }}>{props.subtitle}</Text>
      </> : null}
    </MyButton>
  )
}