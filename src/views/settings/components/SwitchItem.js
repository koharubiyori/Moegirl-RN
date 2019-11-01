import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, TouchableNativeFeedback, Switch,
  StyleSheet
} from 'react-native'

SettingItem.propTypes = {
  title: PropTypes.string,
  subtext: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
}

export default function SettingItem({
  title, subtext, value, hideSwitch,
  onChange = new Function,
  onPress = new Function
}){
  return (
    <TouchableNativeFeedback onPress={() =>{ onChange(!value); onPress() }}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{title}</Text>
          {subtext ? <Text style={{ fontSize: 12, color: '#ABABAB', marginTop: 5 }}>{subtext}</Text> : null}
        </View>

        {!hideSwitch ? 
          <Switch 
            thumbColor={value ? $colors.main : '#eee'}
            value={value} 
            onValueChange={onChange}
          />
        : null}
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