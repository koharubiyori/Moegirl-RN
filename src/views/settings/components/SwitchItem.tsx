import React, { PropsWithChildren } from 'react'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { Switch } from 'react-native-paper'

export interface Props {
  title: string
  subtext?: string
  value?: boolean
  hideSwitch?: boolean
  onChange? (isSelected: boolean): void
  onPress? (): void
}

(SettingItem as DefaultProps<Props>).defaultProps = {
  onChange: () => {},
  onPress: () => {}
}

type FinalProps = Props

export default function SettingItem(props: PropsWithChildren<FinalProps>) {
  return (
    <TouchableNativeFeedback onPress={() => { props.onChange && props.onChange(!props.value); props.onPress && props.onPress() }}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{props.title}</Text>
          {props.subtext ? <Text style={{ fontSize: 12, color: '#ABABAB', marginTop: 5 }}>{props.subtext}</Text> : null}
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
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  }
})