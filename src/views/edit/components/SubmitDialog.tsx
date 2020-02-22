import React, { PropsWithChildren, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button, Dialog, TextInput, HelperText } from 'react-native-paper'
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
  return (
    <Dialog
      visible={props.visible}
      onDismiss={props.onDismiss}
      style={{ paddingHorizontal: 10 }}
    >
      <Dialog.Title>保存编辑</Dialog.Title>
      <Dialog.Content>
        <TextInput autoFocus
          maxLength={maxSummaryLength}
          value={props.value} 
          placeholder="请输入摘要" 
          onChangeText={props.onChangeText}
          style={styles.input}
        />
        <HelperText>
          还能输入{maxSummaryLength - props.value.length}个字
        </HelperText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onDismiss} style={{ marginRight: 10 }} color="#ccc">
          <Text style={{ fontSize: 16 }}>取消</Text>
        </Button>
        
        <Button onPress={props.onSubmit}>
          <Text style={{ fontSize: 16 }}>提交</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default EditSubmitDialog

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white'
  }
})