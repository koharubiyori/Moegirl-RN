
declare module 'react-native' {
  export * from '~/../node_modules/@types/react-native'
  import { MyDeviceEventEmitterStatic } from '~/@types/modules/react-native/DeviceEventEmitter'

  const DeviceEventEmitter: MyDeviceEventEmitterStatic
  export { DeviceEventEmitter }
}