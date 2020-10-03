import { autorun } from 'mobx'
import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Linking, StyleProp, StyleSheet, Text, Vibration, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DOMParser } from 'react-native-html-parser'
import { useTheme } from 'react-native-paper'
import articleApi from '~/api/article'
import { ArticleApiData } from '~/api/article/types'
import useStateWithRef from '~/hooks/useStateWithRef'
import store from '~/mobx'
import request from '~/request/base'
import { colors, themeColorType } from '~/theme'
import articleCacheController from '~/utils/articleCacheController'
import dialog from '~/utils/dialog'
import globalNavigation from '~/utils/globalNavigation'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import { biliPlayerController } from '~/views/biliPlayer'
import HtmlWebView from '../htmlWebView'
import MyActivityIndicator from '../MyActivityIndicator'
import i from './lang'
import { getArticleContent } from './utils/articleRamCache'
import createMoegirlRendererConfig from './utils/createMoegirlRendererConfig'
import showNoteDialog from './utils/showNoteDialog'

export interface Props {
  style?: StyleProp<ViewStyle>
  pageName?: string
  html?: string
  disabledLink?: boolean
  injectedStyles?: string[]
  injectedScripts?: string[]
  messageHandlers?: {
    [messageName: string]: (data: any) => void
  }
  contentTopPadding?: number
  centerOffset?: number
  inDialogMode?: boolean // 嵌入dialog模式下隐藏dialog组件，防止组件无限递归引入
  onArticleLoaded?(articleData: ArticleApiData.GetContent): void
  onArticleMissing?(pageName: string): void
  onArticleError?(pageName: string): void
  getRef?: MutableRefObject<any>
}

export interface ArticleViewRef {
  reload(force?: boolean): void
  injectScript(script: string): void
}

;(ArticleView as DefaultProps<Props>).defaultProps = {
  centerOffset: 0,
  contentTopPadding: 0
}

const nightModeJsExecutingWait = 1000

function ArticleView(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = globalNavigation.current // 因为这个组件会被showNoteDialog挂载到根组件上，会导致拿不到导航器上下文，所以使用全局导航器
  const [articleHtml, setArticleHtml] = useState('')
  const [articleData, setArticleData] = useState<ArticleApiData.GetContent>()
  const [originalImgUrls, setOriginalImgUrls] = useState<{ name: string, url: string }[]>()
  const [status, setStatus, statusRef] = useStateWithRef<0 | 1 | 2 | 3>(1)
  const refs = {
    htmlWebView: useRef<any>()
  }

  if (props.getRef) props.getRef.current = { reload: loadContent, injectScript, injectStyle }

  useEffect(() => {
    if (props.pageName) {
      loadContent()
    } else {
      setArticleHtml(props.html!)
      setTimeout(() => setStatus(3), nightModeJsExecutingWait)
    }
  }, [])

  useEffect(() => {
    articleData && props.onArticleLoaded && props.onArticleLoaded(articleData)
  }, [articleData])

  useEffect(() => autorun(() => {
    const enabled = store.settings.heimu
    if (statusRef.current === 1) { return } 
    injectScript(`moegirl.config.heimu.$enabled = ${enabled}`)
  }), [])

  // 加载文章内容，有三层缓存机制，一层是运行时缓存，一层是每次加载完成后存的缓存文件(用到了缓存文件时，会发出提示)
  // 实际使用时发现还有接口缓存，缓存考虑可能是萌百的响应返回了max-age（已经禁用）
  async function loadContent(forceLoad = false) {
    if (statusRef.current === 2) { return }
    
    setStatus(2)
    // 如果启用了缓存优先模式且当前不是分类或讨论页
    const isCanUseCache = !/^([Cc]ategory|分类|分類|[Tt]alk|.+ talk):/.test(props.pageName!)
    if (!forceLoad && store.settings.cachePriority && isCanUseCache) {
      const redirectMap = storage.get('articleRedirectMap') || {}
      let trueTitle = redirectMap[props.pageName!] || props.pageName
      
      try {
        let articleCache = await articleCacheController.getCacheData(trueTitle!)
        if (articleCache) {
          const { articleData, lastModified } = articleCache
          setArticleHtml(articleData.parse.text['*'])
          loadOriginalImgUrls(articleData.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
          setArticleData(articleData)
          // toast(`载入${diffDate(new Date(lastModified))}的缓存`)
  
          // 后台请求一次文章数据，更新缓存
          getArticleContent(props.pageName!, true)
            .then(data => {
              const trueTitle = data.parse.title
              articleCacheController.addCache(trueTitle, data)
              // 如果请求title和真实title不同，则存入文章名重定向映射表
              if (props.pageName !== trueTitle) storage.merge('articleRedirectMap', { [props.pageName!]: trueTitle })
            })
          return
        }
      } catch (e) {
        console.log('读取文章持久化缓存流程失败', e)
      }
    }

    getArticleContent(props.pageName!, forceLoad) // 这个函数封装了运行时缓存
      .then(data => {
        let html = data.parse.text['*']
        // 如果为分类页，则从html字符串中抽取数据，然后交给category界面处理
        if (/^([Cc]ategory|分类|分類):/.test(props.pageName!)) {
          const htmlDoc = new DOMParser().parseFromString(html, 'text/html')
          let categoryBranchContainer = htmlDoc.getElementById('topicpath')
          let descContainer = htmlDoc.getElementById('catmore')
          let categoryBranch: string[] | null = null
          let articleTitle: string | null = null

          if (categoryBranchContainer) {
            categoryBranch = Array.from(categoryBranchContainer.getElementsByTagName('a')).map(item => item.textContent!)
          }
          if (descContainer) {
            articleTitle = descContainer.getElementsByTagName('a')[0].getAttribute('title')
          }

          return setTimeout(() => {
            navigation.replace('category', { 
              title: props.pageName!.replace(/^([Cc]ategory|分类|分類):/, ''), 
              branch: categoryBranch,
              articleTitle 
            })
          }, 250) // 延迟250毫秒，防止动画还没播完就跳转了
        }

        setArticleHtml(html)
        
        // 无法显示svg，这里过滤掉
        loadOriginalImgUrls(data.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
          .catch(e => console.log('文章图片链接获取失败', e))

        setArticleData(data)

        const trueTitle = data.parse.title
        articleCacheController.addCache(trueTitle, data)
          .catch(e => console.log('添加文章缓存失败', e))

        // 如果请求title和真实title不同，则存入文章名重定向映射表
        if (props.pageName !== trueTitle) storage.merge('articleRedirectMap', { [props.pageName!]: trueTitle })
      })
      .catch(async e => {
        console.log('文章接口数据加载流程出现错误', e)
        if (e && e.code === 'missingtitle') return props.onArticleMissing && props.onArticleMissing(props.pageName!)

        try {
          const redirectMap = storage.get('articleRedirectMap') || {}
          let trueTitle = redirectMap[props.pageName!] || props.pageName
          
          let articleCache = await articleCacheController.getCacheData(trueTitle!)
          if (!articleCache) throw new Error('文章缓存不存在')
          
          const articleData = articleCache.articleData
          let html = articleData.parse.text['*']
          setArticleHtml(html)
          
          toast(i.index.netErrExistsCache)
          loadOriginalImgUrls(articleData.parse.images.filter(imgName => !/\.svg$/.test(imgName)))
          setArticleData(articleData)
          
        } catch (e) {
          console.log(e)
          toast(i.index.netErr)
          setStatus(0)
        }
      })
  }

  // 加载原始图片列表
  function loadOriginalImgUrls(imgs: string[]) {
    return articleApi.getImagesUrl(imgs)
      .then(imageUrlMaps => {
        setOriginalImgUrls(Object.entries(imageUrlMaps).map(([name, url]) => ({ name, url })))
      })
  }

  function injectScript(script: string) {
    if (!refs.htmlWebView.current) { return }
    refs.htmlWebView.current!.injectJavaScript(script)
  }

  function injectStyle(style: string) {    
    injectScript(`
      (() => {
        const styleTag = document.createElement('style')
        styleTag.innerHTML = \`${style}\`
        document.body.appendChild(styleTag)
      })()
    `)
  }
  
  const messageHandlers: { [messageName: string]: (data: any) => void } = {
    link(_data) {
      const { type, data } = _data
      ;(({
        article() {
          if (props.disabledLink) { return }
          navigation.push('article', {
            pageName: data.pageName,
            anchor: data.anchor,
            displayPageName: data.displayName
          })
        },

        img() {
          if (originalImgUrls) {
            navigation.push('imageViewer', { 
              imgs: originalImgUrls.map(img => ({ url: img.url })),
              index: originalImgUrls.findIndex(img => img.name === data.name.replace(/_/g, ' '))
            })
          } else {
            dialog.loading.show({ title: i.index.events.pressImage.loading, allowUserClose: true })
            articleApi.getImagesUrl([data.name!])
              .finally(dialog.loading.hide)
              .then(imageUrlMaps => {
                navigation.push('imageViewer', { imgs: [{ url: Object.values(imageUrlMaps)[0] }], index: 0 })
              })
          }
        },

        note() {
          showNoteDialog(data.html)
        },

        anchor() {
          injectScript(`moegirl.method.link.gotoAnchor('${data.id}', -${props.contentTopPadding})`)
        },

        notExist() {
          dialog.alert.show({ content: i.index.events.noExists })
        },

        edit() {
          if (props.disabledLink) { return }
          if (store.user.isLoggedIn) {
            navigation.push('edit', { 
              title: data.pageName, 
              section: data.section,
              newSection: data.section === 'new' 
            })
          } else {
            dialog.confirm.show({ content: i.index.events.loginMsg })
              .then(() => navigation.push('login'))
          }
        },

        notExistEdit() {
          dialog.alert.show({ content: i.index.events.noExists })
        },

        watch() {

        },

        external() {
          Linking.openURL(data.url)
        },

        externalImg() {
          navigation.push('imageViewer', { imgs: [{ url: data.url! }], index: 0 })
        },

        unparsed() {},
      } as any)[type] || (() => {}))()
    },

    biliPlayer(data) {
      biliPlayerController.start(data.videoId, parseInt(data.page), data.type === 'bv')
    },

    biliPlayerLongPress(data) {
      Linking.openURL(`https://www.bilibili.com/video/${data.videoId}?p=${data.page}`)
    },

    request(data) {
      request({
        url: data.url,
        method: data.method,
        params: data.data
      })
        .then(res => injectScript(`moegirl.config.request.callbacks['${data.callbackId}'].resolve(${JSON.stringify(res.data)})`))
        .catch(e => injectScript(`moegirl.config.request.callbacks['${data.callbackId}'].reject(${JSON.stringify(e)})`))
    },

    vibrate() {
      setTimeout(() => Vibration.vibrate(25))
    },

    ...props.messageHandlers
  }

  const isNightTheme = store.settings.theme === 'night'

  const themeColor = colors[store.settings.theme]
  const injectedStyles = [
    `
      body { 
        user-select: none;
        padding-top: ${props.contentTopPadding}px;
        word-break: ${props.inDialogMode ? 'break-all' : 'initial'};
        ${props.inDialogMode && isNightTheme ? 
          `background-color: ${colors.night.primary} !important;`
        : ''}
      }

      ${store.settings.theme !== 'night' ? `
        :root {
          --color-primary: ${themeColor.primary};
          --color-dark: ${themeColor.dark};
          --color-light: ${themeColor.light};
        }
      ` : ''}
    `,
  ].concat(props.injectedStyles || [])

  const injectedScripts = [
    `
      moegirl.config.heimu.$enabled = ${store.settings.heimu}
      moegirl.config.addCopyright.enabled = ${!props.inDialogMode}
      moegirl.config.nightTheme.$enabled = ${isNightTheme}
    `,
    createMoegirlRendererConfig({
      pageName: props.pageName || '',
      categories: articleData ? articleData.parse.categories.map(item => item['*']) : []
    }),
  ].concat(props.injectedScripts || [])

  return (
    <View style={props.style}>
      <HtmlWebView 
        dataReady={!!(articleData || props.html)}
        getRef={refs.htmlWebView}
        title={props.pageName}
        body={articleHtml}
        css={['main.css']}
        js={['main.js']}
        injectedStyles={injectedStyles}
        injectedScripts={injectedScripts}
        messageHandlers={messageHandlers}
        // 如果使用夜晚模式，则多留出一些时间用来加载js
        onLoaded={() => setTimeout(() => setStatus(3), isNightTheme ? nightModeJsExecutingWait : 300)}
      />

      {status !== 3 &&
        <View style={{ ...styles.mask, backgroundColor: theme.colors.background }}>
          <View style={{ position: 'relative', top: props.centerOffset }}>
            {{
              0: () => 
                <TouchableOpacity onPress={() => loadContent(true)}>
                  <Text style={{ fontSize: 18, color: theme.colors.accent }}>{i.index.reload}</Text>
                </TouchableOpacity>,
              1: () => null,
              2: () => <MyActivityIndicator size={50} />,
              3: () => null
            }[status]()}
          </View>
        </View>
      }
    </View>
  )
}

export default ArticleView

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
})