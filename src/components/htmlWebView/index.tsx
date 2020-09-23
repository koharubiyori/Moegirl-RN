import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import WebView from 'react-native-webview'
import createHtmlDocument from './utils/createHtmlDocument'

export interface Props {
  dataReady: boolean
  title?: string
  body: string
  css?: string[]
  js?: string[]
  injectedStyles?: string[]
  injectedScripts?: string[]
  messageHandlers?: {
    [messageName: string]: (data: any) => void
  }
  onLoaded?(): void
  style?: StyleProp<ViewStyle>
  getRef?: MutableRefObject<any>
}

;(HtmlWebView as DefaultProps<Props>).defaultProps = {
  title: 'Document',
  css: [],
  js: [],
  injectedStyles: [],
  injectedScripts: [],
  messageHandlers: {},
}

const baseUrl = 'file:///android_asset/assets'

function HtmlWebView(props: PropsWithChildren<Props>) {
  const [html, setHtml] = useState(createHtml())
  const isLoaded = useRef(false)
  const webViewRef = useRef<any>()
  
  if (props.getRef) props.getRef.current = webViewRef.current

  useEffect(() => {
    setHtml(createHtml())
  }, [props])

  function createHtml() {
    const injectedScript = [
      // 封装postMessage函数
      `
        window._postRnMessage = function(type, data) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }))
        }
      `,
      ...(props.injectedScripts || []),
      // 添加onload钩子
      `
        _postRnMessage('loaded')
      `,
    ]

    return createHtmlDocument({
      title: props.title,
      body: props.body,
      css: props.css,
      js: props.js,
      injectedStyles: props.injectedStyles,
      injectedScripts: injectedScript
    })
  }

  function receiveMessage(event: any) {
    const { type, data } = JSON.parse(event.nativeEvent.data)
    if (type === 'loaded') {
      isLoaded.current = true
      props.onLoaded && props.onLoaded()
    } else {
      const handler = props.messageHandlers![type]
      handler && handler(data)
    }
  }

  return (
    <View renderToHardwareTextureAndroid style={{ flex: 1, ...(props.style as any) }}>
      {props.dataReady &&
        <WebView allowFileAccess domStorageEnabled
          style={{ flex: 1 }}
          scalesPageToFit={false}
          showsHorizontalScrollIndicator={false}
          androidLayoutType="hardware"
          originWhitelist={['*']}
          source={{ html: html, baseUrl }}
          onMessage={receiveMessage}
          ref={webViewRef}
        />
      }
    </View>
  )
}

export default HtmlWebView

const styles = StyleSheet.create({
  
})