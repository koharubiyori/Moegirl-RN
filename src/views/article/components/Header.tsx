import { useObserver } from 'mobx-react-lite'
import React, { MutableRefObject, PropsWithChildren, useState, useRef } from 'react'
import { Animated, StyleSheet, Share } from 'react-native'
import { useTheme } from 'react-native-paper'
import MyToolbar from '~/components/MyToolbar'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'

export interface Props {
  title: string
  isWatchedPage: boolean
  rightBtnsDisabled?: boolean
  onPressRefreshBtn(): void
  onPressOpenContents(): void
  onPressToggleWatchList(): void
  getRef?: MutableRefObject<any>
}

export interface ArticleHeaderRef {
  show(): void
  hide(): void
}

;(ArticleHeader as DefaultProps<Props>).defaultProps = {
  
}

function ArticleHeader(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const [transitionValue] = useState(new Animated.Value(1))
  const visibleFlag = useRef(true) // 防止动画执行过频 
  
  if (props.getRef) props.getRef.current = { show, hide }

  function show() {
    if (visibleFlag.current) { return }
    visibleFlag.current = true
    Animated.timing(transitionValue, {
      toValue: 1,
      duration: 300
    }).start()
  }

  function hide() {
    if (!visibleFlag.current) { return }
    visibleFlag.current = false
    Animated.timing(transitionValue, {
      toValue: 0,
      duration: 300
    }).start()
  }

  type ActionName = '刷新' | '登录' | '编辑此页' | '分享' | '打开目录' | '加入监视列表' | '移出监视列表'
  function actionHandlers(actionName: ActionName, index: number) {
    if (actionName === '刷新') {
      props.onPressRefreshBtn()
    }
    
    if (actionName === '登录') {
      navigation.push('login')
    }

    if (actionName === '编辑此页') {
      navigation.push('edit', { title: props.title })
    }

    if (actionName === '分享') {
      const sourceMaps = {
        moegirl: 'https://mzh.moegirl.org',
        hmoe: 'https://www.hmoegirl.com'
      }

      Share.share({
        title: '萌娘百科分享',
        message: `${store.settings.source === 'moegirl' ? '萌娘百科' : 'H萌娘'} - ${props.title} ${sourceMaps[store.settings.source]}/${encodeURIComponent(props.title)}`
      })
    }

    if (actionName === '打开目录') {
      props.onPressOpenContents()
    }

    if (actionName === '加入监视列表' || actionName === '移出监视列表') {
      props.onPressToggleWatchList()
    }
  }

  const headerTranslateY = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-56, 0]
  })
  return useObserver(() => {
    const actions = (() => {
      const watchListActionBtnName: ActionName = props.isWatchedPage ? '移出监视列表' : '加入监视列表'
      const actionList: ActionName[] = [
        '刷新',
        ...([store.user.isLoggedIn ? '编辑此页' : '登录'] as ActionName[]),
        ...(store.user.isLoggedIn ? [watchListActionBtnName] : []),
        '分享',
        '打开目录'
      ]
  
      return actionList
    })()

    return (
      <Animated.View 
        style={{ 
          ...styles.headerWrapper, 
          backgroundColor: theme.colors.primary,
          transform: [{ translateY: headerTranslateY }]
        }}
      >
        <MyToolbar 
          style={{ opacity: transitionValue as any }}
          title={props.title}
          leftIcon="home"
          rightIcon="search"
          onPressLeftIcon={() => navigation.popToTop()}
          onPressRightIcon={() => navigation.push('search')}
          actions={actions}
          disabledMoreBtn={props.rightBtnsDisabled}
          onPressAction={actionHandlers}
        />
      </Animated.View>
    )
  })
}

export default ArticleHeader

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute', 
    left: 0, 
    zIndex: 1,
  }
})