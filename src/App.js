import React from 'react'
import { BackHandler } from 'react-native'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import AppNavigator from './router'
import Alert from '~/components/dialog/Alert'
import Confirm from '~/components/dialog/Confirm'
import DropToast from '~/components/dialog/DropToast'
import { StoreProvider as UserProvider } from './redux/user'
import toast from './utils/toast'
// import AsyncStorage from '@react-native-community/async-storage'

// AsyncStorage.clear()

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

export default class App extends React.Component {
  constructor (props){
    super(props)

    var onPressBackBtnMark = false
    BackHandler.addEventListener('hardwareBackPress', () =>{
      if(!onPressBackBtnMark){
        toast.show('再按一次返回键退出应用')
        onPressBackBtnMark = true
        setTimeout(() => onPressBackBtnMark = false, 3000)
        return true
      }else{
        BackHandler.exitApp()
      }
    })
  }

  componentDidMount (){
    global.$dialog = { ...this.refs }
  }

  render (){
    return (
      <ThemeContext.Provider value={getTheme(theme)}>
        <UserProvider>
          <AppNavigator />
        </UserProvider>

        <Alert ref="alert" />
        <Confirm ref="confirm" />
        <DropToast ref="dropToast" />
      </ThemeContext.Provider>
    )
  }
}