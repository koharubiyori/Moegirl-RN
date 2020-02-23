import React, { MutableRefObject, PropsWithChildren, useRef, useState, FC, useEffect } from 'react'
import { Animated, Clipboard, Dimensions, NativeModules, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Toolbar from '~/components/Toolbar'
import { ConfigConnectedProps, configHOC } from '~/redux/config/HOC'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import toast from '~/utils/toast'
import Color from 'color'
import { colors } from '~/theme'

export interface Props {
  title: string
  style?: StyleProp<ViewStyle>
  navigation: __Navigation.Navigation
  disabledMoreBtn?: boolean
  backgroundColor: string
  textColor: string

  onPressRefreshBtn (): void
  onPressOpenCatalog (): void
  getRef: MutableRefObject<any>
}

export interface ArticleHeaderRef {
  show (): void
  hide (): void
}

type FinalProps = Props & UserConnectedProps & ConfigConnectedProps

function ArticleHeader(props: PropsWithChildren<FinalProps>) {
  const [visible, setVisible] = useState(true)
  const [transitionValue] = useState(new Animated.Value(0))
  const [colorChangeTransitionValue] = useState(new Animated.Value(0))
  const animateLock = useRef(false)
  const lastProps = useRef(props)

  if (props.getRef) props.getRef.current = { show, hide }

  useEffect(() => {
    if (props.backgroundColor !== lastProps.current.backgroundColor) {
      Animated.timing(colorChangeTransitionValue, {
        toValue: 1,
        duration: 500
      }).start()
    }

    return () => { lastProps.current = props }
  })

  function hide() {
    if (animateLock.current || !visible) { return }
    animateLock.current = true

    Animated.timing(transitionValue, {
      toValue: 1,
      duration: 200,
    }).start(() => {
      setVisible(false)
      animateLock.current = false
    })
  }

  function show() {
    if (animateLock.current || visible) { return }
    animateLock.current = true
    setVisible(true)
    Animated.timing(transitionValue, {
      toValue: 0,
      duration: 200,
    }).start(() => animateLock.current = false)
  }

  function eventHandlers(eventName: string, index: number) {
    if (index === 0) {
      props.onPressRefreshBtn()
    }
    
    if (index === 1) {
      if (props.state.user.name) {
        props.$user.getUserInfo()
          .then(userInfoData => {
            if (userInfoData.query.userinfo.implicitgroups.includes('autoconfirmed')) {
              props.navigation.push('edit', { title: props.title })
            } else {
              $dialog.alert.show({
                title: '抱歉，暂不支持非自动确认用户编辑',
                content: '请先通过网页端进行编辑10次以上，且注册时间超过24小时，即成为自动确认用户。'
              })
            }
          })
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
      props.onPressOpenCatalog()
    }
  }

  // 在因执行show或hide改变transitionValue时，进行颜色值映射
  let backgroundColor = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      Color(props.backgroundColor).rgb().string(), 
      props.state.config.theme === 'night' ? Color(colors.night.primary).rgb().string() : 'rgb(255, 255, 255)'
    ]
  })
  // 在通过获取条目的主题色从而改变颜色时，对backgroundColor重新赋值
  if (props.backgroundColor !== lastProps.current.backgroundColor) {
    const lastColor = Color(lastProps.current.backgroundColor).rgb().string()
    const currentColor = Color(props.backgroundColor).rgb().string()
    // 注意这里用的是colorChangeTransitionValue
    backgroundColor = colorChangeTransitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lastColor, currentColor]
    })
  }

  const contentOpacity = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  })
  const translateY = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -56]
  })
  const elevation = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5]
  })

  return (
    <Toolbar
      style={{ 
        ...styles.body, 
        ...(props.style as any), 
        transform: [{ translateY }],
        backgroundColor: backgroundColor as any, 
        ...(props.state.config.immersionMode ? {} : { elevation } as any) 
      }}
      contentContainerStyle={{ opacity: contentOpacity as any }}
      textColor={props.textColor}
      title={props.title}
      leftIcon="home"
      rightIcon="search"
      actions={[
        '刷新',
        ...[props.state.user.name ? '编辑此页' : '登录'],
        '分享',
        '打开目录'
      ]}
      disabledMoreBtn={props.disabledMoreBtn}
      onPressLeftIcon={() => props.navigation.popToTop()}
      onPressRightIcon={() => props.navigation.push('search')}
      onPressActions={eventHandlers}
    />
  )
}

export default configHOC(userHOC(ArticleHeader)) as FC<Props>

const styles = StyleSheet.create({
  body: {
    zIndex: 1
  },

  rightBtnContainer: {
    flexDirection: 'row-reverse'
  },

  rightBtn: {
    marginRight: 5
  }
})