import React, { PropsWithChildren, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, DefaultTheme, Dialog, HelperText, Text, TextInput, useTheme } from 'react-native-paper'
import { maxSummaryLength } from '../index'

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
  
  console.log(status)
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
      <Dialog.Title>用户验证</Dialog.Title>
      <Dialog.Content>
        <TouchableOpacity onPress={props.onPressImg}>
          {status !== 3 ? <>
            <View style={{ ...imgSize, ...styles.imgMask, backgroundColor: theme.colors.lightBg }}>
              {{
                0: () => <Text style={{ color: theme.colors.placeholder }}>图片加载失败，点此重试</Text>,
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
          placeholder="请输入图片中的字幕" 
          onChangeText={setInputValue}
          selectionColor={theme.colors.accent}
          style={{
            backgroundColor: 'transparent'
          }}
        />
        <HelperText>空格和标点符号无需输入，若看不清可以点击图片更换</HelperText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onDismiss} style={{ marginRight: 10 }} color={theme.colors.placeholder}>
          <Text style={{ fontSize: 16, color: theme.colors.placeholder }}>取消</Text>
        </Button>
        
        <Button onPress={() => props.onSubmit(inputValue)}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>提交</Text>
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