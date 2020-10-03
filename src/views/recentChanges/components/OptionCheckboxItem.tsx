import React, { PropsWithChildren } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Checkbox, Text, useTheme } from 'react-native-paper'
import store from '~/mobx'

export interface Props {
  title: string
  checked: boolean
  onPress(): void
}

;(RecentChangesOptionCheckboxItem as DefaultProps<Props>).defaultProps = {
  
}

function RecentChangesOptionCheckboxItem(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  const isNight = store.settings.theme === 'night'
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}>
        <View style={{ marginLeft: -5, marginRight: -3 }}>
          <Checkbox 
            status={props.checked ? 'checked' : 'unchecked'}
          />
        </View>
        <Text style={{ color: props.checked ? theme.colors.accent : theme.colors.placeholder }}>{props.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default RecentChangesOptionCheckboxItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    paddingHorizontal: 6,
    borderRadius: 30,
  }
})