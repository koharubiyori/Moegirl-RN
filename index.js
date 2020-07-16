import { AppRegistry, UIManager } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { enableScreens } from 'react-native-screens'

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

// 开启布局动画
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

AppRegistry.registerComponent(appName, () => App)
