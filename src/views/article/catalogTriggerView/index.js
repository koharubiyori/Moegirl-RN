import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { 
  View, PanResponder, Animated, Dimensions
} from 'react-native'
import { Catalog, width } from './Catalog'

CatalogTriggerView.propTypes = {
  items: PropTypes.array,
  onTapTitle: PropTypes.func,
  getRef: PropTypes.object
}

// 这个组件控制事件，Catalog只负责显示
function CatalogTriggerView(props){
  const [visible, setVisible] = useState(false)
  const [transitionMaskOpacity] = useState(new Animated.Value(0))
  const [transitionRight] = useState(new Animated.Value(-width))
  const eventLock = useRef(false)
  const moveEvents = useRef(createMoveEvents())

  if(props.getRef) props.getRef.current = { showCatalog, hideCatalog }

  function createMoveEvents(){
    return PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => 
      // 判断是否从右侧边缘开始滑动
      gestureState.moveX > (Dimensions.get('window').width - 40) && !eventLock.current || visible,

      // 判定成功，开启显示modal
      onPanResponderGrant: () => setVisible(true),

      onPanResponderMove: (e, gestureState) =>{
        let {dx} = gestureState
        if(dx > 0){ return }
        dx = Math.abs(dx)

        // 拿到距离响应器激活点的已滑动距离，按这个距离映射到catalog的right和mask的opacity上
        if(dx <= width){
          transitionRight.setValue(Math.round(-width + dx))

          // 手指已滑动距离(最大为catalog的宽度) 除以 catalog的宽除以100 得到一个0 ~ 100 的值，再除100得到百分比
          transitionMaskOpacity.setValue(dx / (width / 100) / 100)
        }
      },

      onPanResponderRelease: (e, gestureState) =>{
        let {moveX} = gestureState

        // 如果松开手后滑动距离小于catalog宽度的一半，则隐藏，否则打开
        if(moveX > (Dimensions.get('window').width - (width / 2))){
          hideCatalog()
        }else if(moveX > (Dimensions.get('window').width - width)){
          // 目标值 : 动画值对象
          [
            { 0: transitionRight },
            { 1: transitionMaskOpacity }
          ].forEach(item => Animated.timing(Object.values(item)[0], {
            toValue: parseInt(Object.keys(item)[0]),
            duration: 150
          }).start())
        }

        eventLock.current = moveX < (Dimensions.get('window').width - (width / 2))
      }
    })
  }

  function showCatalog(){
    setVisible(true)
    Animated.timing(transitionRight, {
      toValue: 0,
      duration: 150
    }).start()

    Animated.timing(transitionMaskOpacity, {
      toValue: 1,
      duration: 150
    }).start()
  }
  
  function hideCatalog(){
    Animated.timing(transitionRight, {
      toValue: -width,
      duration: 150
    }).start(() =>{
      setVisible(false)
      eventLock.current = false
    })

    Animated.timing(transitionMaskOpacity, {
      toValue: 0,
      duration: 150
    }).start()
  }

  return (
    <>
      <View {...moveEvents.current.panHandlers} {...props} />
      <Catalog
        visible={visible} 
        transitionRight={transitionRight}
        transitionMaskOpacity={transitionMaskOpacity}
        items={props.items} 
        onTapTitle={props.onTapTitle} 
        onClose={hideCatalog} 
      />
    </>
  )
}

export default CatalogTriggerView


