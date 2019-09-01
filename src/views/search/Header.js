import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, TextInput,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '@/components/Button'
import { NavigationContext } from './Index'

SearchHeader.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func
}

export default function SearchHeader({
  value,
  onChangeText
}){
  return (
    <NavigationContext.Consumer>{navigation =>
      <View style={styles.body}>
        <Button onPress={navigation.goBack} >
          <Icon name="keyboard-backspace" size={25} color="#666" />
        </Button>

        <TextInput autoFocus value={value}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="搜索萌娘百科..."
          onChangeText={onChangeText}
          style={styles.input}
        ></TextInput>
      </View>
    }</NavigationContext.Consumer>
  )
}

const styles = StyleSheet.create({
  body: {
    height: 55,
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  input: {
    marginLeft: 5,
    fontSize: 16,

  }
})