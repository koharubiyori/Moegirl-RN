import React, { PropsWithChildren, createRef, useRef, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import AlertDialog, { AlertDialogRef } from './Alert'
import ConfirmDialog, { ConfirmDialogRef } from './Confirm'
import OptionSheetDialog, { OptionSheetDialogRef } from './OptionSheet'
import LoadingDialog, { LoadingDialogRef } from './Loading'
import SnackBar, { SnackBarOptions, SnackBarRef } from './SnackBar'

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

function DialogComponents(props: PropsWithChildren<Props>) {
  const refs = {
    alert: useRef<AlertDialogRef>(),
    confirm: useRef<ConfirmDialogRef>(),
    optionSheet: useRef<OptionSheetDialogRef>(),
    loading: useRef<LoadingDialogRef>(),
    snackBar: useRef<SnackBarRef>()
  }

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
    <>
      <AlertDialog ref={refs.alert} />
      <ConfirmDialog ref={refs.confirm} />
      <OptionSheetDialog ref={refs.optionSheet} />
      <LoadingDialog ref={refs.loading} />
      <SnackBar ref={refs.snackBar} />
    </>
  )
}

export default DialogComponents

const styles = StyleSheet.create({
  
})