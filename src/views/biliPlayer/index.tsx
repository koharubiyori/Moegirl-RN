import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import Orientation from '@koharubiyori/react-native-orientation'
import WebView from 'react-native-webview'
import StatusBar from '~/components/StatusBar'

export interface Props {

}

export interface RouteParams {
  avId: number | string
  page: number | string
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function BiliPlayer(props: PropsWithChildren<FinalProps>) {
  const avId = props.navigation.getParam('avId')
  const page = props.navigation.getParam('page')

  function createDocument () {
    let js = function() {
      window.addEventListener('fullscreenchange', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onFullScreenChange', data: { isFullScreen: !!document.fullscreenElement } }))
      })
    }.toString()

    // 要传入的html代码
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
        <iframe src="https://player.bilibili.com/player.html?aid=${avId}&page=${page}" scrolling="no" framespacing="0" border="0" frameborder="no"  allowfullscreen="true" style="width:100%; background-color:#ccc;" class="bilibili-player"></iframe>
        <script>
          console.log = val => ReactNativeWebView.postMessage(JSON.stringify({ type: 'print', data: val }))
          ${injectJsCodes};
        </script>
      </body>
      </html>      
    `
  }

  function receiveMessage(event: any) {
    const { type, data } = JSON.parse(event.nativeEvent.data)

    if (type === 'print') {
      console.log('=== print ===', data)
    }

    if (type === 'error') {
      console.log('--- WebViewError ---', data)
    }

    if (type === 'onFullScreenChange') {
      data.isFullScreen ? Orientation.lockToLandscape() : Orientation.lockToPortrait()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <WebView allowsFullscreenVideo
        scalesPageToFit={false}
        source={{ html: createDocument() }}
        onMessage={receiveMessage}
      />
    </View>
  )
}

export default BiliPlayer