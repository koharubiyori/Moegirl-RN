import homeStyleSheet from '../styles/home'
import articleStyleSheet from '../styles/article'
import nightModeStyleSheet from '../styles/nightMode'
import hmoeHomeStyleSheet from '../styles/hmoeHome'
import hmoeArticleStyleSheet from '../styles/hmoeArticle'

// 注入一个请求器，用于通信
const requestorStr = function() {
  window._request = function(config: __ArticleWebView.WebViewRequestOptions, callback) {
    if (!window._requestId) window._requestId = 0 

    let callbackName = '_request_' + window._requestId
    
    ;(window as any)[callbackName] = callback
    window._requestId++

    window._postRnMessage('request', { config, callbackName })
  }
}.toString()

// 封装ReactNativeWebView.postMessage
const postRnMessageStr = function() {
  window._postRnMessage = function(type: string, payload?: { [key: string]: any }) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }))
  }
}.toString()

// 前置操作，这里用来执行屏蔽浏览器原生通知方法
const beforeStr = function() {
  window.alert = () => {}
  window.confirm = (() => {}) as any
  window.prompt = (() => {}) as any
}.toString()

const styleSheets = {
  home: homeStyleSheet,
  article: articleStyleSheet,
  nightMode: nightModeStyleSheet,
  hmoeHome: hmoeHomeStyleSheet,
  hmoeArticle: hmoeArticleStyleSheet
}

export type ArticleViewStyleSheetName = keyof typeof styleSheets

export interface CreateDocumentOptions {
  title?: string
  content?: string
  scripts?: ('jquery' | 'hammer')[]
  styles?: ArticleViewStyleSheetName[]
  injectCss?: string
  injectJs?: string
}

export default function createHTMLDocument(options: CreateDocumentOptions) {
  const styles = (options.styles || []).map(item => styleSheets[item as keyof typeof styleSheets] + '\n\n').join('')
  const scriptTags = (options.scripts || []).reduce((prev, item) => prev + `<script src="js/lib/${item}.js"></script>`, '')

  const scriptCodes = [
    beforeStr,
    requestorStr, 
    postRnMessageStr
  ].reduce((prev, item) => prev + `(${item})();`, '')

  let injectedScriptCodes = `
    ${scriptCodes}
    ${options.injectJs || ''}
  `
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${options.title || 'Document'}</title>
      <style>${styles}</style>
      <style>${options.injectCss || ''}</style>
    </head>
    <body>
      <div id="articleContentContainer" style="padding:0 5px; box-sizing:border-box;">${options.content}</div>
      ${scriptTags}
      <script>
        ${injectedScriptCodes}
        _postRnMessage('onReady')
      </script>
    </body>
    </html>        
  `
}