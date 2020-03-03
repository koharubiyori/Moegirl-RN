import { NavigationScreenProp } from 'react-navigation'
import { RoutesParams } from '~/routes'

export = Navigation
export as namespace __Navigation

type NavigationFn = <RouteName extends keyof RoutesParams>(routeName: RouteName, params?: RoutesParams[RouteName]) => void

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