import { useObserver } from 'mobx-react-lite'
import React, { MutableRefObject, PropsWithChildren, useState, useRef } from 'react'
import { Animated, StyleSheet, Share } from 'react-native'
import { useTheme } from 'react-native-paper'
import MyToolbar from '~/components/MyToolbar'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import i from '../lang'
import cutHtmlTag from '~/utils/cutHtmlTag'

export interface Props {
  title: string
  trueTitle: string
  isWatchedPage: boolean
  rightBtnsDisabled?: boolean
  disabledEditFullText?: boolean
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
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  function hide() {
    if (!visibleFlag.current) { return }
    visibleFlag.current = false
    Animated.timing(transitionValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  function actionHandlers(value: string, index: number) {
    if (value === 'refresh') {
      props.onPressRefreshBtn()
    }
    
    if (value === 'login') {
      navigation.push('login')
    }

    if (value === 'editPage') {
      navigation.push('edit', { title: props.trueTitle })
    }

    if (value === 'addSection') {
      navigation.push('edit', { title: props.trueTitle, newSection: true })
    }

    if (value === 'share') {
      const sourceMaps = {
        moegirl: 'https://mzh.moegirl.org',
        hmoe: 'https://www.hmoegirl.com'
      }

      Share.share({
        title: i.header.actions.share.title,
        message: `${store.settings.source === 'moegirl' ? i.header.actions.share.moegirl : i.header.actions.share.hmoe} - ${props.title} ${sourceMaps[store.settings.source]}/${encodeURIComponent(props.title)}`
      })
    }

    if (value === 'showContents') {
      props.onPressOpenContents()
    }

    if (value === 'addToWatchList' || value === 'removeFromWatchList') {
      props.onPressToggleWatchList()
    }
  }

  const headerTranslateY = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-56, 0]
  })
  return useObserver(() => {
    const actions = (() => {
      const iText = i.header.actions
      
      const watchListActionBtnAction = props.isWatchedPage ? 
        { label: iText.removeFromWatchList, value: 'removeFromWatchList' } :
        { label: iText.addedToWatchList, value: 'addToWatchList' }

      const editBtnAction = props.disabledEditFullText ? 
        { label: iText.addSection, value: 'addSection' } :
        { label: iText.editPage, value: 'editPage' }

      const actionList = [
        { label: iText.refresh, value: 'refresh' },
        
        ...([store.user.isLoggedIn ? editBtnAction : { label: iText.login, value: 'login' }]),
        ...(store.user.isLoggedIn ? [watchListActionBtnAction] : []),
        { label: iText.shareText, value: 'share' },
        { label: iText.showContents, value: 'showContents' }
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
          title={cutHtmlTag(props.title)}
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