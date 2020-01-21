import React, { PropsWithChildren } from 'react'
import { BackHandler, Dimensions, Image, NativeModules, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import userHOC from '~/redux/user/HOC'
import Item from './Item'

export interface Props {
  immersionMode: boolean
}

type FinalProps = Props

function DrawerBody(props: PropsWithChildren<FinalProps>) {

  function tap(handler: (navigation: __Navigation.Navigation) => void) {
    return () => {
      $drawer.close()
      handler($appNavigator)
    }
  }

  function showActionHelps() {
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

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <View style={{ backgroundColor: 'white', height: Dimensions.get('window').height }}>
      <Image source={require('~/assets/images/drawer_bg.png')} resizeMode="cover" 
        style={{ ...styles.bgImage, width: Dimensions.get('window').width * 0.6, height: Dimensions.get('window').height - 160 }}
      />
      <View style={{ ...styles.header, ...(props.immersionMode ? { height: 150 } : { height: 150 + statusBarHeight, paddingTop: statusBarHeight }) }}>
        <Button style={{ ...styles.headerIcon, top: statusBarHeight + 10 }}
          onPress={() => { $appNavigator.navigate('notifications'); $drawer.close() }}
        >
          <MaterialIcon name="notifications" size={25} color="white" />
        </Button>
        
        {props.state.user.name ? <>
          <TouchableOpacity onPress={tap(navigation => navigation.push('article', { link: 'User:' + props.state.user.name }))}>
            <Image source={{ uri: $avatarUrl + props.state.user.name }} style={styles.avatar} />
            <Text style={styles.hintText}>欢迎你，{props.state.user.name}</Text>
          </TouchableOpacity>
        </> : <>
          <TouchableOpacity onPress={tap(navigation => navigation.navigate('login'))}>
            <Image source={require('~/assets/images/akari.jpg')} style={styles.avatar} />
          </TouchableOpacity>

          <TouchableOpacity onPress={tap(navigation => navigation.navigate('login'))}>
            <Text style={styles.hintText}>登录/加入萌娘百科</Text>
          </TouchableOpacity>
        </>}
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View>
          <Item icon="settings" title="设置" onPress={() => $appNavigator.navigate('settings')} />
          <Item icon="help" title="提问求助区" onPress={() => $appNavigator.push('article', { link: 'Talk:提问求助区' })} />
          <Item icon="forum" title="讨论版" onPress={() => $appNavigator.push('article', { link: 'Talk:讨论版' })} />
          <Item icon="touch-app" title="操作提示" onPress={showActionHelps} />
          <Item icon="subdirectory-arrow-left" title="退出应用" onPress={BackHandler.exitApp} />
          {/* <Item icon="exposure-plus-1" title="支持萌娘百科" onPress={() => $appNavigator.push('article', { link: '萌娘百科:捐款' })} /> */}
        </View>
      </ScrollView>
    </View>
    
  )
}

export default userHOC(DrawerBody)

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    backgroundColor: $colors.main,
    elevation: 5,
  },

  headerIcon: {
    position: 'absolute', 
    right: 20, 
    zIndex: 10000
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