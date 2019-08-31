import React from 'react'
import { createStackNavigator } from "react-navigation"
import main from './views/main/Index'
import article from './views/article/Index'

const AppNavigator = createStackNavigator(
  { main, article },

  { 
    initialRouteName: 'main',
    navigationOptions: {
      headerStyle: {
        height: 0,
      }
    }
  }
)

export default class Router extends React.Component{
  render (){
    return <AppNavigator />
  }
}