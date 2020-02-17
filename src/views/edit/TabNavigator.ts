import { createAppContainer } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs' 
import codeEdit from './pages/CodeEdit'
import preview from './pages/Preview'

const TopTabNavigator = createMaterialTopTabNavigator({
  维基文本: codeEdit, 
  预览视图: preview
}, {
  swipeEnabled: false,
  tabBarOptions: {
    style: {
      elevation: 0
    },
    
    tabStyle: {
      backgroundColor: $colors.primary,
    }
  }
})

const appContainer = createAppContainer(TopTabNavigator)

export default appContainer