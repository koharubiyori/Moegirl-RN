import { TransitionPresets } from 'react-navigation-stack'
import { RoutesParams } from '../index'
import { FC } from 'react'

type CustomTransitionName = 'fade'

export default function transitionedScreens<
  T extends { [RouteName in keyof RoutesParams]?: FC<any> }
>(transitionPresetName: (keyof typeof TransitionPresets) | CustomTransitionName, screens: T): T {
  let newScreens: any = {}
  let navigationOptions: any = {}

  switch (transitionPresetName) {
    case 'fade': {
      const transitionSpecConfig = {
        animation: 'timing',
        config: {
          duration: 250
        }
      }
      
      navigationOptions = {
        transitionSpec: {
          open: transitionSpecConfig,
          close: transitionSpecConfig
        },
  
        cardStyleInterpolator: ({ current, closing }: any) => ({          
          cardStyle: {
            opacity: current.progress,
            damping: 200
          }
        })
      }

      break
    }

    default: {
      navigationOptions = TransitionPresets[transitionPresetName]
    }
  }
  
  for (let screenName in screens) {
    newScreens[screenName] = {
      screen: screens[screenName],
      navigationOptions
    }
  } 
  
  return newScreens
}