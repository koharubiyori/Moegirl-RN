import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import about, { RouteParams as AboutRP } from './views/About'
import article, { RouteParams as ArticleRP } from './views/article'
// 本来想在模态框中实现，因发现webView的全屏模式和模态框一起使用时发生了bug(全屏后白屏)，故这里用一个单独的路由来显示
import biliPlayer, { RouteParams as BiliPlayerRP } from './views/biliPlayer'
import category, { RouteParams as CategoryRP } from './views/category'
import comment, { RouteParams as CommentRP } from './views/comment'
import reply, { RouteParams as ReplyRP } from './views/comment/Reply'
import edit, { RouteParams as EditRP } from './views/edit'
import imageViewer, { RouteParams as ImageViewerRP } from './views/imageViewer'
import login, { RouteParams as LoginRP } from './views/login'
import BottomNavigation from './views/main/BottomNavigation'
import finds from './views/main/finds'
import history from './views/main/history'
import home from './views/main/Home'
import notifications, { RouteParams as NotificationsRP } from './views/notification'
import search, { RouteParams as SearchRP } from './views/search'
import searchResult, { RouteParams as SearchResultRP } from './views/searchResult'
import settings, { RouteParams as SettingsRP } from './views/settings'

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
  category,
  settings,
  edit,
  comment,
  reply,
  notifications,
  
  imageViewer,
  biliPlayer,
}

const StackNavigator = createStackNavigator(routes, { 
  initialRouteName: 'BottomTabNavigator',
  headerMode: 'none',

  defaultNavigationOptions(props) {
    return {
      gestureEnabled: true,
      cardOverlayEnabled: true,
      ...TransitionPresets.DefaultTransition,
    }
  }
})

const AppNavigator = createAppContainer(StackNavigator)

export default AppNavigator