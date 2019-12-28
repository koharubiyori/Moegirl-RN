import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity, 
  StyleSheet, BackHandler, Linking, 
} from 'react-native'
import { TextField } from 'react-native-material-textfield'
import StatusBar from '~/components/StatusBar'
import userHOC from '~/redux/user/HOC'
import Button from '~/components/Button'
import toast from '~/utils/toast'


function Login(props){
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const textFieldStyle = {
    containerStyle: { width: 250 },
    fontSize: 18,
    textColor: '#666',
    baseColor: $colors.sub,
    tintColor: $colors.sub
  }

  useEffect(() =>{
    const listener = BackHandler.addEventListener('hardwareBackPress', () => global.$isVisibleLoading)
    return () => listener.remove()
  }, [])

  function submit(){
    if(!userName) return toast.show('用户名不能为空')
    if(!password) return toast.show('密码不能为空')

    toast.showLoading('登录中')
    props.user.login(userName, password)
    .finally(toast.hide)
    .then(() =>{
      setTimeout(() => toast.show('登录成功'))
      props.navigation.goBack()
    })
    .catch(status => toast.show(status === 'FAIL' ? '用户名或密码错误' : '网络错误，请重试'))
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <StatusBar translucent={false} blackText color="white" />
      <Image source={require('~/assets/images/moemoji.png')} style={{ width: 70, height: 80, marginTop: 20, marginLeft: -10 }} resizeMode="cover" />
      <Text style={{ color: $colors.main, fontSize: 17, marginTop: 20 }}>萌娘百科，万物皆可萌的百科全书！</Text>
      <TextField label="用户名" {...textFieldStyle} value={userName} onChangeText={setUserName} />
      <TextField label="密码" {...textFieldStyle} value={password} secureTextEntry onChangeText={setPassword} />
      <Button contentContainerStyle={styles.submitBtn} noLimit={false} onPress={submit}>
        <Text style={{ color: 'white', fontSize: 18}}>登录</Text>
      </Button>

      <View style={{ flex: 1 }}></View>
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => Linking.openURL('https://mzh.moegirl.org/index.php?title=Special:创建账户')}>
        <Text style={{ color: $colors.sub, textDecorationLine: 'underline', fontSize: 16 }}>还没有萌百帐号？点击前往官网进行注册</Text>
      </TouchableOpacity>
    </View>
  )
}

export default userHOC(Login)

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