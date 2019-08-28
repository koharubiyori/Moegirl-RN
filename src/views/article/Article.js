import React from 'react'
import { 
  View, Text,
  StyleSheet, NativeModules, Animated
} from 'react-native'
import PropTypes from 'prop-types'
import Header from '@/components/header/ArticleHeader'
import ArticleView from '@/components/webView/ArticleView'
import StatusBar from '@/components/StatusBar'

const Navigation = React.createContext()

export default class Article extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)

    this.state = {
      link: props.navigation.getParam('link'),
      pageName: props.navigation.getParam('link')
    }

    this.articleViewInjectCss = `
      body {
        padding-top: 55px;
      }
    `

    this.articleViewInjectJs = (function injectedJs(){
      var lastPosition = 0,
      postMessageFlag = false   // 设置一个标记，防止和webview通信过频降低性能

      $(window).scroll(function(){
        function changeHeaderVisible(status){
          if(postMessageFlag){ return }
          postMessageFlag = true
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'changeHeaderVisible', data: status }))
          setTimeout(() => postMessageFlag = false, 100)
        }

        if(window.scrollY < 100){
          changeHeaderVisible(true)
          return true
        }

        changeHeaderVisible(!(window.scrollY > lastPosition))
        lastPosition = window.scrollY
      })
    }).toString() + ';injectedJs()'
  }

  onChangeHeaderVisible = isVisible =>{
    const {show, hide} = this.refs.header
    isVisible ? show() : hide()
  }

  render (){
    return (
      <Navigation value={this.props.navigation}>
        <View style={{ flex: 1 }}>
          <StatusBar />
          <Header style={styles.header} navigation={this.props.navigation} title={this.state.pageName} ref="header" />
          <ArticleView style={{ flex: 1 }} navigation={this.props.navigation}
            link={this.state.link} 
            injectStyle={['page']}
            injectScript={['link']}
            injectCss={this.articleViewInjectCss}
            injectJs={this.articleViewInjectJs}
            onMessages={{ changeHeaderVisible: this.onChangeHeaderVisible }}
          />
        </View>
      </Navigation>
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