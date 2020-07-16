import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteParamMaps } from '~/routes'

interface AdditionalProperty {
  
}

// 给useNavigation添加类型
export default function useTypedNavigation(): StackNavigationProp<RouteParamMaps> & AdditionalProperty {
  return useNavigation()
}