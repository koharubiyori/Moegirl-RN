import React, { PropsWithChildren, createRef, useRef, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import AlertDialog, { AlertDialogRef } from './Alert'
import ConfirmDialog, { ConfirmDialogRef } from './Confirm'
import OptionSheetDialog, { OptionSheetDialogRef } from './OptionSheet'
import LoadingDialog, { LoadingDialogRef } from './Loading'
import SnackBar, { SnackBarOptions, SnackBarRef } from './SnackBar'
import { createThemeColorSetter, globalTheme, SetThemeColor } from '~/theme'

export interface DialogRefs {
  alert: AlertDialogRef
  confirm: ConfirmDialogRef
  optionSheet: OptionSheetDialogRef
  loading: LoadingDialogRef
  snackBar: SnackBarRef
}

export interface Props {
  onBindRefs(dialogRefs: DialogRefs): void
}

;(DialogComponents as DefaultProps<Props>).defaultProps = {
  
}

export let setDialogThemeColor: SetThemeColor = null as any

function DialogComponents(props: PropsWithChildren<Props>) {
  const [theme, setTheme] = useState(globalTheme.current)
  
  const refs = {
    alert: useRef<AlertDialogRef>(),
    confirm: useRef<ConfirmDialogRef>(),
    optionSheet: useRef<OptionSheetDialogRef>(),
    loading: useRef<LoadingDialogRef>(),
    snackBar: useRef<SnackBarRef>()
  }

  setDialogThemeColor = createThemeColorSetter(setTheme)

  useEffect(() => {
    props.onBindRefs({
      alert: refs.alert.current!,
      confirm: refs.confirm.current!,
      optionSheet: refs.optionSheet.current!,
      loading: refs.loading.current!,
      snackBar: refs.snackBar.current!
    })
  }, [])
  
  return (
    // 测试发现不包一层绝对定位会导致出现在视图下方
    <View style={styles.wrapper}>
      <PaperProvider theme={theme}>
        <AlertDialog ref={refs.alert} />
        <ConfirmDialog ref={refs.confirm} />
        <OptionSheetDialog ref={refs.optionSheet} />
        <LoadingDialog ref={refs.loading} />
        <SnackBar ref={refs.snackBar} />
      </PaperProvider>
    </View>
  )
}

export default DialogComponents

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0
  }
})