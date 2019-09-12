import React from 'react'
import { 
  View, Text, Animated,
  StyleSheet, NativeModules, PanResponder, Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/webView/ArticleView'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import { default as Catalog, width as catalogWidth } from './Catalog'

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

      catalog: {
        visible: false,
        transitionMaskOpacity: new Animated.Value(0),
        transitionRight: new Animated.Value(-catalogWidth),
        items: [],
        eventLock: false
      }
    }

    this.articleViewInjectCss = `
      body {
        padding-top: 55px;
      }
    `

    // 给webview注入的字符串js代码
    this.articleViewInjectJs = (function injectedJs(){
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
    }).toString() + ';injectedJs()'

    // 控制catalog的手势事件
    this.moveEventForCatalog = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => 
        // 判断是否从右侧边缘开始滑动
        gestureState.moveX > (Dimensions.get('window').width - 40) && !this.state.catalog.eventLock,

      // 判定成功，开启显示modal
      onPanResponderGrant: () => this.setState({
        catalog: {
          ...this.state.catalog,
          visible: true
        }
      }),

      onPanResponderMove: (e, gestureState) =>{
        var {dx} = gestureState
        if(dx > 0){ return }
        dx = Math.abs(dx)

        // 拿到距离响应器激活点的已滑动距离，按这个距离映射到catalog的right和mask的opacity上
        if(dx <= catalogWidth){
          this.state.catalog.transitionRight.setValue(Math.round(-catalogWidth + dx))

          // 手指已滑动距离(最大为catalog的宽度) 除以 catalog的宽除以100 得到一个0 ~ 100 的值，再除100得到百分比
          this.state.catalog.transitionMaskOpacity.setValue(dx / (catalogWidth / 100) / 100)
        }
      },

      onPanResponderRelease: (e, gestureState) =>{
        var {moveX} = gestureState

        // 如果松开手后滑动距离小于catalog宽度的一半，则隐藏，否则打开
        if(moveX > (Dimensions.get('window').width - (catalogWidth / 2))){
          this.hideCatalog()
        }else if(moveX > (Dimensions.get('window').width - catalogWidth)){
          // 目标值 : 动画值对象
          [
            { 0: this.state.catalog.transitionRight },
            { 1: this.state.catalog.transitionMaskOpacity }
          ].forEach(item => Animated.timing(Object.values(item)[0], {
            toValue: parseInt(Object.keys(item)[0]),
            duration: 150
          }).start())
        }

        this.setState({
          catalog: {
            ...this.state.catalog,
            eventLock: moveX < (Dimensions.get('window').width - (catalogWidth / 2))
          }
        })
      }
    })
  }

  hideCatalog = () =>{
    Animated.timing(this.state.catalog.transitionRight, {
      toValue: -catalogWidth,
      duration: 150
    }).start(() => this.setState({
      catalog: {
        ...this.state.catalog,
        visible: false,
        eventLock: false
      }          
    }))

    Animated.timing(this.state.catalog.transitionMaskOpacity, {
      toValue: 0,
      duration: 150
    }).start()
  }

  // 接收需要隐藏或显示header的指令
  changeHeaderVisible = isVisible =>{
    const {show, hide} = this.refs.header
    isVisible ? show() : hide()
  }

  contentLoaded = data =>{
    this.setState({
      catalog: {
        ...this.state.catalog,
        items: data.parse.sections
      }
    })
  }

  articleViewIntoAnchor = anchor =>{
    this.refs.articleView.injectScript(`
      document.getElementById('${anchor}').scrollIntoView({ behavior: 'smooth' })
    `)
  }

  render (){
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <StatusBar />
        <View style={{ flex: 1 }} {...this.moveEventForCatalog.panHandlers}>
          <Header style={styles.header} navigation={this.props.navigation} title={this.state.pageName} ref="header" />
          <ArticleView style={{ flex: 1 }} navigation={this.props.navigation}
            link={this.state.link} 
            injectStyle={['page']}
            injectScript={['link']}
            injectCss={this.articleViewInjectCss}
            injectJs={this.articleViewInjectJs}
            onMessages={{ changeHeaderVisible: this.changeHeaderVisible }}
            onLoaded={this.contentLoaded}
            ref="articleView"
          />
          <Catalog {...this.state.catalog} onClose={this.hideCatalog} onTapTitle={this.articleViewIntoAnchor} />
        </View>
      </NavigationContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: NativeModules.StatusBarManager.HEIGHT,
    left: 0,
    right: 0,
  }
})