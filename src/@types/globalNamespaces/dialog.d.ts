import { AlertRef } from '~/components/dialog/Alert'
import { ConfirmRef } from '~/components/dialog/Confirm'
import { SnackBarRef } from '~/components/dialog/SnackBar'

export = Dialog

export as namespace __Dialog

declare namespace Dialog {
  interface __ {
    alert: AlertRef
    confirm: ConfirmRef
    snackBar: SnackBarRef
  }
}