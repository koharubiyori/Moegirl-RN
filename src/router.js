import React from 'react'
import { Dimensions } from 'react-native'
import { createAppContainer, createStackNavigator, createDrawerNavigator } from "react-navigation"

import drawer from './views/drawer/Index'

import main from './views/main/Index'
import article from './views/article/Index'
import search from './views/search/Index'
import searchResult from './views/searchResult/Index'

const StackNavigator = createStackNavigator(
  { main, article, search, searchResult },

  { 
    initialRouteName: 'main',
    headerMode: 'none',
  }
)

const DrawerNavigator = createDrawerNavigator(
  { StackNavigator },

  {
    // initialRouteName: 'drawer',
    drawerWidth: Dimensions.get('window').width * 0.65,
    drawerBackgroundColor: 'white',
    overlayColor: 'rgba(0, 0, 0, 0.3)',
    contentComponent: drawer,
    gestureHandlerProps: e => console.log(e)
    // contentOptions: {
    //   activeTintColor: '#fff',
    //   activeBackgroundColor: '#6b52ae',
    // },
  }
)

const AppNavigator = createAppContainer(DrawerNavigator)

export default AppNavigator