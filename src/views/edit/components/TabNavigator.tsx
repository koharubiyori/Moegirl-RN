import React, { useState, useEffect, useRef } from 'react'
import { Animated, Dimensions, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { createAppContainer } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import Button from '~/components/Button'
import codeEdit from '../pages/CodeEdit'
import preview from '../pages/Preview'

function MyBottomTabBar(props: any) {
  const [transitionPointerLeftOffset] = useState(new Animated.Value(0)) 
  const theme = useTheme()
  const lastProps = useRef(props)
  
  useEffect(() => {
    if (props.navigationState.index !== lastProps.current.navigationState.index) {
      Animated.timing(transitionPointerLeftOffset, {
        toValue: pointerWidth * props.navigationState.index,
        duration: 200
      }).start()
    }

    return () => lastProps.current = props
  })
  
  const { routes } = props.navigationState
  const backgroundColor = theme.colors.primary
  const pointerWidth = Dimensions.get('window').width / 2 + 0.5
  return (
    <View style={{ height: 50, flexDirection: 'row', elevation: 5, backgroundColor: 'white' }}>
      {routes.map((route: any, index: number) => <>
        <Button 
          style={{ flex: 1 }} 
          contentContainerStyle={{ flex: 1, backgroundColor, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => props.jumpTo(route.key)}
        >
          <View key={route.key}>
            <Text style={{ color: 'white' }}>{route.routeName}</Text>
          </View>  
        </Button>
        {index !== routes.length - 1 ? <View key={index} style={{ width: 1, backgroundColor: 'white' }} /> : null} 
      </>)}
      <Animated.View 
        style={{ 
          width: pointerWidth, 
          height: 2, 
          backgroundColor: 'white', 
          position: 'absolute', 
          left: 0, 
          bottom: 0, 
          zIndex: 1,
          transform: [{ translateX: transitionPointerLeftOffset }, { scaleX: 0.5 }] 
        }} 
      />
    </View>
  )
}

const TopTabNavigator = createMaterialTopTabNavigator({
  维基文本: codeEdit, 
  预览视图: preview
}, {
  swipeEnabled: false,
  tabBarComponent: MyBottomTabBar,
})

export default createAppContainer(TopTabNavigator)