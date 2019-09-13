import React from 'react'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import AppNavigator from './router'
import Alert from '~/components/dialog/Alert'

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

export default class App extends React.Component {

  componentDidMount (){
    const {alert} = this.refs
    alert.show({
      content: 'aaa'
    })
  }

  render (){
    return (
      <ThemeContext.Provider value={getTheme(theme)}>
        <AppNavigator />
        <Alert ref="alert" />
      </ThemeContext.Provider>
    )
  }
}