import React from 'react'
import createPromiser from '../createPromiser'
import DialogComponents, { DialogRefs } from './components'
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

const dialogRefsPromiser = createPromiser<DialogRefs>()
export const DialogBaseView = () => <DialogComponents onBindRefs={dialogRefsPromiser.resolve} />

const dialog: Dialog = {
  alert: {
    show: (...args) => dialogRefsPromiser.promise.then(refs => refs.alert.show(...args)),
    hide: (...args) => dialogRefsPromiser.promise.then(refs => refs.alert.hide(...args))
  },

  confirm: {
    show: (...args) => dialogRefsPromiser.promise.then(refs => refs.confirm.show(...args)),
    hide: (...args) => dialogRefsPromiser.promise.then(refs => refs.confirm.hide(...args))
  },
  
  optionSheet: {
    show: (...args) => dialogRefsPromiser.promise.then(refs => refs.optionSheet.show(...args)),
    hide: (...args) => dialogRefsPromiser.promise.then(refs => refs.optionSheet.hide(...args))
  },

  loading: {
    show: (...args) => dialogRefsPromiser.promise.then(refs => refs.loading.show(...args)),
    hide: (...args) => dialogRefsPromiser.promise.then(refs => refs.loading.hide(...args))
  },

  snackBar: {
    show: (...args) => dialogRefsPromiser.promise.then(refs => refs.snackBar.show(...args)),
    hide: (...args) => dialogRefsPromiser.promise.then(refs => refs.snackBar.hide(...args))
  },
}

export default dialog