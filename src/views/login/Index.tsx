import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { BackHandler, Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Text, TextInput, useTheme, DefaultTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import StatusBar from '~/components/StatusBar'
import ViewContainer from '~/components/ViewContainer'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import toast from '~/utils/toast'
import { configHOC, ConfigConnectedProps } from '~/redux/config/HOC'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & UserConnectedProps & ConfigConnectedProps

function Login(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
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

  const isHmoeSource = props.state.config.source === 'hmoe'
  return (
    <ViewContainer style={{ alignItems: 'center' }}>
      <StatusBar translucent={false} blackText />
      <Image 
        source={isHmoeSource ? require('~/assets/images/hmoe.jpg') : require('~/assets/images/moemoji.png')} 
        style={{ width: isHmoeSource ? 80 : 70, height: 80, marginTop: 20, marginLeft: -10, borderRadius: 5 }} 
        resizeMode="cover" 
      />
      <Text style={{ color: theme.colors.accent, fontSize: 17, marginTop: 20 }}>
        {isHmoeSource ? 'H萌娘，万物皆可H' : '萌娘百科，万物皆可萌的百科全书！'}
      </Text>

      <InputItem icon="account-circle" placeholder="用户名" value={userName} onChangeText={setUserName} />
      <InputItem secureTextEntry icon="lock" placeholder="密码" value={password} onChangeText={setPassword} />

      <Button contentContainerStyle={{ ...styles.submitBtn, backgroundColor: theme.colors.primary }} noLimit={false} onPress={submit}>
        <Text style={{ color: 'white', fontSize: 18 }}>登录</Text>
      </Button>

      <View style={{ flex: 1 }}></View>
      <TouchableOpacity 
        style={{ marginBottom: 10 }} 
        onPress={() => Linking.openURL(isHmoeSource ? 'https://www.hmoegirl.com/index.php?title=特殊:创建账户&returnto=H萌娘%3A关于' : 'https://mzh.moegirl.org/index.php?title=Special:创建账户')}
      >
        <Text style={{ color: theme.colors.accent, textDecorationLine: 'underline', fontSize: 16 }}>还没有{isHmoeSource ? 'H萌娘' : '萌百'}帐号？点击前往官网进行注册</Text>
      </TouchableOpacity>
    </ViewContainer>
  )
}

export default configHOC(userHOC(Login))

const styles = StyleSheet.create({
  submitBtn: {
    width: 250,
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 3,
    marginTop: 20,
  },

  textInput: {
    width: 250,
    height: 50,
    backgroundColor: 'transparent',
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
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const textInputRef = useRef<any>()

  useEffect(() => {
    const intervalKey = setInterval(() => {
      setIsFocused(textInputRef.current.isFocused())
    }, 10)

    return () => clearInterval(intervalKey)
  }, [])

  return (
    <TouchableWithoutFeedback onPress={() => textInputRef.current.focus()}>
      <View style={{ marginVertical: 10 }}>
        <MaterialIcon 
          style={{ position: 'absolute', zIndex: 1, top: 12 }} 
          name={props.icon} 
          color={theme.colors[isFocused ? 'accent' : 'disabled']} 
          size={28} 
        />
        
        <TextInput 
          style={styles.textInput}
          theme={{ ...DefaultTheme, colors: { ...theme.colors, primary: theme.colors.accent } }}
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