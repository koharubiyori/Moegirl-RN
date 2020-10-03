import { DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer'
import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { BackHandler, Dimensions, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MyButton from '~/components/MyButton'
import { AVATAR_URL } from '~/constants'
import store from '~/mobx'
import { setGlobalThemeColor } from '~/theme'
import baseStorage from '~/utils/baseStorage'
import dialog from '~/utils/dialog'
import globalNavigation from '~/utils/globalNavigation'
import i from '../lang'
import DrawerItem from './Item'

export interface Props extends DrawerContentComponentProps<DrawerContentOptions> {
  navigation: DrawerContentComponentProps<DrawerContentOptions>['navigation'] & {
    openDrawer(): void
    closeDrawer(): void
  }
}

function DrawerContent(props: PropsWithChildren<Props>) {
  const theme = useTheme()

  function tapCloseAfter(handler: () => void) {
    return () => {
      props.navigation.closeDrawer()
      setTimeout(handler)
    }
  }

  function showActionHelps() {
    dialog.alert.show({
      title: i.index.actionHintTitle,
      content: i.index.actionHints.join('\n')
    })
  }

  function toggleNight() {
    if (store.settings.theme === 'night') {
      store.settings.set('theme', store.settings.lastTheme)
    } else {
      store.settings.set('lastTheme', store.settings.theme)
      store.settings.set('theme', 'night')
    }
  }

  return useObserver(() => {
    const navigation = globalNavigation.current
    const statusBarHeight = StatusBar.currentHeight!
    const isHmoeSource = store.settings.source === 'hmoe'
    const isNightMode = store.settings.theme === 'night'
    
    return (
      <View 
        style={{ 
          ...styles.container,
          backgroundColor: theme.colors.background, 
        }}
      >
        <Image 
          style={{
            ...styles.bgImage,
            width: Dimensions.get('screen').width * 0.6,
            height: Dimensions.get('screen').height - 160
          }}
          source={require('~/assets/images/drawer_bg.png')}
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
              onPress={() => { navigation.navigate('notification'); props.navigation.closeDrawer() }}
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
              <Text style={{ ...styles.hintText, color: theme.colors.onSurface }}>{i.index.welcome + store.user.name}</Text>
            </TouchableOpacity>
          </> : <>
            <View>
              <TouchableOpacity onPress={tapCloseAfter(() => navigation.navigate('login'))}>
                <Image source={require('~/assets/images/akari.jpg')} style={{ ...styles.avatar, borderColor: 'white' }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={tapCloseAfter(() => navigation.navigate('login'))}>
                <Text style={{ ...styles.hintText, color: theme.colors.onSurface }}>{i.index.loginHint + (isHmoeSource ? i.index.hmoe : i.index.moegirl)}</Text>
              </TouchableOpacity>
            </View>
          </>}
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View>
            <DrawerItem 
              icon="forum" 
              title={i.index.items.talk} 
              onPress={tapCloseAfter(() => navigation.push('article', { pageName: '萌娘百科 talk:讨论版', displayPageName: `萌娘百科 talk:${i.index.items.talk}` }))} 
            />
            {/* <DrawerItem
              icon="format-indent-increase"
              title="最近更改"
              onPress={tapCloseAfter(() => navigation.push('recentChanges'))}
            /> */}
            {store.user.isLoggedIn ? <>
              <DrawerItem icon="eye" iconGroup="MaterialCommunity" title={i.index.items.watchList} onPress={tapCloseAfter(() => navigation.navigate('watchList'))} />
            </> : null}
            <DrawerItem icon="history" title={i.index.items.browsingHistory} onPress={tapCloseAfter(() => navigation.push('history'))} />
            <DrawerItem icon="touch-app" title={i.index.items.actionHint} onPress={showActionHelps} />
            <DrawerItem icon="brightness-4" title={i.index.items.nightMode(!isNightMode)} onPress={toggleNight} />
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
            <Text style={{ color: theme.colors.disabled, marginLeft: 10 }}>{i.index.settings}</Text>
          </MyButton>

          <View style={{ width: 1, height: '60%', backgroundColor: '#ccc' }} />

          <MyButton
            style={{ flex: 1 }} 
            contentContainerStyle={styles.footerMyButton} 
            rippleColor="#ccc"
            onPress={() => BackHandler.exitApp()}
          >
            <MaterialIcon name="subdirectory-arrow-left" size={22} color="#666" />
            <Text style={{ color: theme.colors.disabled, marginLeft: 10 }}>{i.index.exit}</Text>
          </MyButton>
        </View>
      </View>
    )
  })
}

export default DrawerContent

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  
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
    opacity: 0.1,
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