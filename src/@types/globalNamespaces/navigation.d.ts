import { NavigationScreenProp } from 'react-navigation'
import { RouteName } from '~/router'

export = Navigation
export as namespace __Navigation

type NavigationFn = (routeName: RouteName, params?: object) => void

declare namespace Navigation {
  interface InjectedNavigation<State = {}> {
    navigation: NavigationScreenProp<{}, State> & { [Key in 'navigate' | 'push' | 'replace']: NavigationFn }
  } 
}