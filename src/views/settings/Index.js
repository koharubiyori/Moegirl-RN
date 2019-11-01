import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import { Toolbar } from 'react-native-material-ui'
import storage from '~/utils/storage'
import SwitchItem from './components/SwitchItem'

function Title(props){
  return (
    <View style={styles.title}>
      <Text style={{ color: $colors.main, fontSize: 15 }}>{props.children}</Text>
    </View>
  )
}

export default class Settings extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    
    this.state = {
      heimu: true,
      biliPlayerReload: false,
      immersionMode: false,
    }

    storage.get('config').then(config => this.setState({ ...config }))
  }
  
  clearArticleCache = () =>{

  }

  clearHistory = () =>{

  }

  logout = () =>{

  }

  render (){
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
            value={this.state.heimu}
            onChange={val => this.setState({ heimu: val })}
          />

          <SwitchItem title="B站播放器重载" 
            subtext="开启后，收起B站播放器后将彻底关闭关闭播放器，而不是后台继续播放，但再次展开将消耗额外的流量" 
            value={this.state.biliPlayerReload}
            onChange={val => this.setState({ biliPlayerReload: val })}
          />

          <SwitchItem title="完全沉浸模式" 
            subtext="浏览条目时将隐藏状态栏" 
            value={this.state.immersionMode}
            onChange={val => this.setState({ immersionMode: val })}
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

const styles = StyleSheet.create({
  title: {
    color: $colors.main,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10
  }
})