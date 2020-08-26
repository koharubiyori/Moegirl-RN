import { NavigationContainerRef, StackActions } from '@react-navigation/native'
import { RouteName, RouteParamMaps } from '~/routes'

export interface GlobalNavigation extends NavigationContainerRef {
  push<T extends RouteName>(name: T, params?: RouteParamMaps[T]): void
  pop(...args: Parameters<typeof StackActions['pop']>): void
  replace<T extends RouteName>(name: T, params?: RouteParamMaps[T]): void
  popToTop(...args: Parameters<typeof StackActions['popToTop']>): void
}

const globalNavigationRef = {
  current: null as any as NavigationContainerRef
}

export const initGlobalNavigation = (navigation: NavigationContainerRef) => globalNavigationRef.current = navigation

const globalNavigation: { current: GlobalNavigation } = new Proxy(globalNavigationRef, {
  get(obj, prop) {
    if (prop !== 'current') return undefined

    function createNavigationFn<T extends keyof typeof StackActions>(fnName: T) {
      return (...args: Parameters<typeof StackActions[T]>) => {
        const createAction: any = StackActions[fnName]
        return obj.current.dispatch(createAction(...args))
      }
    }
    
    return {
      ...obj.current,
      push: createNavigationFn('push'),
      pop: createNavigationFn('pop'),
      replace: createNavigationFn('replace'),
      popToTop: createNavigationFn('popToTop')
    }
  }
}) as any

export default globalNavigation