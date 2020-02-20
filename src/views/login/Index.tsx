import React, { PropsWithChildren, useEffect, useState, useRef } from 'react'
import { BackHandler, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Button from '~/components/Button'
import StatusBar from '~/components/StatusBar'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import toast from '~/utils/toast'
import { TextInput, useTheme, DefaultTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { colors } from '~/theme'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & UserConnectedProps

function Login(props: PropsWithChildren<FinalProps>) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => global.$isVisibleLoading)
    return () => listener.remove()
  }, [])

  function submit() {
    if (!userName) return toast.show('用户名不能为空')
    if (!password) return toast.show('密码不能为空')

    toast.showLoading('登录中')
    props.$user.login(userName, password)
      .finally(toast.hide)
      .then(() => {
        setTimeout(() => toast.show('登录成功'))
        props.navigation.goBack()
      })
      .catch(status => toast.show(status === 'FAIL' ? '用户名或密码错误' : '网络错误，请重试'))
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <StatusBar translucent={false} blackText />
      <Image source={require('~/assets/images/moemoji.png')} style={{ width: 70, height: 80, marginTop: 20, marginLeft: -10 }} resizeMode="cover" />
      <Text style={{ color: colors.green.primary, fontSize: 17, marginTop: 20 }}>萌娘百科，万物皆可萌的百科全书！</Text>

      <InputItem icon="account-circle" placeholder="用户名" value={userName} onChangeText={setUserName} />
      <InputItem secureTextEntry icon="lock" placeholder="密码" value={password} onChangeText={setPassword} />

      <Button contentContainerStyle={styles.submitBtn} noLimit={false} onPress={submit}>
        <Text style={{ color: 'white', fontSize: 18 }}>登录</Text>
      </Button>

      <View style={{ flex: 1 }}></View>
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => Linking.openURL('https://mzh.moegirl.org/index.php?title=Special:创建账户')}>
        <Text style={{ color: colors.green.primary, textDecorationLine: 'underline', fontSize: 16 }}>还没有萌百帐号？点击前往官网进行注册</Text>
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
    backgroundColor: colors.green.primary, 
    borderRadius: 3,
    marginTop: 20,
    // elevation: 1
  },

  textInput: {
    width: 250,
    height: 50,
    backgroundColor: 'white',
    paddingLeft: 25,
  }
})

interface InputItemProps {
  placeholder: string
  icon: string
  value: string
  secureTextEntry?: boolean
  onChangeText (text: string): void
}
function InputItem(props: InputItemProps) {
  const textInputRef = useRef<any>()
  
  return (
    <TouchableWithoutFeedback onPress={() => textInputRef.current.focus()}>
      <View style={{ marginVertical: 10 }}>
        <MaterialIcon name={props.icon} color={colors.green.primary} size={28} style={{ position: 'absolute', zIndex: 1, top: 12 }} />
        <TextInput 
          theme={{ ...DefaultTheme, colors: colors.green }}
          style={styles.textInput}
          secureTextEntry={props.secureTextEntry} 
          placeholder={props.placeholder} 
          value={props.value} 
          onChangeText={props.onChangeText} 
          ref={textInputRef}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}