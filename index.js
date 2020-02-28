import './src/global' // トップに置かないとゲットできない
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

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

AppRegistry.registerComponent(appName, () => App)