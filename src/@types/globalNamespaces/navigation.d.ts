import { NavigationScreenProp } from 'react-navigation'
import { RouteName } from '~/router'

export = Navigation
export as namespace __Navigation

type NavigationFn = (routeName: RouteName, params?: object) => void

declare namespace Navigation {
  type Navigation<State = {}> = NavigationScreenProp<any, State> & 
    { [Key in 'navigate' | 'push' | 'replace']: NavigationFn } &
    { 
      getScreenProps <ScreenProps = {}>(): ScreenProps 
      popToTop (): void
    }
  
  interface InjectedNavigation<State = {}> {
    navigation: Navigation<State>
  } 
}