import { EmitterSubscription } from 'react-native'

export type MyEventEmittersMap = {
  biliPlayerVisibleChange: (isSmallMode: boolean) => void
}

export interface MyDeviceEventEmitterStatic {
  addListener <Type extends keyof MyEventEmittersMap>(type: Type, handler: MyEventEmittersMap[Type]): EmitterSubscription
  emit <Type extends keyof MyEventEmittersMap>(type: Type, ...args: Parameters<MyEventEmittersMap[Type]>): void
  removeListener (type: keyof MyEventEmittersMap): void
}