import React, { PropsWithChildren } from 'react'
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native'
import { Switch, Text, useTheme } from 'react-native-paper'

export interface Props {
  title: string
  subtext?: string
  value?: boolean
  hideSwitch?: boolean
  onChange? (isSelected: boolean): void
  onPress? (): void
}

;(SettingsSwitchItem as DefaultProps<Props>).defaultProps = {
  onChange: () => {},
  onPress: () => {}
}

export default function SettingsSwitchItem(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  return (
    <TouchableNativeFeedback onPress={() => { props.onChange && props.onChange(!props.value); props.onPress && props.onPress() }}>
      <View style={{ ...styles.container, borderBottomColor: theme.colors.lightBg }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{props.title}</Text>
          {props.subtext ? <Text style={{ fontSize: 12, color: theme.colors.disabled, marginTop: 5 }}>{props.subtext}</Text> : null}
        </View>

        {!props.hideSwitch ? <>
          <Switch 
            value={props.value} 
            onValueChange={props.onChange}
          />
        </> : null}
      </View>
    </TouchableNativeFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1
  }
})