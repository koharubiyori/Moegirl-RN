import React, { FC } from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import home from './views/main/Home'
import finds from './views/main/finds'
import history from './views/main/history'
import BottomNavigation from './views/main/BottomNavigation'

import article from './views/article'
import search from './views/search'
import searchResult from './views/searchResult'
import login from './views/login'
import edit from './views/edit'
import comment from './views/comment'
import reply from './views/comment/Reply'
import about from './views/About'
import settings from './views/settings'
import imageViewer from './components/articleView/ImageViewer'
import notifications from './views/notification'

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

export type RouteName = keyof (typeof routes & {
  [Key in 'settings' | 'edit' | 'comment' | 'reply' | 'notifications' | 'biliPlayer']: any
})

const routes = { 
  BottomTabNavigator,
  article,
  search,
  searchResult,
  login,
  about,
  imageViewer,

  ...systemViews({
    settings,
    edit,
    comment,
    reply,
    notifications,
  }),
  
  ...systemViews({ 
    biliPlayer 
  }, 'forFade'),
}

const StackNavigator = createStackNavigator(routes, { 
  initialRouteName: 'BottomTabNavigator',
  headerMode: 'none',
  transitionConfig: sceneProps => ({
    screenInterpolator: screenInterpolator(sceneProps)
  }) as any
})

function systemViews(
  routes: { [routerName: string]: FC<any> },
  transitionType: keyof typeof StackViewStyleInterpolator = 'forHorizontal'
): { [routerName: string]: { screen: FC<any>, params: any } } {
  let forHorizontalRoutes: any = {}
  
  for (let routeName in routes) {
    forHorizontalRoutes[routeName] = {
      screen: routes[routeName],
      params: { transitionType }
    }
  }

  return forHorizontalRoutes
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