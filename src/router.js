import React from 'react'
import { createAppContainer } from "react-navigation"
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

const BottomTabNavigator = createBottomTabNavigator(
  { home, finds, history },
  
  { 
    tabBarComponent: props => <BottomNavigation {...props} />,
    backBehavior: 'none'
  }
)

const StackNavigator = createStackNavigator(
  { 
    BottomTabNavigator, article, search, searchResult, login, about,
    settings,

    edit: {
      screen: edit,
      params: {
        transitionType: 'forHorizontal'
      }
    }, 
    
    comment: {
      screen: comment,
      params: {
        transitionType: 'forHorizontal'
      }
    },

    reply: {
      screen: reply,
      params: {
        transitionType: 'forHorizontal'
      }
    },
  },

  { 
    initialRouteName: 'BottomTabNavigator',
    headerMode: 'none',
    transitionConfig: sceneProps => ({
      screenInterpolator: screenInterpolator(sceneProps)
    })
  }
)

function screenInterpolator(sceneProps) {
  const params = sceneProps.scene.route.params || {}
  const {transitionType} = params

  if (transitionType) {
    return StackViewStyleInterpolator[transitionType]
  } else {
    return StackViewStyleInterpolator.forFadeFromBottomAndroid
  }
}

const AppNavigator = createAppContainer(StackNavigator)

export default AppNavigator