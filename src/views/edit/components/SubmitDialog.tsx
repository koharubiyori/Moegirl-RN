import React, { PropsWithChildren, useRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, DefaultTheme, Dialog, HelperText, Text, TextInput, useTheme } from 'react-native-paper'
import { maxSummaryLength } from '../index'
import i from '../lang'

export interface Props {
  visible: boolean
  value: string
  onDismiss(): void
  onChangeText(value: string): void
  onSubmit(): void
}

type FinalProps = Props

function EditSubmitDialog(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const refs = {
    input: useRef<any>()
  }
  
  return (
    <Dialog
      visible={props.visible}
      onDismiss={props.onDismiss}
      style={{ paddingHorizontal: 10 }}
    >
      <Dialog.Title>{i.submit.title}</Dialog.Title>
      <Dialog.Content>
        <TextInput autoFocus
          theme={{ ...DefaultTheme, colors: { ...theme.colors, primary: theme.colors.accent } }}
          maxLength={maxSummaryLength}
          value={props.value} 
          placeholder={i.submit.summaryPlaceholder}
          onChangeText={props.onChangeText}
          selectionColor={theme.colors.accent}
          style={{
            backgroundColor: 'transparent'
          }}
          ref={refs.input}
        />
        <HelperText>
          {i.submit.wordNumberLimit(maxSummaryLength - props.value.length)}
        </HelperText>

        <Text style={{ marginTop: 15, fontSize: 15 }}>{i.submit.quickSummary.title}</Text>
        <ScrollView horizontal style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {i.submit.quickSummary.list.map(text =>
            <TouchableOpacity
              key={text}
              style={{ borderRadius: 20, padding: 8, marginRight: 5, backgroundColor: theme.colors.lightBg }}
              onPress={() => {
                props.onChangeText(props.value + text)
                setTimeout(() => refs.input.current.focus(), 500)
              }}
            >
              <Text style={{ fontSize: 15 }}>{text}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Dialog.Content>
      
      <Dialog.Actions>
        <Button onPress={props.onDismiss} style={{ marginRight: 10 }} color={theme.colors.placeholder}>
          <Text style={{ fontSize: 16, color: theme.colors.placeholder }}>{i.submit.cancel}</Text>
        </Button>
        
        <Button onPress={props.onSubmit}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{i.submit.submit}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default EditSubmitDialog

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent'
  }
})