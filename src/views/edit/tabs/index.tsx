import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { Fragment, MutableRefObject, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import MyButton from '~/components/MyButton'
import EditCodeTab from './CodeEdit'
import EditPreviewTab from './Preview'
import i from '../lang'

const Tab = createMaterialTopTabNavigator()

function MyTabBar(props: any) {
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
  const pointerWidth = Dimensions.get('window').width / 2 + 0.5
  return (
    <View style={{ height: 50, flexDirection: 'row', elevation: 5, backgroundColor: theme.colors.onSurface }}>
      {routes.map((route: any, index: number) => 
        <Fragment key={route.key}>
          <MyButton 
            style={{ flex: 1 }} 
            contentContainerStyle={{ 
              flex: 1, 
              backgroundColor: theme.colors.primary, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
            onPress={() => props.jumpTo(route.key)}
          >
            <View>
              <Text style={{ color: theme.colors.onSurface }}>{route.name}</Text>
            </View>  
          </MyButton>
          {index !== routes.length - 1 ? <View style={{ width: 1.5 }} /> : null} 
        </Fragment>
      )}
      <Animated.View 
        style={{ 
          width: pointerWidth, 
          height: 2, 
          backgroundColor: theme.colors.onSurface, 
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

export interface Props {
  getRef?: MutableRefObject<any>
}

function EditTabs(props: Props) {
  return (
    <Tab.Navigator 
      swipeEnabled={false} 
      backBehavior="order"
      tabBar={props => <MyTabBar {...props} />}
    >
      <Tab.Screen name={i.codeEdit.title} component={EditCodeTab} />
      <Tab.Screen name={i.preview.title} component={EditPreviewTab} />
    </Tab.Navigator>
  )
}

export default EditTabs