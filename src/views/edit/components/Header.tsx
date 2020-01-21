import PropTypes from 'prop-types'
import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import Toolbar from '~/components/Toolbar'

EditHeader.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object,
  onTapDoneBtn: PropTypes.func
}

export interface Props {
  title: string
  navigation: __Navigation.Navigation
  onTapDoneBtn (): void
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
      onPressRightIcon={props.onTapDoneBtn}
    />
  )
}

const styles = StyleSheet.create({
  
})