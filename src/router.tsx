import React, { FC } from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import home from './views/main/Home'
import finds from './views/main/finds'
import history from './views/main/history'
import BottomNavigation from './views/main/BottomNavigation'

import article, { RouteParams as ArticleRP } from './views/article'
import search, { RouteParams as SearchRP } from './views/search'
import searchResult, { RouteParams as SearchResultRP } from './views/searchResult'
import login, { RouteParams as LoginRP } from './views/login'
import edit, { RouteParams as EditRP } from './views/edit'
import comment, { RouteParams as CommentRP } from './views/comment'
import reply, { RouteParams as ReplyRP } from './views/comment/Reply'
import about, { RouteParams as AboutRP } from './views/About'
import settings, { RouteParams as SettingsRP } from './views/settings'
import imageViewer, { RouteParams as ImageViewerRP } from './views/imageViewer'
import notifications, { RouteParams as NotificationsRP } from './views/notification'
import category, { RouteParams as CategoryRP } from './views/category'

// 本来想在模态框中实现，因发现webView的全屏模式和模态框一起使用时发生了bug(全屏后白屏)，故这里用一个单独的路由来显示
import biliPlayer, { RouteParams as BiliPlayerRP } from './views/biliPlayer'
import { TransitionProps } from 'react-navigation-stack/lib/typescript/types'

const BottomTabNavigator = createBottomTabNavigator(
  { home, finds, history },
  
  { 
    tabBarComponent: props => <BottomNavigation {...props} />,
    backBehavior: 'none'
  }
)

export type RoutesParams = {
  article: ArticleRP
  search: SearchRP
  searchResult: SearchResultRP
  login: LoginRP
  about: AboutRP
  imageViewer: ImageViewerRP
  settings: SettingsRP
  edit: EditRP
  comment: CommentRP
  reply: ReplyRP
  notifications: NotificationsRP
  biliPlayer: BiliPlayerRP
  category: CategoryRP
}

const routes: { [RouteName in keyof (RoutesParams & { BottomTabNavigator: any })]: any } = { 
  BottomTabNavigator,
  article,
  search,
  searchResult,
  login,
  about,
  imageViewer,
  category,

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

function systemViews<
  Routes extends { [RouterName in keyof RoutesParams]?: FC<any> }
>(
  routes: Routes,
  transitionType: keyof typeof StackViewStyleInterpolator = 'forHorizontal'
): { [RouterName in keyof Routes]: { screen: FC<any>, params: any } } {
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