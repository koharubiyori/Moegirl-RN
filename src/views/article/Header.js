import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, Dimensions, Clipboard
} from 'react-native'
import Toolbar from '~/components/Toolbar'
import userHOC from '~/redux/user/HOC'
import toast from '~/utils/toast'

ArticleHeader.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  navigation: PropTypes.object,

  onTapRefreshBtn: PropTypes.func,
  onTapOpenCatalog: PropTypes.func,
  getRef: PropTypes.object
}

function ArticleHeader(props){
  const [visible, setVisible] = useState(true)
  const [transitionTranslateY] = useState(new Animated.Value(0))
  const animateLock = useRef(false)

  if(props.getRef) props.getRef.current = { show, hide }

  function hide(){
    if(animateLock.current || !visible){ return }
    animateLock.current = true

    Animated.timing(transitionTranslateY, {
      toValue: -56,
      duration: 200,
      useNativeDriver: true
    }).start(() =>{
      setVisible(false)
      animateLock.current = false
    })
  }

  function show(){
    if(animateLock.current || visible){ return }
    animateLock.current = true
    setVisible(true)
    Animated.timing(transitionTranslateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => animateLock.current = false)
  }

  function eventHandlers(event, navigation){
    if(event.action === 'search'){
      navigation.push('search')
    }

    if(event.action === 'menu'){
      if(event.index === 0){
        props.onTapRefreshBtn()
      }

      if(event.index === 1){
        if(props.state.user.name){
          props.navigation.push('edit', { title: props.title })
        }else{
          props.navigation.push('login')
        }
      }

      if(event.index === 2){
        const shareUrl = `萌娘百科 - ${props.title} https://mzh.moegirl.org/${props.title}`
        Clipboard.setString(shareUrl)
        toast.show('已将分享链接复制至剪切板', 'center')
      }

      if(event.index === 3){
        props.onTapOpenCatalog()
      }
    }
  }

  return (
    <Animated.View style={{ ...styles.body, ...props.style, transform: [{ translateY: transitionTranslateY }] }}>
      <Toolbar size={26}
        leftElement="home"
        centerElement={props.title}
        rightElement={{
          actions: [
            'search'
          ],

          menu: {
              icon: 'more-vert',
              labels: [
                '刷新',
                ...[props.state.user.name ? '编辑此页' : '登录'],
                '分享',
                '打开目录'
              ]
          }
        }}

        onLeftElementPress={() => props.navigation.popToTop()}
        onRightElementPress={event =>{ eventHandlers(event, props.navigation) }}
      />
    </Animated.View>
  )
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