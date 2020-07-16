import { StackNavigationOptions, TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types'

const customRouteTransition: { [transitionName: string]: StackNavigationOptions } = {
  noTransition: {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 0,
        }
      },
      close: {
        animation: 'timing',
        config: {
          duration: 0,
        }
      }
    }
  },

  fade: (() => {
    const transitionSpecConfig: TransitionSpec = {
      animation: 'timing',
      config: {
        duration: 250
      }
    }
    
    return {
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
  })()
}

export default customRouteTransition