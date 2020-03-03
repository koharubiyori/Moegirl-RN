import { useEffect, useRef, useContext } from 'react'
import { LayoutAnimation, LayoutAnimationConfig } from 'react-native'
import { NavigationContext } from 'react-navigation'

export default function useLayoutAnimation(
  layoutAnimationConfig: LayoutAnimationConfig
) {
  const navigation = useContext(NavigationContext)
  const disabledLayoutAnimation = useRef(true)

  useEffect(() => {
    // layoutAnimation和页面过渡动画有冲突，所以必须对layoutAnimation进行管理
    if (disabledLayoutAnimation.current) { return } 
    LayoutAnimation.configureNext(layoutAnimationConfig)
  })

  useEffect(() => {
    // 在第一次渲染完毕后，开启layoutAnimation
    disabledLayoutAnimation.current = false

    // 在要离开时，关闭
    const willBlurListen = navigation.addListener('willBlur', () => {
      disabledLayoutAnimation.current = true
    })

    // 在进入完毕时，开启
    const didFocusListen = navigation.addListener('didFocus', () => {
      disabledLayoutAnimation.current = false
    })

    return () => {
      willBlurListen.remove()
      didFocusListen.remove()
    }
  }, [])
}