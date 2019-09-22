import React from 'react'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import AppNavigator from './router'
import Alert from '~/components/dialog/Alert'
import Confirm from '~/components/dialog/Confirm'
import DropToast from '~/components/dialog/DropToast'
import { getToken } from '~/api/login'
import CookieManager from 'react-native-cookies';
// import AsyncStorage from '@react-native-community/async-storage'

// AsyncStorage.clear()

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

export default class App extends React.Component {

  componentDidMount (){
    global.$dialog = { ...this.refs }
  }

  render (){
    return (
      <ThemeContext.Provider value={getTheme(theme)}>
        <AppNavigator />
        <Alert ref="alert" />
        <Confirm ref="confirm" />
        <DropToast ref="dropToast" />
      </ThemeContext.Provider>
    )
  }
}