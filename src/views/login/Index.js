import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity, Linking, KeyboardAvoidingView,
  StyleSheet
} from 'react-native'
import { TextField } from 'react-native-material-textfield'
import StatusBar from '~/components/StatusBar'
import { createHOC } from '~/redux/user'
import Button from '~/components/Button'
import toast from '~/utils/toast'

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

  submit = () =>{
    const { userName, password } = this.state
    if(!userName) return toast.show('用户名不能为空')
    if(!password) return toast.show('密码不能为空')

    toast.showLoading('登录中')
    this.props.userLogin(userName, password)
    .finally(toast.hide)
    .then(() =>{
      toast.showSuccess('登录成功')
      this.props.navigation.goBack()
    })
    .catch(status => toast.show(status === 'FAIL' ? '用户名或密码错误' : '网络错误，请重试'))
  }
  
  render (){
    return (
      <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center' }}>
        <StatusBar blackText color="white" />
        <Image source={require('~/assets/images/moemoji.png')} style={{ width: 70, height: 80, marginTop: 20, marginLeft: -10 }} resizeMode="cover" />
        <Text style={{ color: $colors.main, fontSize: 17, marginTop: 20 }}>萌娘百科，万物皆可萌的百科全书！</Text>
        <TextField label="用户名" {...this.textFieldStyle} value={this.state.userName} onChangeText={val => this.setState({ userName: val })} />
        <TextField label="密码" {...this.textFieldStyle} value={this.state.password} secureTextEntry onChangeText={val => this.setState({ password: val })} />
        <Button contentContainerStyle={styles.submitBtn} noLimit={false} onPress={this.submit}>
          <Text style={{ color: 'white', fontSize: 18}}>登录</Text>
        </Button>

        <TouchableOpacity style={{ position: 'absolute', bottom: 10 }} onPress={() => Linking.openURL('https://mzh.moegirl.org/index.php?title=Special:创建账户')}>
          <Text style={{ color: $colors.sub, textDecorationLine: 'underline', fontSize: 16 }}>还没有萌百帐号？点击前往网页端进行注册</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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