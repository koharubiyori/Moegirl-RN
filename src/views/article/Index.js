import React from 'react'
import {
  View, Text,
  StyleSheet, NativeModules,
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/webView/ArticleView'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import CatalogTriggerView from './catalogTriggerView/index'
import CommentBtn from './FloatButton'
import storage from '~/utils/storage'
import saveHistory from '~/utils/saveHistory'
import toast from '~/utils/toast'

const NavigationContext = React.createContext()

export { NavigationContext }

export default class Article extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)

    this.state = {
      link: props.navigation.getParam('link'),
      pageName: props.navigation.getParam('link'),
      id: 0,

      catalogItems: [],
      firstData: null,

      immersionMode: false
    }

    this._refs = {
      header: null,
      articleView: null
    }

    // 给webview注入的字符串js代码
    var injectedJs = (function(){
      var lastPosition = 0,
      postMessageFlag = false   // 设置一个标记，防止和webview通信过频降低性能

      $(window).scroll(function(){
        function changeHeaderVisible(status){
          if(postMessageFlag){ return }
          postMessageFlag = true
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'changeHeaderVisible', data: status }))
          setTimeout(() => postMessageFlag = false, 50)
        }

        if(window.scrollY < 100){
          changeHeaderVisible(true)
          return true
        }

        changeHeaderVisible(!(window.scrollY > lastPosition))
        lastPosition = window.scrollY
      })
    }).toString()

    this.articleViewInjectJs = `(${injectedJs})();`

    this.props.navigation.addListener('willFocus', () =>{
      // 读取配置
      storage.get('config').then(config => config && this.setState({ immersionMode: config.immersionMode }))
    })
  }

  // 接收需要隐藏或显示header的指令
  changeHeaderVisible = isVisible =>{
    const {show, hide} = this._refs.header
    const {show: showBtn, hide: hideBtn} = this.refs.commentBtn
    isVisible ? show() : hide()
    isVisible ? showBtn() : hideBtn()
  }

  contentLoaded = data =>{
    var title = this.state.pageName
    var trueTitle = data.parse.title

    // 写入缓存
    storage.merge('articleCache', { [trueTitle]: data })

    if(title !== trueTitle){
      $dialog.dropToast.show(`“${this.state.pageName}”被重定向至此页`)

      // 记录至文章重定向表
      storage.merge('articleRedirectMap', { [title]: trueTitle })
    }

    saveHistory(trueTitle)

    this.setState({
      // 名字不一样要提示
      pageName: trueTitle,
      catalogItems: data.parse.sections,
      id: data.parse.pageid
    })
  }

  articleViewIntoAnchor = anchor =>{
    this._refs.articleView.injectScript(`
      document.getElementById('${anchor}').scrollIntoView({ behavior: 'smooth' })
    `)
  }

  toComment = () =>{
    if(!this.state.firstData){ return toast.show('加载评论中，请稍候') }
    this.props.navigation.push('comment', { id: this.state.id, title: this.state.pageName, firstData: this.state.firstData })
  }

  render (){
    const articleViewInjectCss = `
      body {
        padding-top: ${ this.state.immersionMode ? '55px' : '' + (55 + NativeModules.StatusBarManager.HEIGHT) + 'px'};
      }
    `
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <StatusBar hidden={this.state.immersionMode} />
        <Header style={{ ...styles.header, top: this.state.immersionMode ? -NativeModules.StatusBarManager.HEIGHT : 0 }}
          navigation={this.props.navigation}
          title={this.state.pageName}
          onTapRefreshBtn={() => this._refs.articleView.loadContent(true)}
          onTapOpenCatalog={() => this.refs.catalog.showCatalog()}
          getRef={self => this._refs.header = self}
        />

        {/* 这只是一个普通的view，但被绑定了滑动显示catalog的事件 */}
        <CatalogTriggerView style={{ flex: 1 }} items={this.state.catalogItems} onTapTitle={this.articleViewIntoAnchor} ref="catalog">
         <ArticleView style={{ flex: 1 }} navigation={this.props.navigation}
            link={this.state.link}
            injectStyle={['page']}
            injectCss={articleViewInjectCss}
            injectJs={this.articleViewInjectJs}
            onMessages={{ changeHeaderVisible: this.changeHeaderVisible }}
            onLoaded={this.contentLoaded}
            getRef={self => this._refs.articleView = self}
          />
        </CatalogTriggerView>

        {this.state.id ? <CommentBtn ref="commentBtn" id={this.state.id}
          onTap={this.toComment}
          onLoaded={data => this.setState({ firstData: data })}
        /> : null }
      </NavigationContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
  }
})