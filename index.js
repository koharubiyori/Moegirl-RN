import './src/global.js'      // 不放到上面会访问不到
import { AppRegistry, UIManager } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent(appName, () => App);
