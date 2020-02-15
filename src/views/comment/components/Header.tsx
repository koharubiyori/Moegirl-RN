import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import Toolbar from '~/components/Toolbar'

export interface Props {
  title: string
  navigation: __Navigation.Navigation
  onPressAddComment (): void
}

type FinalProps = Props

export default function CommentHeader(props: PropsWithChildren<FinalProps>) {
  return (
    <Toolbar
      title={props.title}
      leftIcon="keyboard-backspace"
      rightIcon="add"
      onPressLeftIcon={props.navigation.goBack}
      onPressRightIcon={props.onPressAddComment}
    />
  )
}

const styles = StyleSheet.create({
  
})