import React, { PropsWithChildren } from 'react'
import { DeviceEventEmitter, Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import RNRestart from 'react-native-restart'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'
import { ConfigConnectedProps, configHOC } from '~/redux/config/HOC'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import { colors, setThemeColor, themeColorType, ThemeColorType } from '~/theme'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import SwitchItem from './components/SwitchItem'
import { isHmoe } from '~/../app.json'
import ViewContainer from '~/components/ViewContainer'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import store from '~/redux'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & UserConnectedProps & ConfigConnectedProps

function Settings(props: PropsWithChildren<FinalProps>) {
  function showThemeOptions() {    
    const themeOptions = Object.keys(themeColorType).map(themeValue => ({
      label: themeColorType[themeValue as ThemeColorType],
      value: themeValue
    }))
    
    $dialog.optionsSheet.show({
      title: '选择皮肤',
      options: themeOptions,
      defaultSelected: props.state.config.theme,
      onChange(value) {
        if (value !== 'night') {
          setConfig({ lastTheme: value as any })
        }

        if (value === 'night' && props.state.config.changeThemeColorByArticleMainColor) {
          toast.show('黑夜模式下动态主题不生效')
        }

        setConfig({ theme: value as any })
        setThemeColor(value as any)
      }
    })
  }

  function showSiteSelector () {
    $dialog.optionsSheet.show({
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
      defaultSelected: props.state.config.source,
      onPressCheck (value) {
        // 为了初始化全部数据，这里直接热重启
        setConfig({ source: value as any }).then(() => RNRestart.Restart())
      }
    })
  }

  function clearArticleCache() {
    $dialog.confirm.show({
      content: '确定要清空条目缓存吗？',
      onPressCheck () {
        storage.remove('articleCache')
        storage.remove('articleRedirectMap')
        toast.show('已清除所有条目缓存')
      }
    })
  }

  function clearHistory () {
    $dialog.confirm.show({
      content: '确定要清空浏览历史吗？',
      onPressCheck () {
        storage.remove('browsingHistory')
        DeviceEventEmitter.emit('clearHistory')
        toast.show('已清除所有浏览历史')
      }
    })
  }

  function logout() {
    $dialog.confirm.show({
      content: '确定要登出吗？',
      onPressCheck () {
        props.$user.logout()
        toast.show('已登出')
      }
    })
  }

  const { config } = props.state
  const setConfig = (config: Parameters<typeof props.$config.set>[0]) => props.$config.set(config)
  return (
    <ViewContainer>
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

        <SwitchItem title="动态主题" 
          subtext="条目界面的配色随条目本身的主题色切换" 
          value={config.changeThemeColorByArticleMainColor}
          onChange={val => {
            setConfig({ changeThemeColorByArticleMainColor: val })
            props.state.config.theme === 'night' && val && toast.show('黑夜模式下动态主题不生效')
          }}
        />

        <Title>界面</Title>
        <SwitchItem hideSwitch 
          title="更换皮肤"
          onPress={showThemeOptions}
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

        <Title>其他</Title>
        {isHmoe ? <>
          <SwitchItem hideSwitch 
            title="更换数据源"
            onPress={showSiteSelector}
          />
        </> : null}

        <SwitchItem hideSwitch
          title="关于"
          onPress={() => props.navigation.push('about')}
        />

        <SwitchItem hideSwitch
          title={isHmoe ? '在Github上查看新版本' : '前往Github下载支持H萌娘的版本'}
          onPress={() => Linking.openURL('https://github.com/koharubiyori/Moegirl-RN/releases')}
        />
      </ScrollView>
    </ViewContainer>
  )
}

export default configHOC(userHOC(Settings))

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