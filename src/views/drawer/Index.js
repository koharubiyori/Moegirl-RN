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
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      visible: false
    }
  }
  
  componentDidMount (){
    global.$drawer = this.refs.drawer
  }

  render (){
    return (
      <Drawer tapToClose
        open={this.state.visible} 
        type="overlay"
        content={<DrawerScreen navigation={this.props.navigation} />}
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
    )
  }
}

const drawerStyles = {
  mainOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
}