import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, NativeModules
} from 'react-native'
import userHOC from '~/redux/user/HOC'
import Item from './components/Item'

class MyDrawer extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      
    }

    this.avatarUrl = 'https://commons.moegirl.org/extensions/Avatar/avatar.php?user='
  }

  componentDidMount (){

  }

  render (){
    return (
      <View>
        <View style={{ height: NativeModules.StatusBarManager.HEIGHT }} />
        <View style={styles.header}>
          {this.props.state.user.name ? 
            <>
              <Image source={{ uri: this.avatarUrl + this.props.state.user.name }} style={styles.avatar} />
              <Text style={styles.hintText}>欢迎你，{this.props.state.user.name}</Text>
            </>
          : 
            <>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                <Image source={require('~/assets/images/akari.jpg')} style={styles.avatar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                <Text style={styles.hintText}>登录/加入萌娘百科</Text>
              </TouchableOpacity>
            </>
          }
        </View>

        <View style={styles.items}>
          <Item icon="settings" title="设置" />
        </View>
      </View>
    )
  }
}

export default userHOC(MyDrawer)

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