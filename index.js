import './src/global' // 不放到这里会访问不到
import 'react-native-gesture-handler'
import { AppRegistry, UIManager } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import './src/notificationServe'

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
    assert: () => {}
  }
}

// 禁用yellowBox
console.disableYellowBox = true

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

AppRegistry.registerComponent(appName, () => App)