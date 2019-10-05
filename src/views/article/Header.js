import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, NativeModules, Dimensions, Clipboard, DeviceEventEmitter
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import { store as userStore } from '~/redux/user'
import toast from '~/utils/toast'

export default class ArticleHeader extends React.Component{
  static propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    navigation: PropTypes.object,

    onTapRefreshBtn: PropTypes.func,
  }

  constructor (props){
    super(props)
    this.state = {
      visible: true,
      transitionTranslateY: new Animated.Value(0)
    }
    
    // 防止在返回时不滑动看不到标题
    this.articleChangeListener = DeviceEventEmitter.addListener('navigationStateChange', () => this.show())
  }

  componentWillUnmount (){
    this.articleChangeListener.remove()
  }
  
  hide = () =>{
    if(!this.state.visible){ return }
    this.setState({ visible: false })

    Animated.timing(this.state.transitionTranslateY, {
      toValue: -56,
      duration: 200,
      // useNativeDriver: true
    }).start()
  }

  show = () =>{
    if(this.state.visible){ return }
    this.setState({ visible: true })

    Animated.timing(this.state.transitionTranslateY, {
      toValue: 0,
      duration: 200,
      // useNativeDriver: true
    }).start()
  }

  eventHandlers = (event, navigation) =>{
    if(event.action === 'search'){
      navigation.push('search')
    }

    if(event.action === 'menu'){
      if(event.index === 0){
        this.props.onTapRefreshBtn()
      }

      console.log(event, userStore.getState())

      if(event.index === 1){
        if(userStore.getState().name){
          this.props.navigation.push('edit', { title: this.props.title })
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
      <Animated.View style={{ ...styles.body, ...this.props.style, transform: [{ translateY: this.state.transitionTranslateY }] }}>
        <Toolbar size={26}
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