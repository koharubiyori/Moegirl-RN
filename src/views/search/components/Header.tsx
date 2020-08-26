import React, { PropsWithChildren } from 'react'
import { NativeModules, StyleSheet, TextInput, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MyButton from '~/components/MyButton'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import i from '../lang'

export interface Props {
  value: string
  onChangeText (text: string): void
  onSubmit (): void
}

function SearchHeader(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  const theme = useTheme()
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT

  return (
    <View 
      style={{ 
        ...styles.body, 
        backgroundColor: theme.colors.surface, 
        height: 56 + statusBarHeight, 
        paddingTop: statusBarHeight 
      }}
    >
      <MyButton noRippleLimit 
        rippleColor={theme.colors.placeholder}
        onPress={() => navigation.goBack()} 
      >
        <Icon name="keyboard-backspace" size={26} color={theme.colors.disabled} />
      </MyButton>

      <TextInput autoFocus 
        value={props.value}
        autoCapitalize="none"
        returnKeyType="search"
        autoCorrect={false}
        placeholder={i.header.searchInputPlaceholder(store.settings.source === 'hmoe' ? i.header.hmoe : i.header.moegirl)}
        placeholderTextColor={theme.colors.placeholder}
        onChangeText={props.onChangeText}
        onSubmitEditing={props.onSubmit}
        style={{ ...styles.input, color: theme.colors.text }}
      />

      {!!props.value &&
        <Icon 
          name="close" 
          size={20} 
          color={theme.colors.placeholder} 
          onPress={() => props.onChangeText('')}
          style={{ marginRight: 10 }}
        />
      }
    </View>
  )
}

export default SearchHeader

const styles = StyleSheet.create({
  body: {
    height: 56,
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1
  }
})