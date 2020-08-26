import { colors } from '~/theme'
import { SettingsStoreData } from '~/mobx/settings'
import articleWebViewWords from '~/components/articleView/lang/zh-hans'

export = ArticleWebView

export as namespace __ArticleWebView

declare namespace ArticleWebView {
  interface InjectedProperty {
    RLQ?: ((...args: any[]) => void)[] // 拿到的条目数据中可能包含脚本，会将脚本push到window.RLQ中
    
    ReactNativeWebView: { postMessage: (msg: string) => void }
    _postRnMessage<T extends keyof ArticleWebView.MessagePayloadMaps>(type: T, payload?: ArticleWebView.MessagePayloadMaps[T]): void
    _request (config: WebViewRequestOptions, callback: (data: any) => void): void // 注入一个请求器
    _requestId: number // 请求回调的自增id
    _settings: SettingsStoreData // app设置
    _colors: typeof colors.green // 当前主题色集
    _categories: string[] // 分类
    _articleTitle: { text: string } // 文章标题
    _i: {
      controls: typeof articleWebViewWords.controls,
      scripts: typeof articleWebViewWords.scripts
    }
  }

  interface WebViewRequestOptions {
    url: string
    method: 'get' | 'post'
    params: { [key: string]: any }
  }

  interface MessagePayloadMaps {
    print: { text: string }
    error: { text: string }
    onReady: undefined
    onPressNote: { content: string }
    request: {
      config: {
        url: string
        method: 'get' | 'post'
        params: object
      }
      callbackName: string
    }
    onPressLink: {
      type: 'inner' | 'outer' | 'notExists'
      link: string
      displayTitle: string
    }
    openApp: { url: string }
    onPressEdit: {
      page: string
      section: number
    }
    onPressImage: { name: string }
    onPressBiliVideo: {
      avId: string
      page: string
    }
    vibrate: undefined
  }
}