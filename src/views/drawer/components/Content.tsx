import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { BackHandler, Dimensions, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MyButton from '~/components/MyButton'
import { AVATAR_URL } from '~/constants'
import store from '~/mobx'
import dialog from '~/utils/dialog'
import globalNavigation from '~/utils/globalNavigation'
import { drawerController } from '..'
import DrawerItem from './Item'
import { setThemeColor } from '~/theme'

export interface Props {

}

function DrawerContent(props: PropsWithChildren<Props>) {
  const theme = useTheme()

  function tapCloseAfter(handler: () => void) {
    return () => {
      drawerController.close()
      setTimeout(handler)
    }
  }

  function showActionHelps() {
    dialog.alert.show({
      title: '操作提示',
      content: [
        '1. 左滑开启抽屉',
        '2. 条目页右滑开启目录',
        '3. 条目内容中长按b站播放器按钮跳转至b站对应视频页(当然前提是手机里有b站app)',
        '4. 左右滑动视频播放器小窗可以关闭视频'
      ].join('\n')
    })
  }

  function toggleNight() {
    const willSetTheme = store.settings.theme === 'night' ? 'green' : 'night'
    setThemeColor(willSetTheme)
    store.settings.set('theme', willSetTheme)
  }

  // useEffect(() => {
  //   setInterval(() => {
  //     console.log(globalNavigation.current)
  //   }, 1000)
  // }, [])

  return useObserver(() => {
    const navigation = globalNavigation.current
    const containerWidth = Dimensions.get('window').width * 0.6
    const containerHeight = Dimensions.get('window').height
    const statusBarHeight = StatusBar.currentHeight!
    const isHmoeSource = store.settings.source === 'hmoe'
    const isNightMode = store.settings.theme === 'night'
    
    return (
      <View 
        style={{ 
          backgroundColor: theme.colors.background, 
          width: containerWidth, 
          height: containerHeight,
          position: 'relative',
          zIndex: 100
        }}
      >
        <Image 
          source={require('~/assets/images/drawer_bg.png')}
          style={{ ...styles.bgImage, width: containerWidth, height: containerHeight - 160 }}
        />
        <View 
          style={{ 
            ...styles.header, 
            height: 150 + statusBarHeight, 
            paddingTop: statusBarHeight,
            backgroundColor: theme.colors.primary
          }}>
          {store.user.isLoggedIn &&
            <MyButton noRippleLimit
              style={{ 
                ...styles.headerIcon, 
                top: statusBarHeight
              }}
              onPress={() => { navigation.navigate('notification'); drawerController.close() }}
            >
              <View>
                <MaterialIcon name="notifications" size={25} color={theme.colors.onSurface} />
                {store.user.waitNotificationTotal !== 0 ? <>
                  <View style={{ 
                    ...styles.badge, 
                    ...(store.user.waitNotificationTotal > 99 ? { width: 28, right: -16 } : {}),
                    backgroundColor: theme.colors.error
                  }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                      {store.user.waitNotificationTotal > 99 ? '99+' : store.user.waitNotificationTotal}
                    </Text>
                  </View>
                </> : null}
              </View>
            </MyButton>
          }
              
          {store.user.isLoggedIn ? <>
            <TouchableOpacity onPress={tapCloseAfter(() => navigation.push('article', { pageName: 'User:' + store.user.name }))}>
              <Image 
                source={{ uri: AVATAR_URL + store.user.name }} 
                defaultSource={require('~/assets/images/akari.jpg')} 
                style={{ ...styles.avatar, borderColor: 'white' }} 
              />
              <Text style={{ ...styles.hintText, color: theme.colors.onSurface }}>欢迎你，{store.user.name}</Text>
            </TouchableOpacity>
          </> : <>
            <View>
              <TouchableOpacity onPress={tapCloseAfter(() => navigation.navigate('login'))}>
                <Image source={require('~/assets/images/akari.jpg')} style={{ ...styles.avatar, borderColor: 'white' }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={tapCloseAfter(() => navigation.navigate('login'))}>
                <Text style={{ ...styles.hintText, color: theme.colors.onSurface }}>登录/加入{isHmoeSource ? 'H萌娘' : '萌娘百科'}</Text>
              </TouchableOpacity>
            </View>
          </>}
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View>
            <DrawerItem icon="forum" title="讨论版" onPress={tapCloseAfter(() => navigation.push('article', { pageName: '萌娘百科 talk:讨论版' }))} />
            {store.user.isLoggedIn ? <>
              <DrawerItem icon="eye" iconGroup="MaterialCommunity" title="监视列表" onPress={tapCloseAfter(() => navigation.navigate('watchList'))} />
            </> : null}
            <DrawerItem icon="history" title="浏览历史" onPress={tapCloseAfter(() => navigation.push('history'))} />
            <DrawerItem icon="touch-app" title="操作提示" onPress={showActionHelps} />
            <DrawerItem icon="brightness-4" title={(isNightMode ? '关闭' : '开启') + '黑夜模式'} onPress={toggleNight} />
          </View>
        </ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MyButton
            style={{ flex: 1 }} 
            contentContainerStyle={styles.footerMyButton} 
            rippleColor="#ccc"
            onPress={tapCloseAfter(() => navigation.navigate('settings'))}
          >
            <MaterialIcon name="settings" size={22} color="#666" />
            <Text style={{ color: theme.colors.disabled, marginLeft: 10 }}>设置</Text>
          </MyButton>

          <View style={{ width: 1, height: '60%', backgroundColor: '#ccc' }} />

          <MyButton
            style={{ flex: 1 }} 
            contentContainerStyle={styles.footerMyButton} 
            rippleColor="#ccc"
            onPress={() => BackHandler.exitApp()}
          >
            <MaterialIcon name="subdirectory-arrow-left" size={22} color="#666" />
            <Text style={{ color: theme.colors.disabled, marginLeft: 10 }}>退出应用</Text>
          </MyButton>
        </View>
      </View>
    )
  })
}

export default DrawerContent

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

  footerMyButton: {
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