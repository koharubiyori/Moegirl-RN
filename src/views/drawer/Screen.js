import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity, Dimensions, BackHandler, ScrollView, NativeModules,
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

  showActionHelps = () =>{
    $dialog.alert.show({
      title: '操作提示',
      content: [
        '1. 左滑开启抽屉',
        '2. 条目页右滑开启目录',
        '3. 条目内容中长按b站播放器按钮跳转至b站对应视频页(当然前提是手机里有b站app)',
        '4. 在b站视频播放页面，播放后再点击视频会显示/隐藏控制栏'
      ].join('\n')
    })
  }

  render (){
    const statusBarHeight = NativeModules.StatusBarManager.HEIGHT

    return (
      <View style={{ backgroundColor: 'white', height: Dimensions.get('window').height }}>
        <Image source={require('~/assets/images/drawer_bg.png')} resizeMode="cover" 
          style={{ ...styles.bgImage, width: Dimensions.get('window').width * 0.6, height: Dimensions.get('window').height - 160 }}
        />
        <View style={{ ...styles.header, ...(this.props.immersionMode ? { height: 150 } : { height: 150 + statusBarHeight, paddingTop: statusBarHeight }) }}>
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

        <ScrollView style={{ flex: 1 }}>
          <View style={styles.items}>
            <Item icon="settings" title="设置" onPress={() => $appNavigator.current._navigation.navigate('settings')} />
            <Item icon="help" title="提问求助区" onPress={() => $appNavigator.current._navigation.push('article', { link: 'Talk:提问求助区' })} />
            <Item icon="forum" title="讨论版" onPress={() => $appNavigator.current._navigation.push('article', { link: 'Talk:讨论版' })} />
            <Item icon="touch-app" title="操作提示" onPress={this.showActionHelps} />
            <Item icon="subdirectory-arrow-left" title="退出应用" onPress={BackHandler.exitApp} />
            {/* <Item icon="exposure-plus-1" title="支持萌娘百科" onPress={() => $appNavigator.current._navigation.push('article', { link: '萌娘百科:捐款' })} /> */}
          </View>
        </ScrollView>
      </View>
      
    )
  }
}

export default userHOC(DrawerScreen)

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    backgroundColor: $colors.main,
    elevation: 5,
  },

  bgImage: {
    position: 'absolute', 
    top: 160, 
    left: 0,
    opacity: 0.1
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