import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, 
  StyleSheet
} from 'react-native'
import Drawer from 'react-native-drawer'
import DrawerScreen from './Screen'

export default class MyDrawer extends React.Component{
  static propTypes = {
   
  }

  constructor (props){
    super(props)
    this.state = {
      visible: false,
      showMask: true
    }
  }
  
  componentDidMount (){
    global.$drawer = this.refs.drawer
    setTimeout(() => this.setState({ showMask: false }), 1000)
  }

  render (){
    return (
      <View style={{ flex: 1 }}>
        <Drawer tapToClose
          open={this.state.visible} 
          type="overlay"
          content={<DrawerScreen />}
          openDrawerOffset={0.4}
          closedDrawerOffset={0}
          panOpenMask={1}
          panCloseMask={0}
          styles={drawerStyles}
          tweenHandler={ratio => ({
            mainOverlay: { opacity: ratio }
          })}
          ref="drawer"
        >{this.props.children}</Drawer>

        {/* 使用这个drawer插件时，发现第一次加载会出现半秒的黑色遮罩，这里只好多显示一秒的白屏 */}
        {this.state.showMask ?
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white' }}></View> 
        : null}
      </View>
    )
  }
}

const drawerStyles = {
  mainOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
}