import React from 'react'
import { 
  View, Text,
  StyleSheet, NativeModules, DeviceEventEmitter
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/articleView/Index'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import CatalogTriggerView from './catalogTriggerView/index'
import CommentButton from './CommentButton'
import storage from '~/utils/storage'
import saveHistory from '~/utils/saveHistory'
import toast from '~/utils/toast'
import commentHOC from '~/redux/comment/HOC'
import store from '~/redux'

class Article extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)

    this.state = {
      link: props.navigation.getParam('link'),
      anchor: props.navigation.getParam('anchor'),
      pageName: props.navigation.getParam('link'),
      id: 0,

      catalogItems: [],
      firstData: null,
      visibleHeader: true     // 主要用于给statusBar的颜色变化做判断
    }

    this._refs = {
      header: null,
      articleView: null,
      commentButton: null
    }

    this.articleViewInjectCss = `
      body {
        padding-top: 55px;
      }
    `

    // 给webview注入的字符串js代码，一定要使用匿名函数，否则编译后会出问题
    var injectedJs = (function(){
      var lastPosition = 0,
      activeDistance = 0,       // 用于判断上划一定距离后再显示头栏和评论按钮
      postMessageFlag = false   // 设置一个标记，防止和webview通信过频降低性能

      $(window).scroll(function(){
        function changeHeaderVisible(status){
          if(postMessageFlag){ return }
          postMessageFlag = true
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'changeHeaderVisible', data: status }))
          setTimeout(() => postMessageFlag = false, 50)
        }

        if(window.scrollY < 100){
          activeDistance = 0
          changeHeaderVisible(true)
          return true
        }

        if(window.scrollY < lastPosition){
          activeDistance += 2
          if(activeDistance >= 100){
            activeDistance = 0
            changeHeaderVisible(true)
          }
        }else{
          activeDistance = 0
          changeHeaderVisible(false)
        }
        
        lastPosition = window.scrollY
      })
    }).toString()

    this.articleViewInjectJs = `(${injectedJs})();`

    // 后退后设置当前页面comment的activeId
    this.props.navigation.addListener('didFocus', () =>{
      this.state.id && props.comment.setActiveId(this.state.id)
    })

    // 防止后退后看不到标题
    this.articleChangeListener = DeviceEventEmitter.addListener('navigationStateChange', () => this.setState({ visibleHeader: true }))
  }

  componentDidMount (){
    this.props.navigation.setParams({ reloadMethod: () => this._refs.articleView.loadContent(true) })
  }

  componentWillUpdate (nextProps, nextState){
    // 如果退出沉浸模式，则立即显示头部
    if(this.props.state.config.immersionMode && !nextProps.state.config.immersionMode){
      this.changeHeaderVisible(true)
    }else{
      this.changeHeaderVisible(nextState.visibleHeader)
    }
  }

  shouldComponentUpdate (nextProps, nextState){
    return this.props.navigation.isFocused()
  }

  componentWillUnmount (){
    this.articleChangeListener.remove()
  }

  // 以一个值的变化映射头栏和评论按钮的显隐变化
  changeHeaderVisible = isVisible =>{
    if(!this._refs.header || !this._refs.commentButton){ return }
    const {show, hide} = this._refs.header
    const {show: showBtn, hide: hideBtn} = this._refs.commentButton
    isVisible ? show() : hide()
    isVisible ? showBtn() : hideBtn()
  }

  contentLoaded = data =>{
    var title = this.state.pageName.replace(/_/g, ' ')
    var trueTitle = data.parse.title

    // 写入缓存
    storage.merge('articleCache', { [trueTitle]: data })

    if(title !== trueTitle){
      $dialog.snackBar.show(`“${this.state.pageName}”被重定向至此页`)

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

    if(this.state.anchor){
      // 这里需要优化，因为不知道为什么导致语句没有执行，所以采取了等待500毫秒的手段
      // 考虑是dom还没能加载完毕导致的
      setTimeout(() =>{
        this.articleViewIntoAnchor(this.state.anchor, false)
        $dialog.snackBar.show(`该链接指向了“${decodeURIComponent(this.state.anchor.replace(/\./g, '%'))}”章节`)
      }, 500)
    }
  }

  articleViewIntoAnchor = (anchor, isSmooth = true) =>{
    this._refs.articleView.injectScript(`
      document.getElementById('${anchor}').scrollIntoView({ behavior: '${isSmooth ? 'smooth' : 'instant'}' })
    `)
  }

  toComment = () =>{
    if([0, 1, 2].includes(this.props.comment.getActiveData().status)){ return toast.show('加载评论中，请稍候') }
    this.props.navigation.push('comment', { title: this.state.pageName, id: this.state.id })
  }

  missingGoBack = () =>{
    $dialog.alert.show({
      content: '该条目还未创建',
      onTapCheck: () => this.props.navigation.goBack()
    })
  }

  render (){
    const { config } = store.getState()

    return (
      <>
        <StatusBar hidden={config.immersionMode} color={this.state.visibleHeader ? $colors.dark : 'white'} blackText={!this.state.visibleHeader} />
        <Header style={{ ...styles.header }} 
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
            injectCss={this.articleViewInjectCss}
            injectJs={this.articleViewInjectJs}
            onMessages={{ changeHeaderVisible: isVisible => this.setState({ visibleHeader: isVisible }) }}
            onLoaded={this.contentLoaded}
            onMissing={this.missingGoBack}
            getRef={self => this._refs.articleView = self}
          />       
        </CatalogTriggerView>

        {this.state.id ? <CommentButton 
          id={this.state.id}
          onTap={this.toComment}
          getRef={self => this._refs.commentButton = self}
        /> : null } 
      </>
    )
  }
}

export default commentHOC(Article)

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  }
})