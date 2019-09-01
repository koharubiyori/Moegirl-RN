import React from 'react'
import { createStackNavigator } from "react-navigation"
import main from './views/main/Index'
import article from './views/article/Index'
import search from './views/search/Index'

const AppNavigator = createStackNavigator(
  { main, article, search },

  { 
    initialRouteName: 'main',
    navigationOptions: {
      headerStyle: {
        height: 0,
        overflow: 'hidden'
      }
    }
  }
)

export default class Router extends React.Component{
  render (){
    return <AppNavigator />
  }
}