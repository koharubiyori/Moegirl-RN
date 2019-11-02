import React from 'react'
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
import userHOC from '~/redux/user/HOC'

function Title(props){
  return (
    <View style={styles.title}>
      <Text style={{ color: $colors.main, fontSize: 15 }}>{props.children}</Text>
    </View>
  )
}

class Settings extends React.Component{
  static propTypes = {

  }

  constructor (props){
    super(props)

    this.state = {
      config: {
        heimu: true,
        biliPlayerReload: false,
        immersionMode: false,
      }
    }

    storage.get('config').then(config =>{
      config && this.setState({ config })
    })
  }

  componentDidUpdate (){
    storage.set('config', this.state.config)
  }

  clearArticleCache = () =>{
    $dialog.confirm.show({
      content: '确定要清空条目缓存吗？',
      onTapCheck: () =>{
        storage.remove('articleCache')
        storage.remove('articleRedirectMap')
        toast.show('已清除所有条目缓存')
      }
    })
  }

  clearHistory = () =>{
    $dialog.confirm.show({
      content: '确定要清空浏览历史吗？',
      onTapCheck: () =>{
        storage.remove('browsingHistory')
        DeviceEventEmitter.emit('clearHistory')
        toast.show('已清除所有浏览历史')
      }
    })
  }

  logout = () =>{
    $dialog.confirm.show({
      content: '确定要登出吗？',
      onTapCheck: () =>{
        this.props.user.logout()
        toast.show('已登出')
      }
    })
  }

  render (){
    const { config } = this.state
    const setConfig = param => this.setState({ config: { ...config, ...param } })

    return (
      <View>
        <StatusBar />
        <Toolbar size={26}
          centerElement="设置"
          leftElement="keyboard-backspace"
          onLeftElementPress={() => this.props.navigation.goBack()}
        />

        <ScrollView>
          <Title>条目</Title>

          <SwitchItem title="黑幕开关"
            subtext="关闭后黑幕将默认为刮开状态"
            value={config.heimu}
            onChange={val => setConfig({ heimu: val })}
          />

          <SwitchItem title="B站播放器重载"
            subtext="开启后，收起B站播放器后将彻底关闭关闭播放器，而不是后台继续播放，但再次展开将消耗额外的流量"
            value={config.biliPlayerReload}
            onChange={val => setConfig({ biliPlayerReload: val })}
          />

          <SwitchItem title="完全沉浸模式"
            subtext="浏览条目时将隐藏状态栏"
            value={config.immersionMode}
            onChange={val => setConfig({ immersionMode: val })}
          />

          <Title>缓存</Title>

          <SwitchItem hideSwitch
            title="清除条目缓存"
            onPress={() => this.clearArticleCache()}
          />

          <SwitchItem hideSwitch
            title="清除浏览历史"
            onPress={() => this.clearHistory()}
          />

          <Title>账户</Title>
          <SwitchItem hideSwitch
            title="登出"
            onPress={() => this.logout()}
          />

          <Title>其他</Title>

          <SwitchItem hideSwitch
            title="关于"
            onPress={() => this.props.navigation.push('about')}
          />
        </ScrollView>


      </View>
    )
  }
}

export default userHOC(Settings)

const styles = StyleSheet.create({
  title: {
    color: $colors.main,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10
  }
})