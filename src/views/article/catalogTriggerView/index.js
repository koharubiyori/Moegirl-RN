import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, PanResponder, Animated, Dimensions
} from 'react-native'
import { Catalog, width } from './Catalog'

// 这个组件控制事件，Catalog只负责显示
export default class CatalogTriggerView extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    onTapTitle: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {
      visible: false,
      transitionMaskOpacity: new Animated.Value(0),
      transitionRight: new Animated.Value(-width),
      eventLock: false
    }

    this.moveEvents = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => 
      // 判断是否从右侧边缘开始滑动
      gestureState.moveX > (Dimensions.get('window').width - 40) && !this.state.eventLock,

      // 判定成功，开启显示modal
      onPanResponderGrant: () => this.setState({ visible: true }),

      onPanResponderMove: (e, gestureState) =>{
        var {dx} = gestureState
        if(dx > 0){ return }
        dx = Math.abs(dx)

        // 拿到距离响应器激活点的已滑动距离，按这个距离映射到catalog的right和mask的opacity上
        if(dx <= width){
          this.state.transitionRight.setValue(Math.round(-width + dx))

          // 手指已滑动距离(最大为catalog的宽度) 除以 catalog的宽除以100 得到一个0 ~ 100 的值，再除100得到百分比
          this.state.transitionMaskOpacity.setValue(dx / (width / 100) / 100)
        }
      },

      onPanResponderRelease: (e, gestureState) =>{
        var {moveX} = gestureState

        // 如果松开手后滑动距离小于catalog宽度的一半，则隐藏，否则打开
        if(moveX > (Dimensions.get('window').width - (width / 2))){
          this.hideCatalog()
        }else if(moveX > (Dimensions.get('window').width - width)){
          // 目标值 : 动画值对象
          [
            { 0: this.state.transitionRight },
            { 1: this.state.transitionMaskOpacity }
          ].forEach(item => Animated.timing(Object.values(item)[0], {
            toValue: parseInt(Object.keys(item)[0]),
            duration: 150
          }).start())
        }

        this.setState({ eventLock: moveX < (Dimensions.get('window').width - (width / 2)) })
      }
    })
  }

  
  hideCatalog = () =>{
    Animated.timing(this.state.transitionRight, {
      toValue: -width,
      duration: 150
    }).start(() => this.setState({
      visible: false,
      eventLock: false      
    }))

    Animated.timing(this.state.transitionMaskOpacity, {
      toValue: 0,
      duration: 150
    }).start()
  }

  render (){
    console.log(this.props)

    return (
      <>
        <View {...this.moveEvents.panHandlers} {...this.props} />
        <Catalog {...this.state} items={this.props.items} onTapTitle={this.props.onTapTitle} onClose={this.hideCatalog} />
      </>
    )
  }
}