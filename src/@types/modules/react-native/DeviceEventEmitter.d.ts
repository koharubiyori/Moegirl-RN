import { EmitterSubscription } from 'react-native'
import { NavigationState } from 'react-navigation'

export type MyEventEmittersMap = {
  navigationStateChange (prevState: NavigationState, state: NavigationState): void
  refreshHistory (): void
  clearHistory (): void
}

export interface MyDeviceEventEmitterStatic {
  addListener <Type extends keyof MyEventEmittersMap>(type: Type, handler: MyEventEmittersMap[Type]): EmitterSubscription
  emit <Type extends keyof MyEventEmittersMap>(type: Type, ...args: Parameters<MyEventEmittersMap[Type]>): void
  removeListener (type: keyof MyEventEmittersMap): void
}