import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity, Dimensions,
  StyleSheet, 
} from 'react-native'
import userHOC from '~/redux/user/HOC'
import Item from './components/Item'

class DrawerScreen extends React.Component{
  static propTypes = {
    immersionMode: PropTypes.bool   // 暂时用不上了
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
      handler($appNavigator.current._navigation)
    }
  }

  render (){
    return (
      <View style={{ backgroundColor: 'white', height: Dimensions.get('window').height }}>
        <View style={styles.header}>
          {this.props.state.user.name ? 
            <TouchableOpacity onPress={this.tap(navigation => navigation.push('article', { link: 'User:' + this.props.state.user.name }))}>
              <Image source={{ uri: $avatarUrl + this.props.state.user.name }} style={styles.avatar} />
              <Text style={styles.hintText}>欢迎你，{this.props.state.user.name}</Text>
            </TouchableOpacity>
          : 
            <>
              <TouchableOpacity onPress={this.tap(navigation => navigation.navigate('login'))}>
                <Image source={require('~/assets/images/akari.jpg')} style={styles.avatar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.tap(navigation => navigation.navigate('login'))}>
                <Text style={styles.hintText}>登录/加入萌娘百科</Text>
              </TouchableOpacity>
            </>
          }
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.items}>
            <Item icon="settings" title="设置" onPress={() => $appNavigator.current._navigation.navigate('settings')} />
            <Item icon="help" title="提问求助区" onPress={() => $appNavigator.current._navigation.push('article', { link: 'Talk:提问求助区' })} />
            <Item icon="forum" title="讨论版" onPress={() => $appNavigator.current._navigation.push('article', { link: 'Talk:讨论版' })} />
            {/* <Item icon="exposure-plus-1" title="支持萌娘百科" onPress={() => $appNavigator.current._navigation.push('article', { link: '萌娘百科:捐款' })} /> */}
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