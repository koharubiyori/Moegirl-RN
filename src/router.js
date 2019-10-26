import React from 'react'
import { createAppContainer } from "react-navigation"
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack'

import main from './views/main/Index'
import article from './views/article/Index'
import search from './views/search/Index'
import searchResult from './views/searchResult/Index'
import login from './views/login/Index'
import edit from './views/edit/Index'
import comment from './views/comment/Index'
import reply from './views/comment/Reply'
import about from './views/About'

const StackNavigator = createStackNavigator(
  { 
    main, article, search, searchResult, login, about,

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
    initialRouteName: 'main',
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