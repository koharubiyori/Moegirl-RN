import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import Toolbar from '~/components/Toolbar'
import { useTheme } from 'react-native-paper'

export interface Props {
  title: string
  onPressDoneBtn (): void
  onPressBack(): void
}

type FinalProps = Props

export default function EditHeader(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  return (
    <Toolbar
      style={{
        elevation: 0, 
        borderBottomColor: theme.colors.onSurface, 
        borderBottomWidth: 1
      }}

      title={`编辑：${props.title}`}
      leftIcon="keyboard-backspace"
      rightIcon="done"
      onPressLeftIcon={props.onPressBack}
      onPressRightIcon={props.onPressDoneBtn}
    />
  )
}

const styles = StyleSheet.create({
  
})