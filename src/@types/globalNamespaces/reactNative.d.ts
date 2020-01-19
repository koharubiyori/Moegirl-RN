
import { ErrorUtils } from 'react-native'

export = ReactNative
export as namespace __ReactNative

declare namespace ReactNative {
  // 这里用于解决@types/react-native没有将全局变量导出到global上的问题
  interface Global {
    require: NodeRequire
    console: Console

    originalXMLHttpRequest: any

    __BUNDLE_START_TIME__: number
    ErrorUtils: ErrorUtils

    __DEV__: boolean

    HermesInternal: null | {}
  }
}