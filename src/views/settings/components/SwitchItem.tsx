import PropTypes from 'prop-types'
import React, { PropsWithChildren } from 'react'
import { StyleSheet, Switch, Text, TouchableNativeFeedback, View } from 'react-native'

SettingItem.propTypes = {
  title: PropTypes.string,
  subtext: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
}

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
            thumbColor={props.value ? $colors.main : '#eee'}
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