import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, NativeModules, Dimensions, Clipboard
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import { store as userStore } from '~/redux/user'
import toast from '~/utils/toast'

export default class ArticleHeader extends React.Component{
  static propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    navigation: PropTypes.object,

    onRefreshBtn: PropTypes.func,
  }

  constructor (props){
    super(props)
    this.state = {
      visible: true,
      transitionTop: new Animated.Value(0)
    }
    
  }
  
  openDrawer = () =>{
    console.log(true)
  }

  toSearchView = () =>{}

  hide = () =>{
    if(!this.state.visible){ return }
    this.setState({ visible: false })

    Animated.timing(this.state.transitionTop, {
      toValue: -56,
      duration: 200
    }).start()
  }

  show = () =>{
    if(this.state.visible){ return }
    this.setState({ visible: true })

    Animated.timing(this.state.transitionTop, {
      toValue: 0,
      duration: 200
    }).start()
  }

  eventHandlers = (event, navigation) =>{
    if(event.action === 'search'){
      navigation.push('search')
    }

    if(event.action === 'menu'){
      if(event.index === 0){
        this.onRefreshBtn()
      }

      if(event.index === 1){
        if(userStore.getState().name){
          this.props.navigation.push('editArticle', { title: this.props.title, section: 0 })
        }else{
          this.props.navigation.push('login')
        }
      }

      if(event.index === 2){
        const shareUrl = `萌娘百科 - ${this.props.title} https://mzh.moegirl.org/${this.props.title}`
        Clipboard.setString(shareUrl)
        toast.show('已将分享链接复制至剪切板', 'center')
      }
    }
  }

  render (){
    return (
      <Animated.View style={{ ...styles.body, ...this.props.style, top: this.state.transitionTop }}>
        <Toolbar
          leftElement="keyboard-backspace"
          centerElement={this.props.title}
          rightElement={{
            actions: [
              'search'
            ],

            menu: {
                icon: 'more-vert',
                labels: [
                  '刷新',
                  ...[userStore.getState().name ? '编辑此页' : '登录'],
                  '分享'
                ]
            }
          }}

          onLeftElementPress={() => this.props.navigation.goBack()}
          onRightElementPress={event =>{ this.eventHandlers(event, this.props.navigation) }}
        />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    // ...$theme.mainBg,
    // paddingHorizontal: 15,
    // height,
    // elevation: 3,

    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    zIndex: 1
  },
  
  title: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
    flexShrink: 1,
    maxWidth: Dimensions.get('window').width / 2
  },

  rightBtnContainer: {
    flexDirection: 'row-reverse'
  },

  rightBtn: {
    marginRight: 5
  }
})