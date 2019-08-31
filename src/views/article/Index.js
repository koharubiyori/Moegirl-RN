import React from 'react'
import { 
  View, Text, Animated,
  StyleSheet, NativeModules, PanResponder, Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '@/components/webView/ArticleView'
import StatusBar from '@/components/StatusBar'
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
        onClose: this.hideCatalog,
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
        gestureState.moveX > (Dimensions.get('window').width - 20) && !this.state.catalog.eventLock,

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

        if(dx <= catalogWidth){
          this.state.catalog.transitionRight.setValue(Math.round(-catalogWidth + dx))
          this.state.catalog.transitionMaskOpacity.setValue(dx / (catalogWidth / 100))
        }
      },


      onPanResponderRelease: (e, gestureState) =>{
        var {moveX} = gestureState
        if(moveX > (Dimensions.get('window').width - (catalogWidth / 2))){
          this.hideCatalog()
        }else if(moveX > (Dimensions.get('window').width - catalogWidth)){
          Animated.timing(this.state.catalog.transitionRight, {
            toValue: 0,
            duration: 150
          }).start()
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
  }

  onChangeHeaderVisible = isVisible =>{
    const {show, hide} = this.refs.header
    isVisible ? show() : hide()
  }

  onLoaded = data =>{
    console.log(data)
  }

  render (){
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <View style={{ flex: 1 }} {...this.moveEventForCatalog.panHandlers}>
          <StatusBar />
          <Header style={styles.header} navigation={this.props.navigation} title={this.state.pageName} ref="header" />
          <ArticleView style={{ flex: 1 }} navigation={this.props.navigation}
            link={this.state.link} 
            injectStyle={['page']}
            injectScript={['link']}
            injectCss={this.articleViewInjectCss}
            injectJs={this.articleViewInjectJs}
            onMessages={{ changeHeaderVisible: this.onChangeHeaderVisible }}
            onLoaded={this.onLoaded}
          />
          <Catalog {...this.state.catalog} />
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