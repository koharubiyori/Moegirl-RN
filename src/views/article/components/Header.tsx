import PropTypes from 'prop-types'
import React, { MutableRefObject, PropsWithChildren, useRef, useState } from 'react'
import { Animated, Clipboard, Dimensions, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Toolbar from '~/components/Toolbar'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import toast from '~/utils/toast'

ArticleHeader.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  navigation: PropTypes.object,

  onTapRefreshBtn: PropTypes.func,
  onTapOpenCatalog: PropTypes.func,
  getRef: PropTypes.object
}

export interface Props {
  title: string
  style?: StyleProp<ViewStyle>
  navigation: __Navigation.Navigation

  onTapRefreshBtn (): void
  onTapOpenCatalog (): void
  getRef: MutableRefObject<any>
}

export interface ArticleHeaderRef {
  show (): void
  hide (): void
}

type FinalProps = Props & UserConnectedProps

function ArticleHeader(props: PropsWithChildren<FinalProps>) {
  const [visible, setVisible] = useState(true)
  const [transitionTranslateY] = useState(new Animated.Value(0))
  const animateLock = useRef(false)

  if (props.getRef) props.getRef.current = { show, hide }

  function hide() {
    if (animateLock.current || !visible) { return }
    animateLock.current = true

    Animated.timing(transitionTranslateY, {
      toValue: -56,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setVisible(false)
      animateLock.current = false
    })
  }

  function show() {
    if (animateLock.current || visible) { return }
    animateLock.current = true
    setVisible(true)
    Animated.timing(transitionTranslateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => animateLock.current = false)
  }

  function eventHandlers(eventName: string, index: number) {
    if (index === 0) {
      props.onTapRefreshBtn()
    }
    
    if (index === 1) {
      if (props.state.user.name) {
        props.navigation.push('edit', { title: props.title })
      } else {
        props.navigation.push('login')
      }
    }

    if (index === 2) {
      const shareUrl = `萌娘百科 - ${props.title} https://mzh.moegirl.org/${props.title}`
      Clipboard.setString(shareUrl)
      toast.show('已将分享链接复制至剪切板', 'center')
    }

    if (index === 3) {
      props.onTapOpenCatalog()
    }
  }

  return (
    <Animated.View style={{ ...styles.body, ...(props.style as any), transform: [{ translateY: transitionTranslateY }] }}>
      <Toolbar 
        title={props.title}
        leftIcon="home"
        rightIcon="search"
        actions={[
          '刷新',
          ...[props.state.user.name ? '编辑此页' : '登录'],
          '分享',
          '打开目录'
        ]}
        onPressLeftIcon={() => props.navigation.popToTop()}
        onPressRightIcon={() => props.navigation.push('search')}
        onPressActions={eventHandlers}
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