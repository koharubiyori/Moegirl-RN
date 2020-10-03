import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Dialog, Text, useTheme } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import store from '~/mobx'

export interface Props {
  visible: boolean
  selected: string
  title: string
  checkText: string
  themes: { name: string, color: string }[]
  onPressCheck?(themeName: string): void
  onChange?(themeName: string): void
  onHide?(): void
}

;(ThemeSelectionDialog as DefaultProps<Props>).defaultProps = {
  
}

function ThemeSelectionDialog(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  return useObserver(() =>
    <Dialog
      visible={props.visible}
      onDismiss={props.onHide}
      style={{ marginHorizontal: 20, paddingHorizontal: 10 }}
    >
      <Dialog.Title>{props.title}</Dialog.Title>

      <Dialog.Content>
        <View style={styles.optionContainer}>
          {props.themes.map(item =>
            <TouchableOpacity key={item.name} onPress={() => props.onChange && props.onChange(item.name)}>
              <View style={{ 
                ...styles.themeOptionItem,
                backgroundColor: item.color,
                ...(store.settings.theme === 'night' ? {
                  borderWidth: 2,
                  borderColor: '#ccc',
                } : {}) 
              }}>
                {props.selected === item.name && <MaterialIcon name="check" color="white" size={25} />}
              </View>
            </TouchableOpacity> 
          )}
        </View>
      </Dialog.Content>
      
      <Dialog.Actions>
        <Button onPress={() => props.onPressCheck && props.onPressCheck(props.selected)}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{props.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default ThemeSelectionDialog

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: -20
  },
  
  themeOptionItem: {
    width: 45,
    height: 45,
    borderRadius: 40,
    marginBottom: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})