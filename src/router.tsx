import React, { FC } from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import home from './views/main/Home'
import finds from './views/main/finds/Index'
import history from './views/main/history/Index'
import BottomNavigation from './views/main/BottomNavigation'

import article from './views/article/Index'
import search from './views/search/Index'
import searchResult from './views/searchResult/Index'
import login from './views/login/Index'
import edit from './views/edit/Index'
import comment from './views/comment/Index'
import reply from './views/comment/Reply'
import about from './views/About'
import settings from './views/settings/Index'
import imageViewer from './components/articleView/ImageViewer'
import notifications from './views/notification/Index'

// 本来想在模态框中实现，因发现webView的全屏模式和模态框一起使用时发生了bug(全屏后白屏)，故这里用一个单独的路由来显示
import biliPlayer from './components/articleView/BiliPlayer'
import { HeaderTransitionConfig, TransitionProps } from 'react-navigation-stack/lib/typescript/types'

const BottomTabNavigator = createBottomTabNavigator(
  { home, finds, history },
  
  { 
    tabBarComponent: props => <BottomNavigation {...props} />,
    backBehavior: 'none'
  }
)

export type RouteName = keyof typeof routes 

const routes = { 
  BottomTabNavigator,
  article,
  search,
  searchResult,
  login,
  about,
  settings,
  imageViewer,

  edit: systemView(edit),
  comment: systemView(comment),
  reply: systemView(reply),
  notifications: systemView(notifications),
  
  biliPlayer: systemView(biliPlayer, 'forFade'),
}

const StackNavigator = createStackNavigator(routes, { 
  initialRouteName: 'BottomTabNavigator',
  headerMode: 'none',
  transitionConfig: sceneProps => ({
    screenInterpolator: screenInterpolator(sceneProps)
  }) as any
})

function systemView(component: FC<any>, transitionType: keyof typeof StackViewStyleInterpolator = 'forHorizontal') {
  return {
    screen: component,
    params: { transitionType }
  }
}

function screenInterpolator(sceneProps: TransitionProps) {
  const params = sceneProps.scene.route.params || {}
  const transitionType: keyof typeof StackViewStyleInterpolator = params.transitionType

  if (transitionType) {
    return StackViewStyleInterpolator[transitionType]
  } else {
    return StackViewStyleInterpolator.forFadeFromBottomAndroid
  }
}

const AppNavigator = createAppContainer(StackNavigator)

export default AppNavigator