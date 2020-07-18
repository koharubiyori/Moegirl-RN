import React, { PropsWithChildren, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, DefaultTheme, Dialog, HelperText, Text, TextInput, useTheme } from 'react-native-paper'
import { maxSummaryLength } from '../index'
import i from '../lang'

export interface Props {
  visible: boolean
  img: string | undefined
  onDismiss(): void
  onSubmit(captchaVal: string): void
  onPressImg(): void
}

type FinalProps = Props

function EditCaptchaDialog(props: PropsWithChildren<FinalProps>) {
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(1)
  const theme = useTheme()
  
  const imgSize = {
    width: Dimensions.get('window').width - 120,
    height: 160
  }
  return (
    <Dialog
      visible={props.visible}
      onDismiss={props.onDismiss}
      style={{ paddingHorizontal: 10 }}
    >
      <Dialog.Title>{i.captcha.title}</Dialog.Title>
      <Dialog.Content>
        <TouchableOpacity onPress={props.onPressImg}>
          {status !== 3 ? <>
            <View style={{ ...imgSize, ...styles.imgMask, backgroundColor: theme.colors.lightBg }}>
              {{
                0: () => <Text style={{ color: theme.colors.placeholder }}>{i.captcha.loadingErr}</Text>,
                1: () => null,
                2: () => <ActivityIndicator color={theme.colors.accent} size={50} />,
              }[status]()}
            </View>
          </> : null}
          <Image progressiveRenderingEnabled
            source={{ uri: props.img }} 
            resizeMode="contain"
            style={{ ...imgSize }}
            onLoadStart={() => setStatus(2)}
            onError={() => setStatus(0)}
            onLoad={() => setStatus(3)}
            onMagicTap={props.onPressImg}
          />
        </TouchableOpacity>
        <TextInput autoFocus
          theme={{ ...DefaultTheme, colors: { ...theme.colors, primary: theme.colors.accent } }}
          maxLength={maxSummaryLength}
          value={inputValue} 
          placeholder={i.captcha.inputHint} 
          onChangeText={setInputValue}
          selectionColor={theme.colors.accent}
          style={{
            backgroundColor: 'transparent'
          }}
        />
        <HelperText>{i.captcha.inputHelp}</HelperText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onDismiss} style={{ marginRight: 10 }} color={theme.colors.placeholder}>
          <Text style={{ fontSize: 16, color: theme.colors.placeholder }}>{i.captcha.cancel}</Text>
        </Button>
        
        <Button onPress={() => props.onSubmit(inputValue)}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{i.captcha.submit}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default EditCaptchaDialog

const styles = StyleSheet.create({
  imgMask: {
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    top: 0, 
    left: 0,
    zIndex: 1
  }
})