import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, Dimensions, Clipboard, DeviceEventEmitter
} from 'react-native'
import Toolbar from '~/components/Toolbar'
import userHOC from '~/redux/user/HOC'
import toast from '~/utils/toast'

class ArticleHeader extends React.Component{
  static propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    navigation: PropTypes.object,

    onTapRefreshBtn: PropTypes.func,
    onTapOpenCatalog: PropTypes.func,
    getRef: PropTypes.func
  }

  constructor (props){
    super(props)
    props.getRef && props.getRef(this)

    this.state = {
      visible: true,
      transitionTranslateY: new Animated.Value(0)
    }

    this.animateLock = false
  }
  
  hide = () =>{
    if(this.animateLock || !this.state.visible){ return }
    this.animateLock = true

    Animated.timing(this.state.transitionTranslateY, {
      toValue: -56,
      duration: 200,
      useNativeDriver: true
    }).start(() =>{
      this.setState({ visible: false })
      this.animateLock = false
    })
  }

  show = () =>{
    if(this.animateLock || this.state.visible){ return }
    this.animateLock = true
    this.setState({ visible: true }, () => Animated.timing(this.state.transitionTranslateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => this.animateLock = false))
  }

  eventHandlers = (event, navigation) =>{
    if(event.action === 'search'){
      navigation.push('search')
    }

    if(event.action === 'menu'){
      if(event.index === 0){
        this.props.onTapRefreshBtn()
      }

      if(event.index === 1){
        if(this.props.state.user.name){
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

      if(event.index === 3){
        this.props.onTapOpenCatalog()
      }
    }
  }

  render (){
    return (
      <Animated.View style={{ ...styles.body, ...this.props.style, transform: [{ translateY: this.state.transitionTranslateY }] }}>
        <Toolbar size={26}
          leftElement="home"
          centerElement={this.props.title}
          rightElement={{
            actions: [
              'search'
            ],

            menu: {
                icon: 'more-vert',
                labels: [
                  '刷新',
                  ...[this.props.state.user.name ? '编辑此页' : '登录'],
                  '分享',
                  '打开目录'
                ]
            }
          }}

          onLeftElementPress={() => this.props.navigation.popToTop()}
          onRightElementPress={event =>{ this.eventHandlers(event, this.props.navigation) }}
        />
      </Animated.View>
    )
  }
}

export default userHOC(ArticleHeader)

const styles = StyleSheet.create({
  body: {
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