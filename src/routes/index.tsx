import { NavigationContainer, NavigationContainerProps } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React, { FC, MutableRefObject } from 'react'
import AboutPage, { RouteParams as AboutRP } from '~/views/about'
import ArticlePage, { RouteParams as ArticleRP } from '~/views/article'
import CategoryPage, { RouteParams as CategoryRP } from '~/views/category'
import CommentPage, { RouteParams as CommentRP } from '~/views/comment'
import CommentReplyPage, { RouteParams as CommentReplyRP } from '~/views/comment/views/reply'
import EditPage, { RouteParams as EditRP } from '~/views/edit'
import HomePage, { RouteParams as HomeRP } from '~/views/home'
import ImageViewerPage, { RouteParams as ImageViewerRP } from '~/views/imageViewer'
import LoginPage, { RouteParams as LoginRP } from '~/views/login'
import NotificationPage, { RouteParams as NotificationRP } from '~/views/notification'
import SearchPage, { RouteParams as SearchRP } from '~/views/search'
import SearchResultPage, { RouteParams as SearchResultRP } from '~/views/search/views/result'
import SettingsPage, { RouteParams as SettingsRP } from '~/views/settings'
import WatchListPage, { RouteParams as WatchListRP } from '~/views/watchList'
import customRouteTransition from './utils/customTransition'
import HistoryPage, { RouteParams as HistoryRP } from '~/views/history'

export type RouteOptions = Parameters<(typeof Stack.Screen)>[0]['options']
const route = (component: FC<any>, options?: RouteOptions) => ({ component, options })

const routeMaps = {
  home: route(HomePage),
  article: route(ArticlePage),
  login: route(LoginPage),
  settings: route(SettingsPage),
  about: route(AboutPage),
  search: route(SearchPage, TransitionPresets.FadeFromBottomAndroid),
  searchResult: route(SearchResultPage, TransitionPresets.FadeFromBottomAndroid),
  comment: route(CommentPage),
  commentReply: route(CommentReplyPage),
  category: route(CategoryPage, {
    transitionSpec: {
      open: customRouteTransition.noTransition.transitionSpec!.open,
      close: TransitionPresets.SlideFromRightIOS.transitionSpec.close
    }
  }),
  imageViewer: route(ImageViewerPage, customRouteTransition.fade),
  notification: route(NotificationPage),
  edit: route(EditPage, TransitionPresets.FadeFromBottomAndroid),
  watchList: route(WatchListPage),
  history: route(HistoryPage)
}

// 对RouteParamMaps的字段做约束，必须声明T联合类型的所有字段
type UnionStringTypeMaps<
  T extends string, 
  T2 extends { [Key in T]: { [key: string]: any } }
> = Partial<T2>

export type RouteName = keyof typeof routeMaps
export type RouteParamMaps = UnionStringTypeMaps<RouteName, {
  home: HomeRP
  article: ArticleRP
  login: LoginRP
  settings: SettingsRP
  about: AboutRP
  search: SearchRP
  searchResult: SearchResultRP
  comment: CommentRP
  commentReply: CommentReplyRP
  category: CategoryRP
  imageViewer: ImageViewerRP
  notification: NotificationRP
  edit: EditRP
  watchList: WatchListRP
  history: HistoryRP
}>

const Stack = createStackNavigator()

export interface Props {
  onStateChange?: NavigationContainerProps['onStateChange']
  getRef: MutableRefObject<any>
}

function StackRoutes(props: Props) {
  return (
    <NavigationContainer ref={props.getRef} onStateChange={props.onStateChange}>
      <Stack.Navigator 
        initialRouteName="drawer" 
        headerMode="none"
        screenOptions={TransitionPresets.SlideFromRightIOS}
      >
        {Object.keys(routeMaps).map(routeName =>
          <Stack.Screen 
            key={routeName} 
            name={routeName} 
            component={routeMaps[routeName as any as RouteName].component} 
            options={routeMaps[routeName as any as RouteName].options}
          />  
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackRoutes