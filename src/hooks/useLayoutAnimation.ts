import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import { LayoutAnimation, LayoutAnimationConfig } from 'react-native'

export default function useLayoutAnimation(
  layoutAnimationConfig = LayoutAnimation.create(100, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
) {
  const navigation = useNavigation()
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
    const removeBlurListen = navigation.addListener('blur', () => {
      disabledLayoutAnimation.current = true
    })

    // 在进入完毕时，开启
    const removeFocusListen = navigation.addListener('focus', () => {
      disabledLayoutAnimation.current = false
    })

    return () => {
      removeBlurListen()
      removeFocusListen()
    }
  }, [])
}

export function useLayoutAnimationInMobx(
  layoutAnimationConfig = LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
) {
  const firstLoad = useRef(true)
  if (firstLoad.current) { return firstLoad.current = false }
  LayoutAnimation.configureNext(layoutAnimationConfig)
}