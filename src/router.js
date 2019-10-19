import React from 'react'
import { Dimensions } from 'react-native'
import { createAppContainer } from "react-navigation"
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'

import drawer from './views/drawer/Index'

import main from './views/main/Index'
import article from './views/article/Index'
import search from './views/search/Index'
import searchResult from './views/searchResult/Index'
import login from './views/login/Index'
import edit from './views/edit/Index'
import comment from './views/comment/Index'

const StackNavigator = createStackNavigator(
  { main, article, search, searchResult, login, edit, comment },

  { 
    initialRouteName: 'main',
    headerMode: 'none',
    transitionConfig: sceneProps => ({
      screenInterpolator: transitionConfig(sceneProps)
    })
  }
)

function transitionConfig(sceneProps) {
  const {scene} = sceneProps
  const {route} = scene
  const params = route.params || {}
  const {transitionType} = params
  if (transitionType) {
    return StackViewStyleInterpolator[transitionType]
  } else {
    return StackViewStyleInterpolator.forFadeFromBottomAndroid
  }
}


const DrawerNavigator = createDrawerNavigator(
  { StackNavigator },

  {
    drawerWidth: Dimensions.get('window').width * 0.65,
    drawerBackgroundColor: 'white',
    overlayColor: 'rgba(0, 0, 0, 0.3)',
    contentComponent: drawer,
  }
)

const AppNavigator = createAppContainer(DrawerNavigator)

export default AppNavigator