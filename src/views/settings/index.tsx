import React, { PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView, DeviceEventEmitter,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'
import storage from '~/utils/storage'
import SwitchItem from './components/SwitchItem'
import toast from '~/utils/toast'
import configHOC from '~/redux/config/HOC'
import userHOC from '~/redux/user/HOC'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function Settings(props: PropsWithChildren<FinalProps>) {

  function clearArticleCache() {
    $dialog.confirm.show({
      content: '确定要清空条目缓存吗？',
      onTapCheck () {
        storage.remove('articleCache')
        storage.remove('articleRedirectMap')
        toast.show('已清除所有条目缓存')
      }
    })
  }

  function clearHistory () {
    $dialog.confirm.show({
      content: '确定要清空浏览历史吗？',
      onTapCheck () {
        storage.remove('browsingHistory')
        DeviceEventEmitter.emit('clearHistory')
        toast.show('已清除所有浏览历史')
      }
    })
  }

  function logout() {
    $dialog.confirm.show({
      content: '确定要登出吗？',
      onTapCheck () {
        props.user.logout()
        toast.show('已登出')
      }
    })
  }

  const { config } = props.state
  const setConfig = config => props.config.set(config)
  return (
    <View style={{ flex: 1 }}>
      <StatusBar />  

      <Toolbar
        title="设置"
        leftIcon="keyboard-backspace"
        onPressLeftIcon={props.navigation.goBack}
      />
      
      <ScrollView style={{ flex: 1 }}>
        <Title>条目</Title>

        <SwitchItem title="黑幕开关" 
          subtext="关闭后黑幕将默认为刮开状态" 
          value={config.heimu}
          onChange={val => setConfig({ heimu: val })}
        />

        <SwitchItem title="沉浸模式" 
          subtext="浏览条目时将隐藏状态栏" 
          value={config.immersionMode}
          onChange={val => setConfig({ immersionMode: val })}
        />

        <Title>缓存</Title>

        <SwitchItem hideSwitch 
          title="清除条目缓存"
          onPress={() => clearArticleCache()}
        />

        <SwitchItem hideSwitch 
          title="清除浏览历史"
          onPress={() => clearHistory()}
        />

        <Title>账户</Title>
        <SwitchItem hideSwitch
          title={props.state.user.name ? '登出' : '登录'}
          onPress={() => props.state.user.name ? logout() : props.navigation.push('login')}
        />

        <SwitchItem hideSwitch
          title="关于"
          onPress={() => props.navigation.push('about')}
        />
      </ScrollView>
    </View>
  )
}

export default configHOC(userHOC(Settings))

const styles = StyleSheet.create({
  title: {
    color: $colors.main,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10
  }
})

function Title(props: PropsWithChildren<{}>) {
  return (
    <View style={styles.title}>
      <Text style={{ color: $colors.main, fontSize: 15 }}>{props.children}</Text>
    </View>
  )
}