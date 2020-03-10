import Color from 'color'
import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState, FC } from 'react'
import { Animated, Clipboard, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import watchListApi from '~/api/watchList'
import Toolbar from '~/components/Toolbar'
import { ConfigConnectedProps, configHOC } from '~/redux/config/HOC'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import { colors } from '~/theme'
import toast from '~/utils/toast'

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
  const [isWatched, setIsWatched] = useState(false)
  const animateLock = useRef(false)
  const lastProps = useRef(props)

  if (props.getRef) props.getRef.current = { show, hide }

  useEffect(() => {
    if (props.state.user.name) {
      watchListApi.isWatched(props.title)
        .then(setIsWatched)
        .catch(console.log)
    }
  }, [])

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

  type ActionName = '刷新' | '登录' | '编辑此页' | '分享' | '打开目录' | '加入监视列表' | '移出监视列表'
  function eventHandlers(actionName: ActionName, index: number) {
    if (actionName === '刷新') {
      props.onPressRefreshBtn()
    }
    
    if (actionName === '登录') {
      props.navigation.push('login')
    }

    if (actionName === '编辑此页') {
      props.navigation.push('edit', { title: props.title })
    }

    if (actionName === '分享') {
      const siteMaps = {
        moegirl: 'https://mzh.moegirl.org',
        hmoe: 'https://www.hmoegirl.com'
      }

      const shareUrl = `${props.state.config.source === 'moegirl' ? '萌娘百科' : 'H萌娘'} - ${props.title} ${siteMaps[props.state.config.source]}/${props.title}`
      Clipboard.setString(shareUrl)
      toast.show('已将分享链接复制至剪切板', 'center')
    }

    if (actionName === '打开目录') {
      props.onPressOpenCatalog()
    }

    if (actionName === '加入监视列表' || actionName === '移出监视列表') {
      toast.showLoading('操作中')
      watchListApi.setWatchStatus(props.title, isWatched)
        .finally(toast.hide)
        .then(data => {
          setIsWatched(prevVal => !prevVal)
          toast.show(`已${isWatched ? '移出' : '加入'}监视列表`)
        })
        .catch(e => {
          console.log(e)
          toast.show('网络错误，请重试')
        })
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

  const watchListActionBtnName: ActionName = isWatched ? '移出监视列表' : '加入监视列表'
  const actions: ActionName[] = [
    '刷新',
    ...([props.state.user.name ? '编辑此页' : '登录'] as ActionName[]),
    ...(props.state.user.name ? [watchListActionBtnName] : []),
    '分享',
    '打开目录'
  ]
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
      actions={actions}
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