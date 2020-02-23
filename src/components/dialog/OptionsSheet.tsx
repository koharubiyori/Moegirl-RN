import React, { MutableRefObject, PropsWithChildren, useState } from 'react'
import { Button, Dialog, RadioButton, useTheme, Text } from 'react-native-paper'
import { View } from 'react-native'
import MyButton from '~/components/Button'

export interface Props {
  getRef: MutableRefObject<any>
}

export interface ShowFnOptions {
  title?: string
  options: { label: string, value: string }[]
  defaultSelected: string | number
  checkText?: string
  onPressCheck?(value: string | number): void
  onClose?(): void
  onChange?(value: string | number): void
}

export interface OptionsSheetRef {
  show (options: ShowFnOptions): void
  hide (): void
}

type FinalProps = Props

function OptionsSheet(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<string | number>(0)
  const [params, setParams] = useState({
    title: '',
    options: [] as ShowFnOptions['options'],
    checkText: '',
    onPressCheck: (() => {}) as ShowFnOptions['onPressCheck'],
    onClose: () => {},
    onChange: (() => {}) as ShowFnOptions['onChange']
  })

  if (props.getRef) props.getRef.current = { show, hide }

  function show({
    options,
    defaultSelected,
    title = '提示',
    checkText = '确定',
    onPressCheck = () => {},
    onClose = () => {},
    onChange = () => {}
  }: ShowFnOptions) {
    setSelected(defaultSelected)
    setParams({ 
      title, options, checkText, onClose, onChange,
      onPressCheck: (value: string) => { onPressCheck(value); hide() } 
    } as any)
    setVisible(true)
  }

  function hide() {
    params.onClose()
    setVisible(false)
  }

  function tapOption(value: string) {
    setSelected(value)
    params.onChange && params.onChange(value)
  }

  return (
    <Dialog
      visible={visible}
      onDismiss={hide}
      style={{ marginHorizontal: 40 }}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Content>
        {params.options.map(option => 
          <MyButton 
            noLimit={false}
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
        <Button onPress={() => params.onPressCheck && params.onPressCheck(selected)}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{params.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default OptionsSheet