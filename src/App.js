import React from 'react'
import { BackHandler, DeviceEventEmitter } from 'react-native'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import AppNavigator from './router'
import Alert from '~/components/dialog/Alert'
import Confirm from '~/components/dialog/Confirm'
import DropToast from '~/components/dialog/DropToast'
import Drawer from '~/views/drawer'
import store from './redux'
import { Provider } from 'react-redux'
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
    this.state = {

    }
    
    global.$appNavigator = React.createRef()

    var onPressBackBtnMark = false
    BackHandler.addEventListener('hardwareBackPress', () =>{
      if($drawer && $drawer.visible){
        $drawer.close()
        return true
      }

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
    require('./init')
  }

  navigationStateChange (prevState, state){
    DeviceEventEmitter.emit('navigationStateChange', prevState, state)
  }

  render (){
    return (
      <ThemeContext.Provider value={getTheme(theme)}>
        <Provider store={store}>
          <Drawer ref="drawer">
            <AppNavigator onNavigationStateChange={this.navigationStateChange} ref={$appNavigator} />
          </Drawer>
        </Provider>

        <Alert ref="alert" />
        <Confirm ref="confirm" />
        <DropToast ref="dropToast" />
      </ThemeContext.Provider>
    )
  }
}