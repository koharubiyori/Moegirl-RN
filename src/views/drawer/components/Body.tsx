import React, { PropsWithChildren, FC } from 'react'
import { BackHandler, Dimensions, Image, NativeModules, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import Item from './Item'
import { useTheme, Text } from 'react-native-paper'
import { configHOC, ConfigConnectedProps } from '~/redux/config/HOC'
import { setThemeColor } from '~/theme'
import toast from '~/utils/toast'

export interface Props {
  immersionMode: boolean
}

type FinalProps = Props & UserConnectedProps & ConfigConnectedProps

function DrawerBody(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()

  function tap(handler: () => void) {
    return () => {
      $drawer.close()
      setTimeout(handler)
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

  function toggleNight() {
    if (props.state.config.theme === 'night') {
      let newThemeColor: string | any
      if (props.state.config.lastTheme === 'night') {
        newThemeColor = props.state.config.source === 'hmoe' ? 'pink' : 'green'
      } else {
        newThemeColor = props.state.config.lastTheme
      }
      
      console.log('get', props.state.config.lastTheme)
      setThemeColor(newThemeColor)
      props.$config.set({ theme: newThemeColor })
    } else {
      setThemeColor('night')
      props.$config.set({ theme: 'night' })
      if (props.state.config.changeThemeColorByArticleMainColor) {
        toast.show('黑夜模式下动态主题不生效')
      }
    }
  }

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  const isHmoeSource = props.state.config.source === 'hmoe'
  const isNightMode = props.state.config.theme === 'night'
  return (
    <View style={{ backgroundColor: theme.colors.background, height: Dimensions.get('window').height }}>
      <Image source={require('~/assets/images/drawer_bg.png')} resizeMode="cover" 
        style={{ ...styles.bgImage, width: Dimensions.get('window').width * 0.6, height: Dimensions.get('window').height - 160 }}
      />
      <View 
        style={{ 
          ...styles.header, 
          ...(props.immersionMode ? { height: 150 } : { height: 150 + statusBarHeight, paddingTop: statusBarHeight }),
          backgroundColor: theme.colors.primary
        }}>
        {props.state.user.name !== null ? <>
          <Button 
            style={{ 
              ...styles.headerIcon, 
              top: (props.immersionMode ? 0 : statusBarHeight) + 10 
            }}
            onPress={() => { $appNavigator.navigate('notifications'); $drawer.close() }}
          >
            <View>
              <MaterialIcon name="notifications" size={25} color={theme.colors.onSurface} />
              {props.state.user.waitNotificationsTotal !== 0 ? <>
                <View style={{ 
                  ...styles.badge, 
                  ...(props.state.user.waitNotificationsTotal > 99 ? { width: 28, right: -16 } : {}),
                  backgroundColor: theme.colors.error
                }}>
                  <Text style={{ color: 'white', fontSize: 12 }}>
                    {props.state.user.waitNotificationsTotal > 99 ? '99+' : props.state.user.waitNotificationsTotal}
                  </Text>
                </View>
              </> : null}
            </View>
          </Button>
        </> : null}
        
        {props.state.user.name ? <>
          <TouchableOpacity onPress={tap(() => $appNavigator.push('article', { link: 'User:' + props.state.user.name }))}>
            <Image source={{ uri: $avatarUrl + props.state.user.name }} style={{ ...styles.avatar, borderColor: 'white' }} />
            <Text style={{ ...styles.hintText, color: theme.colors.onSurface }}>欢迎你，{props.state.user.name}</Text>
          </TouchableOpacity>
        </> : <>
          <View>
            <TouchableOpacity onPress={tap(() => $appNavigator.navigate('login'))}>
              <Image source={require('~/assets/images/akari.jpg')} style={{ ...styles.avatar, borderColor: 'white' }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={tap(() => $appNavigator.navigate('login'))}>
              <Text style={{ ...styles.hintText, color: theme.colors.onSurface }}>登录/加入{isHmoeSource ? 'H萌娘' : '萌娘百科'}</Text>
            </TouchableOpacity>
          </View>
        </>}
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View>
          <Item icon="help" title="提问求助区" onPress={() => $appNavigator.push('article', { link: 'Talk:提问求助区' })} />
          <Item icon="forum" title="讨论版" onPress={() => $appNavigator.push('article', { link: 'Talk:讨论版' })} />
          <Item icon="touch-app" title="操作提示" onPress={showActionHelps} />
          <Item rawPress icon="brightness-4" title={(props.state.config.theme === 'night' ? '关闭' : '开启') + '黑夜模式'} onPress={toggleNight} />
          {/* <Item icon="exposure-plus-1" title="支持萌娘百科" onPress={() => $appNavigator.push('article', { link: '萌娘百科:捐款' })} /> */}
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button noLimit={false}
          style={{ flex: 1 }} 
          contentContainerStyle={styles.footerButton} 
          rippleColor="#ccc"
          onPress={tap(() => $appNavigator.navigate('settings'))}
        >
          <MaterialIcon name="settings" size={22} color="#666" />
          <Text style={{ color: theme.colors.disabled, marginLeft: 10 }}>设置</Text>
        </Button>

        <View style={{ width: 1, height: '60%', backgroundColor: '#ccc' }} />

        <Button noLimit={false}
          style={{ flex: 1 }} 
          contentContainerStyle={styles.footerButton} 
          rippleColor="#ccc"
          onPress={() => BackHandler.exitApp()}
        >
          <MaterialIcon name="subdirectory-arrow-left" size={22} color="#666" />
          <Text style={{ color: theme.colors.disabled, marginLeft: 10 }}>退出应用</Text>
        </Button>
      </View>
    </View>
    
  )
}

export default configHOC(userHOC(DrawerBody)) as FC<Props>

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderWidth: 3,
  },

  hintText: {
    marginLeft: 20, 
    marginTop: 15, 
    fontSize: 16
  },

  footerButton: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },

  badge: {
    width: 17, 
    height: 17,
    borderRadius: 8.5,
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'absolute', 
    top: -6, 
    right: -6
  }
})