import Color from 'color'
import React, { PropsWithChildren, useRef, useState } from 'react'
import { Animated, Dimensions, Image, KeyboardAvoidingView, Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TextField, TextFieldProps, OutlinedTextField } from '@ubaids/react-native-material-textfield'
import { Text } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MyButton from '~/components/MyButton'
import MyStatusBar from '~/components/MyStatusBar'
import ViewContainer from '~/components/ViewContainer'
import useLockDrawer from '~/hooks/useLockDrawer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import { colors } from '~/theme'
import dialog from '~/utils/dialog'
import toast from '~/utils/toast'
import i from './lang'

export interface Props {
  
}

export interface RouteParams {
  
}

function LoginPage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  const [userName, setUserName] = useState({
    touched: false,
    value: ''
  })
  const [password, setPassword] = useState({
    touched: false,
    value: '',
  })
  const [showingPsd, setShowingPsd] = useState(false)
  const kotoriTransition = useRef(new Animated.Value(0)).current
  
  useLockDrawer()

  // 小鸟抢镜脸动画
  const focusedPsdInput = useRef(false)
  function showKotori() {
    if (focusedPsdInput.current) { return }
    focusedPsdInput.current = true
    const animation = (toValue: number, duration: number) => 
      Animated.timing(kotoriTransition, {
        toValue,
        duration,
        useNativeDriver: true
      })

    Animated.sequence([
      Animated.delay(1000),
      animation(0.4, 1000),
      animation(0, 300),
      animation(0.5, 1000),
      Animated.delay(1000),
      animation(0, 300),
      Animated.delay(1000),
      animation(1, 500)
    ]).start()
  }

  function submit() {
    if (userName.value === '') return toast(i.index.submit.userNameEmptyMsg, 'center')
    if (password.value === '') return toast(i.index.submit.passwordEmptyMsg, 'center')

    dialog.loading.show({ title: i.index.submit.loggingIn, allowUserClose: true })
    store.user.login(userName.value, password.value)
      .finally(dialog.loading.hide)
      .then(() => {
        setTimeout(() => toast(i.index.submit.loggedIn, 'center'))
        navigation.goBack()
      })
      .catch(message => toast(message || i.index.submit.netErr, 'center'))
  }

  const isHmoeSource = store.settings.source === 'hmoe'
  const primaryColor = Color(colors.green.primary).lighten(0.75).toString()
  const inputStyles: TextFieldProps = {
    labelTextStyle: {
      paddingTop: 5, 
      position: 'relative', 
      top: -3
    },

    lineWidth: 1,
    baseColor: '#bbb',
    textColor: 'white',
    tintColor: primaryColor,
    errorColor: Color('red').lighten(0.75).toString()
  }
  const kotoriTranslate = [
    kotoriTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [70, 0]
    }),
    kotoriTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [-70, 0]
    })
  ]
  return (
    <ViewContainer style={styles.container}>      
      <MyStatusBar hidden />
      <Image 
        style={{
          ...styles.bgImg, 
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
        source={require('~/assets/images/moe_2014_haru.png')}
        resizeMode="cover" 
      />
      <View style={styles.mask} />
      <Animated.View
        style={{
          ...styles.kotoriWrapper,
          transform: [
            // translate: [x, y] 不支持动画
            { translateX: kotoriTranslate[0] },
            { translateY: kotoriTranslate[1] }
          ]
        }}
      >
        <Image
          style={styles.kotori}
          source={require('~/assets/images/moe_kotori.png')}   
        />
      </Animated.View>
    
      <KeyboardAvoidingView behavior="position">
        <View style={{
          ...styles.body,
          width: Dimensions.get('window').width * 0.85
        }}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('~/assets/images/moemoji.png')} 
              style={styles.logo} 
              resizeMode="cover" 
            />

            <Text 
              style={{ 
                color: primaryColor,
                fontSize: 18,
                marginTop: 20,
                marginBottom: 20
              }}
            >{i.index.catchCopy}</Text>
          </View>

          <View style={{ width: 290 }}>
            <OutlinedTextField
              {...inputStyles}
              label={i.index.userName}
              value={userName.value}
              onChangeText={value => setUserName({ touched: true, value })}
              onBlur={() => setUserName(prevVal => ({ ...prevVal, touched: true }))}
            />
            <View>
              <OutlinedTextField
                {...inputStyles}
                containerStyle={{ marginTop: 10 }}
                inputContainerStyle={{ paddingRight: 40 }}
                textContentType="password"
                secureTextEntry={!showingPsd}
                label={i.index.password}
                value={password.value}
                onChangeText={value => setPassword({ touched: true, value })}
                onBlur={() => setPassword(prevVal => ({ ...prevVal, touched: true }))}
                onFocus={showKotori}
              />

              <MaterialCommunityIcon 
                style={{
                  ...styles.showingPsdBtn,
                  bottom: 23,
                }}
                name={showingPsd ? 'eye' : 'eye-off'} 
                color={showingPsd ? primaryColor : '#ccc'}
                size={26}  
                onPress={() => setShowingPsd(prevVal => !prevVal)}
              />
            </View>
          </View>

          <MyButton contentContainerStyle={{ ...styles.submitBtn, backgroundColor: colors.green.primary }} onPress={submit}>
            <Text style={{ color: 'white', fontSize: 18 }}>{i.index.login}</Text>
          </MyButton>

          <TouchableOpacity 
            style={{ marginTop: 25 }} 
            onPress={() => Linking.openURL(isHmoeSource ? 'https://www.hmoegirl.com/index.php?title=特殊:创建账户&returnto=H萌娘%3A关于' : 'https://mzh.moegirl.org/index.php?title=Special:创建账户')}
          >
            <Text style={{ color: 'white', textDecorationLine: 'underline', fontSize: 16 }}>{i.index.noAccountHint(isHmoeSource ? i.index.hmoe : i.index.moegirl)}</Text>
          </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>
    </ViewContainer>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  bgImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -2
  },

  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: -1
  },

  kotoriWrapper: {
    position: 'absolute',
    top: -3,
    right: -5,
  },

  kotori: {
    width: 85,
    height: 85,
    transform: [{ rotate: '260deg' }]
  },

  body: {
    paddingVertical: 30,
    alignItems: 'center',
    borderRadius: 2,
    position: 'relative',
    top: -20
  },

  logoWrapper: {
    alignItems: 'center',
  },

  logo: {
    width: 65,
    height: 70, 
  },

  showingPsdBtn: {
    position: 'absolute',
    right: 10,
    bottom: 15
  },

  submitBtn: {
    width: 290,
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 3,
    marginTop: 20,
  },
})