import React from 'react'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import AppNavigator from './router'
import Alert from '~/components/dialog/Alert'
import Confirm from '~/components/dialog/Confirm'

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

export default class App extends React.Component {

  componentDidMount (){
    const {alert, confirm} = this.refs
    global.$dialog = { alert, confirm }
  }

  render (){
    return (
      <ThemeContext.Provider value={getTheme(theme)}>
        <AppNavigator />
        <Alert ref="alert" />
        <Confirm ref="confirm" />
      </ThemeContext.Provider>
    )
  }
}