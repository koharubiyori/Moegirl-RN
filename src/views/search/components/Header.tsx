import React, { PropsWithChildren, FC } from 'react'
import { NativeModules, StyleSheet, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { withNavigation } from 'react-navigation'
import Button from '~/components/Button'
import { useTheme } from 'react-native-paper'

export interface Props {
  value: string
  onChangeText (text: string): void
  onSubmit (): void
}

type FinalProps = Props & __Navigation.InjectedNavigation

function SearchHeader(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT

  return (
    <View style={{ ...styles.body, backgroundColor: theme.colors.surface, height: 56 + statusBarHeight, paddingTop: statusBarHeight }}>
      <Button onPress={() => props.navigation.goBack()} rippleColor={theme.colors.placeholder}>
        <Icon name="keyboard-backspace" size={26} color={theme.colors.disabled} />
      </Button>

      <TextInput autoFocus value={props.value}
        autoCapitalize="none"
        returnKeyType="search"
        autoCorrect={false}
        placeholder="搜索萌娘百科..."
        placeholderTextColor={theme.colors.text}
        onChangeText={props.onChangeText}
        onSubmitEditing={props.onSubmit}
        style={{ ...styles.input, color: theme.colors.text }}
      />
    </View>
  )
}

export default withNavigation(SearchHeader) as FC<Props>

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