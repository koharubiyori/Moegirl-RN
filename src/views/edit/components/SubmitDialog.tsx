import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Dialog, HelperText, TextInput, useTheme, Text, DefaultTheme } from 'react-native-paper'
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
        />
        <HelperText>
          还能输入{maxSummaryLength - props.value.length}个字
        </HelperText>
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