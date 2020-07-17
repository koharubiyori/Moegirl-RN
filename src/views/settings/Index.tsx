import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import RNRestart from 'react-native-restart'
import { isHmoe } from '~/../app.json'
import MyToolbar from '~/components/MyToolbar'
import ViewContainer from '~/components/ViewContainer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import { colors } from '~/theme'
import articleCacheController from '~/utils/articleCacheController'
import dialog from '~/utils/dialog'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import SettingsSwitchItem from './components/SwitchItem'

export interface Props {
  
}

export interface RouteParams {
  
}

function SettingsPage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  
  async function clearArticleCache() {
    await dialog.confirm.show({ content: '确定要清空条目缓存吗？' })
    articleCacheController.clearCache()
    storage.remove('articleRedirectMap')
    toast('已清除所有条目缓存')
  }

  async function clearHistory () {
    await dialog.confirm.show({ content: '确定要清空浏览历史吗？' })
    storage.remove('browsingHistory')
    toast('已清除所有浏览历史')
  }

  async function logout() {
    await dialog.confirm.show({ content: '确定要登出吗？' })
    store.user.logout()
    toast('已登出')
  }

  function showSourceSelection() {
    dialog.optionSheet.show({
      title: '选择数据源',
      options: [
        {
          label: '萌娘百科',
          value: 'moegirl'
        }, {
          label: 'H萌娘',
          value: 'hmoe'
        }
      ],

      defaultSelected: store.settings.source,
    })
      .then(val => {
        store.settings.set('source', val as any)
          .then(() => RNRestart.Restart())
      })
  }

  async function showLangSelection() {
    const val = await dialog.optionSheet.show({
      title: '选择语言',
      defaultSelected: store.settings.lang,
      options: [
        {
          label: '简体中文',
          value: 'zh-hans'
        }, {
          label: '繁體中文',
          value: 'zh-hant'
        }
      ]
    })

    await store.settings.set('lang', val as any)
    RNRestart.Restart()
  }

  return useObserver(() =>
    <ViewContainer>
      <MyToolbar
        title="设置"
        leftIcon="keyboard-backspace"
        onPressLeftIcon={navigation.goBack}
      />

      <ScrollView style={{ flex: 1 }}>
        <Title>条目</Title>

        <SettingsSwitchItem 
          title="黑幕开关" 
          subtext="关闭后黑幕将默认为刮开状态" 
          value={store.settings.heimu}
          onChange={val => store.settings.set('heimu', val)}
        />

        {/* <SettingsSwitchItem title="沉浸模式" 
          subtext="浏览条目时将隐藏状态栏" 
          value={settings.immersionMode}
          onChange={val => setConfig({ immersionMode: val })}
        /> */}

        {/* <SettingsSwitchItem title="动态主题" 
          subtext="条目界面的配色随条目本身的主题色切换" 
          value={config.changeThemeColorByArticleMainColor}
          onChange={val => {
            setConfig({ changeThemeColorByArticleMainColor: val })
            props.state.config.theme === 'night' && val && toast.show('黑夜模式下动态主题不生效')
          }}
        /> */}

        {/* <Title>界面</Title>
        <SettingsSwitchItem hideSwitch 
          title="更换皮肤"
          onPress={showThemeOptions}
        /> */}

        <Title>缓存</Title>

        <SettingsSwitchItem 
          title="缓存优先模式"
          subtext="开启后如果条目有缓存将优先使用"
          value={store.settings.cachePriority}
          onChange={val => store.settings.set('cachePriority', val)}
        />

        <SettingsSwitchItem hideSwitch 
          title="清除条目缓存"
          onPress={() => clearArticleCache()}
        />

        <SettingsSwitchItem hideSwitch 
          title="清除浏览历史"
          onPress={() => clearHistory()}
        />

        <Title>账户</Title>
        <SettingsSwitchItem hideSwitch
          title={store.user.isLoggedIn ? '登出' : '登录'}
          onPress={() => store.user.isLoggedIn ? logout() : navigation.push('login')}
        />

        <Title>其他</Title>
        {isHmoe ? <>
          <SettingsSwitchItem hideSwitch 
            title="更换数据源"
            onPress={showSourceSelection}
          />
        </> : null}

        <SettingsSwitchItem hideSwitch
          title="选择语言"
          onPress={showLangSelection}
        />

        <SettingsSwitchItem hideSwitch
          title="关于"
          onPress={() => navigation.push('about')}
        />

        <SettingsSwitchItem hideSwitch
          title={isHmoe ? '在Github上查看新版本' : '前往Github下载支持H萌娘的版本'}
          onPress={() => Linking.openURL('https://github.com/koharubiyori/Moegirl-RN/releases')}
        />
      </ScrollView>      
    </ViewContainer>
  )
}

export default SettingsPage

const styles = StyleSheet.create({
  title: {
    color: colors.green.primary,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10
  }
})

function Title(props: PropsWithChildren<{}>) {
  const theme = useTheme()
  
  return (
    <View style={styles.title}>
      <Text style={{ color: theme.colors.accent, fontSize: 15 }}>{props.children}</Text>
    </View>
  )
}