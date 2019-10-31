import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, DrawerLayoutAndroid, Dimensions,
  StyleSheet
} from 'react-native'
// import Drawer from 'react-native-drawer'
import DrawerScreen from './Screen'

export default class MyDrawer extends React.Component{
  static propTypes = {
   
  }

  constructor (props){
    super(props)
    this.state = {

    }

    this.visible = false
  }
  
  componentDidMount (){
    global.$drawer = this
  }

  open (){
    this.refs.drawer.openDrawer()
  }

  close (){
    this.refs.drawer.closeDrawer()
  }

  render (){
    return (
      <DrawerLayoutAndroid 
        renderNavigationView={() => <DrawerScreen />}
        drawerWidth={Dimensions.get('window').width * 0.6}
        onDrawerOpen={() => this.visible = true}
        onDrawerClose={() => this.visible}
        ref="drawer"
      >{this.props.children}</DrawerLayoutAndroid>
    )
  }
}

const drawerStyles = {
  mainOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
}