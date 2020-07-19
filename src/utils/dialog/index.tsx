import React from 'react'
import DialogComponents from './components'
import { AlertDialogRef } from './components/Alert'
import { ConfirmDialogRef } from './components/Confirm'
import { LoadingDialogRef } from './components/Loading'
import { OptionSheetDialogRef } from './components/OptionSheet'
import { SnackBarRef } from './components/SnackBar'

export interface Dialog {
  alert: AlertDialogRef
  confirm: ConfirmDialogRef
  optionSheet: OptionSheetDialogRef
  loading: LoadingDialogRef
  snackBar: SnackBarRef
}

let dialogRefs: Dialog = null as any
export const DialogBaseView = () => <DialogComponents onBindRefs={refs => dialogRefs = refs} />

const dialog: Dialog = {
  alert: {
    show: (...args) => dialogRefs.alert.show(...args),
    hide: (...args) => dialogRefs.alert.hide(...args)
  },

  confirm: {
    show: (...args) => dialogRefs.confirm.show(...args),
    hide: (...args) => dialogRefs.confirm.hide(...args)
  },
  
  optionSheet: {
    show: (...args) => dialogRefs.optionSheet.show(...args),
    hide: (...args) => dialogRefs.optionSheet.hide(...args)
  },

  loading: {
    show: (...args) => dialogRefs.loading.show(...args),
    hide: (...args) => dialogRefs.loading.hide(...args)
  },

  snackBar: {
    show: (...args) => dialogRefs.snackBar.show(...args),
    hide: (...args) => dialogRefs.snackBar.hide(...args)
  },
}

export default dialog