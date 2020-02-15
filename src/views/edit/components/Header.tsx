import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import Toolbar from '~/components/Toolbar'

export interface Props {
  title: string
  navigation: __Navigation.Navigation
  onPressDoneBtn (): void
}

type FinalProps = Props

export default function EditHeader(props: PropsWithChildren<FinalProps>) {
  return (
    <Toolbar
      style={{
        elevation: 0, 
        borderBottomColor: 'white', 
        borderBottomWidth: 1
      }}

      title={`编辑：${props.title}`}
      leftIcon="keyboard-backspace"
      rightIcon="done"
      onPressLeftIcon={props.navigation.goBack}
      onPressRightIcon={props.onPressDoneBtn}
    />
  )
}

const styles = StyleSheet.create({
  
})