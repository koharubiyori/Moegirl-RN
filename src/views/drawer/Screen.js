import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity, Dimensions,
  StyleSheet, NativeModules
} from 'react-native'
import userHOC from '~/redux/user/HOC'
import Item from './components/Item'

class DrawerScreen extends React.Component{
  static propTypes = {

  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }

  componentDidMount (){
    
  }

  tap = handler =>{
    return () =>{
      $drawer.close()
      handler()
    }
  }

  render (){
    return (
      <View style={{ backgroundColor: 'white', height: Dimensions.get('window').height }}>
        <View style={{ height: NativeModules.StatusBarManager.HEIGHT }} />
        <View style={styles.header}>
          {this.props.state.user.name ? 
            <>
              <Image source={{ uri: $avatarUrl + this.props.state.user.name }} style={styles.avatar} />
              <Text style={styles.hintText}>欢迎你，{this.props.state.user.name}</Text>
            </>
          : 
            <>
              <TouchableOpacity onPress={this.tap(() => $appNavigator.current._navigation.push('login'))}>
                <Image source={require('~/assets/images/akari.jpg')} style={styles.avatar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.tap(() => $appNavigator.current._navigation.push('login'))}>
                <Text style={styles.hintText}>登录/加入萌娘百科</Text>
              </TouchableOpacity>
            </>
          }
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.items}>
            <Item icon="info" title="关于" onPress={() => $appNavigator.current._navigation.push('about')} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#ABABAB', fontSize: 16 }}>其他功能敬请期待</Text>
          </View>
        </View>
      </View>
      
    )
  }
}

export default userHOC(DrawerScreen)

const styles = StyleSheet.create({
  header: {
    height: 160,
    justifyContent: 'center',
    backgroundColor: $colors.light
  },

  avatar: {
    width: 75,
    height: 75,
    marginLeft: 20,
    borderRadius: 75 / 2,
    borderColor: 'white',
    borderWidth: 3,
  },

  hintText: {
    color: 'white', 
    marginLeft: 20, 
    marginTop: 15, 
    fontSize: 16
  }
})