import { TransitionPresets, CardStyleInterpolators } from 'react-navigation-stack'
import { RoutesParams } from '../index'
import { FC } from 'react'
import { StackNavigationOptions, TransitionSpec } from 'react-navigation-stack/lib/typescript/src/vendor/types'

type CustomTransitionName = 'fade' | 'onlyCloseTransition'

export default function transitionedScreens<
  T extends { [RouteName in keyof RoutesParams]?: FC<any> }
>(transitionPresetName: (keyof typeof TransitionPresets) | CustomTransitionName, screens: T): T {
  let newScreens: any = {}
  let navigationOptions: StackNavigationOptions = {}

  switch (transitionPresetName) {
    case 'onlyCloseTransition': {
      navigationOptions = {
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 0
            }
          },
          close: TransitionPresets.ModalSlideFromBottomIOS.transitionSpec.close
        },
        
        cardStyleInterpolator: TransitionPresets.ModalSlideFromBottomIOS.cardStyleInterpolator,
      }

      break
    }
    
    case 'fade': {
      const transitionSpecConfig: TransitionSpec = {
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