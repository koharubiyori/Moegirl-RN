import React, { PropsWithChildren, useRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, DefaultTheme, Dialog, HelperText, Text, TextInput, useTheme } from 'react-native-paper'
import { maxSummaryLength } from '../index'

export interface Props {
  visible: boolean
  value: string
  onDismiss(): void
  onChangeText(value: string): void
  onSubmit(): void
}

type FinalProps = Props

function EditSubmitDialog(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const refs = {
    input: useRef<any>()
  }
  
  return (
    <Dialog
      visible={props.visible}
      onDismiss={props.onDismiss}
      style={{ paddingHorizontal: 10 }}
    >
      <Dialog.Title>保存编辑</Dialog.Title>
      <Dialog.Content>
        <TextInput autoFocus
          theme={{ ...DefaultTheme, colors: { ...theme.colors, primary: theme.colors.accent } }}
          maxLength={maxSummaryLength}
          value={props.value} 
          placeholder="请输入摘要" 
          onChangeText={props.onChangeText}
          selectionColor={theme.colors.accent}
          style={{
            backgroundColor: 'transparent'
          }}
          ref={refs.input}
        />
        <HelperText>
          还能输入{maxSummaryLength - props.value.length}个字
        </HelperText>

        <Text style={{ marginTop: 15, fontSize: 15 }}>快速摘要</Text>
        <ScrollView horizontal style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {['修饰语句', '修正笔误', '内容扩充', '排版'].map(text =>
            <TouchableOpacity
              key={text}
              style={{ borderRadius: 20, padding: 8, marginRight: 5, backgroundColor: theme.colors.lightBg }}
              onPress={() => {
                props.onChangeText(props.value + text)
                setTimeout(() => refs.input.current.focus(), 500)
              }}
            >
              <Text style={{ fontSize: 15 }}>{text}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Dialog.Content>
      
      <Dialog.Actions>
        <Button onPress={props.onDismiss} style={{ marginRight: 10 }} color={theme.colors.placeholder}>
          <Text style={{ fontSize: 16, color: theme.colors.placeholder }}>取消</Text>
        </Button>
        
        <Button onPress={props.onSubmit}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>提交</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default EditSubmitDialog

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent'
  }
})