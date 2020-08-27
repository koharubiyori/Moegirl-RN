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
import i from './lang'
import { checkLastVersion } from '~/init'
import MyStatusBar from '~/components/MyStatusBar'

export interface Props {
  
}

export interface RouteParams {
  
}

function SettingsPage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  
  async function clearArticleCache() {
    await dialog.confirm.show({ content: i.index.clearArticleCache.check })
    articleCacheController.clearCache()
    storage.remove('articleRedirectMap')
    toast(i.index.clearArticleCache.success)
  }

  async function clearHistory () {
    await dialog.confirm.show({ content: i.index.clearHistory.check })
    storage.remove('browsingHistory')
    toast(i.index.clearHistory.success)
  }

  async function logout() {
    await dialog.confirm.show({ content: i.index.logout.check })
    store.user.logout()
    toast(i.index.logout.success)
  }

  function showSourceSelection() {
    dialog.optionSheet.show({
      title: i.index.sourceSelection.title,
      options: [
        {
          label: i.index.sourceSelection.options.moegirl,
          value: 'moegirl'
        }, {
          label: i.index.sourceSelection.options.hmoe,
          value: 'hmoe'
        }
      ],

      defaultSelected: store.settings.source,
    })
      .then(val => {
        if (val === store.settings.source) { return }
        store.settings.set('source', val as any)
          .then(() => RNRestart.Restart())
      })
  }

  async function showLangSelection() {
    const val = await dialog.optionSheet.show({
      title: i.index.langSelection.title,
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

    if (val !== store.settings.lang) {
      await store.settings.set('lang', val as any)
      RNRestart.Restart()
    }
  }

  function checkNewVersion() {
    dialog.loading.show({ title: i.index.checkNewVersion.loading })
    checkLastVersion(true)
      .finally(dialog.loading.hide)
      .then(result => !result && toast(i.index.checkNewVersion.none))
      .catch(() => toast(i.index.checkNewVersion.netErr))
  }

  return useObserver(() =>
    <ViewContainer>
      <MyStatusBar />
      <MyToolbar
        title={i.index.title}
        leftIcon="keyboard-backspace"
        onPressLeftIcon={navigation.goBack}
      />

      <ScrollView style={{ flex: 1 }}>
        <Title>{i.index.article.title}</Title>

        <SettingsSwitchItem 
          title={i.index.article.heimu.title} 
          subtext={i.index.article.heimu.subtext} 
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

        <Title>{i.index.cache.title}</Title>
        <SettingsSwitchItem 
          title={i.index.cache.cachePriority.title}
          subtext={i.index.cache.cachePriority.subtext}
          value={store.settings.cachePriority}
          onChange={val => store.settings.set('cachePriority', val)}
        />

        <SettingsSwitchItem hideSwitch 
          title={i.index.cache.clearCache}
          onPress={() => clearArticleCache()}
        />

        <SettingsSwitchItem hideSwitch 
          title={i.index.cache.clearHistory}
          onPress={() => clearHistory()}
        />

        <Title>{i.index.account.title}</Title>
        <SettingsSwitchItem hideSwitch
          title={store.user.isLoggedIn ? i.index.account.logout : i.index.account.login}
          onPress={() => store.user.isLoggedIn ? logout() : navigation.push('login')}
        />

        <Title>{i.index.other.title}</Title>
        {isHmoe ? <>
          <SettingsSwitchItem hideSwitch 
            title={i.index.other.changeSource}
            onPress={showSourceSelection}
          />
        </> : null}

        <SettingsSwitchItem hideSwitch
          title={i.index.other.selectLang}
          onPress={showLangSelection}
        />

        <SettingsSwitchItem hideSwitch
          title={i.index.other.about}
          onPress={() => navigation.push('about')}
        />

        <SettingsSwitchItem hideSwitch
          title={i.index.other.checkVersion}
          onPress={checkNewVersion}
        />

        <SettingsSwitchItem hideSwitch
          title={isHmoe ? i.index.other.checkNewVersionOnGithub : i.index.other.gotoGithub}
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