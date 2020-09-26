import React, { PropsWithChildren, useImperativeHandle, useState, forwardRef } from 'react'
import { View } from 'react-native'
import { Button, Dialog, RadioButton, Text, useTheme } from 'react-native-paper'
import MyButton from '~/components/MyButton'
import useStateWithRef from '~/hooks/useStateWithRef'
import i from './lang'

export interface Props {

}

export interface optionSheetOptions {
  title?: string
  options: { label: string, value: string }[]
  defaultSelected: string | number
  checkText?: string
  autoClose?: boolean
  onChange?(value: string | number): void
}

export interface OptionSheetDialogRef {
  show (options: optionSheetOptions, autoClose?: boolean): Promise<string | number>
  hide (): void
}

function OptionSheetDialog(props: PropsWithChildren<Props>, ref: any) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [selected, setSelected, selectedRef] = useStateWithRef<string | number>('')
  const [params, setParams] = useState({
    title: '',
    options: [] as optionSheetOptions['options'],
    checkText: '',
    checkHandler: (selectedVal: string | number) => {},
    closeHandler: (selectedVal: string | number) => {},
    onChange: ((selectedVal: string | number) => {}) as optionSheetOptions['onChange']
  })

  useImperativeHandle<any, OptionSheetDialogRef>(ref, () => ({ show, hide }))

  function show({
    options,
    defaultSelected,
    title = i.title,
    checkText = i.check,
    autoClose = true,
    onChange = () => {}
  }: optionSheetOptions): Promise<string | number> {
    return new Promise((resolve, reject) => {
      setSelected(defaultSelected)
      setParams({ 
        title, 
        options, 
        checkText, 
        checkHandler: selectedVal => {
          autoClose && hide()
          resolve(selectedVal)
        },
        closeHandler: () => { autoClose && hide(); reject(selectedRef.current) },
        onChange,
      })
      setVisible(true)
    })
  }

  function hide() {
    setVisible(false)
    params.closeHandler(selected)
  }

  function tapOption(value: string) {
    setSelected(value)
    params.onChange && params.onChange(value)
  }

  return (
    <Dialog
      visible={visible}
      onDismiss={hide}
      style={{ marginHorizontal: 20 }}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Content>
        {params.options.map(option => 
          <MyButton 
            key={option.value} 
            rippleColor="#ccc"
            onPress={() => tapOption(option.value)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value={option.value}
                status={selected === option.value ? 'checked' : 'unchecked'}
                onPress={() => tapOption(option.value)}
              />
              <Text style={{ fontSize: 16, marginLeft: 10, marginTop: -2 }}>{option.label}</Text>
            </View>
          </MyButton>
        )}
      </Dialog.Content>
      <Dialog.Actions style={{ marginHorizontal: 10 }}>
        <Button onPress={() => params.checkHandler(selected)}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{params.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default forwardRef(OptionSheetDialog)