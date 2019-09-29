import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity, Linking,
  StyleSheet
} from 'react-native'
import { TextField } from 'react-native-material-textfield'
import StatusBar from '~/components/StatusBar'
import { createHOC } from '~/redux/user'
import Button from '~/components/Button'

export default createHOC(class Login extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      userName: '',
      password: ''
    }

    this.textFieldStyle = {
      containerStyle: { width: 250 },
      fontSize: 18,
      textColor: '#666',
      baseColor: $colors.sub,
      tintColor: $colors.sub
    }
  }

  componentWillMount (){
    
  }

  componentDidMount (){
    // userStore._async.login('東東君', 'zhang18640311631').then(data => console.log(data)).catch(e => console.log(e))
  }
  
  render (){
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StatusBar blackText color="white" />
        <Image source={require('~/assets/images/moemoji.png')} style={{ width: 70, height: 80, marginTop: 40, marginLeft: -15 }} resizeMode="cover" />
        <Text style={{ color: $colors.main, fontSize: 17, marginTop: 20 }}>萌娘百科，万物皆可萌的百科全书！</Text>
        <TextField label="用户名" {...this.textFieldStyle} value={this.state.userName} />
        <TextField label="密码" {...this.textFieldStyle} value={this.state.password} secureTextEntry />
        <Button contentContainerStyle={styles.submitBtn} noLimit={false}>
          <Text style={{ color: 'white', fontSize: 18}}>登录</Text>
        </Button>

        <TouchableOpacity style={{ position: 'absolute', bottom: 10 }} onPress={() => Linking.openURL('https://mzh.moegirl.org/index.php?title=Special:创建账户')}>
          <Text style={{ color: $colors.sub, textDecorationLine: 'underline', fontSize: 16 }}>还没有萌百帐号？点击前往网页端进行注册</Text>
        </TouchableOpacity>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  submitBtn: {
    width: 250,
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: $colors.sub, 
    borderRadius: 3,
    marginTop: 20,
    elevation: 1
  }
})