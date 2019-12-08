import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, DrawerLayoutAndroid, Dimensions, BackHandler, DeviceEventEmitter,
  StyleSheet
} from 'react-native'
import storage from '~/utils/storage'
import DrawerScreen from './Screen'

export default class MyDrawer extends React.PureComponent{
  static propTypes = {
   
  }

  constructor (props){
    super(props)
    this.state = {
      immersionMode: false,
      isWatchingArticle: false
    }

    this.visible = false

    // 监听路由变化，判断用户是否在article页面上（暂时用不上了）
    DeviceEventEmitter.addListener('navigationStateChange', (prevState, state) =>{
      var lastRouteName = state.routes[state.routes.length - 1].routeName
      this.setState({ isWatchingArticle: lastRouteName === 'article' })
      storage.get('config').then(config => config && this.setState({ immersionMode: config.immersionMode }))
    })

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () =>{
      if(this.visible){
        this.close()
        return true
      }
    })
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
    console.log(this.state.immersionMode, this.state.isWatchingArticle)

    return (
      <DrawerLayoutAndroid 
        renderNavigationView={() => <DrawerScreen immersionMode={this.state.immersionMode && this.state.isWatchingArticle} />}
        drawerWidth={Dimensions.get('window').width * 0.6}
        onDrawerOpen={() => this.visible = true}
        onDrawerClose={() => this.visible = false}
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