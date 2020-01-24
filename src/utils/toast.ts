import Toast from 'react-native-tiny-toast'

export default {
  show (text: string, position: 'top' | 'center' | 'bottom' = 'bottom') {
    Toast.show(text, {
      position: {
        top: 50,
        center: 0,
        bottom: -50
      }[position],
      
      containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    })
  },

  hide () {
    Toast.hide()
    global.$isVisibleLoading = false
  },

  showLoading (text?: string) {
    Toast.showLoading(text)
    global.$isVisibleLoading = true
  },

  showSuccess (text: string) {
    Toast.showSuccess(text)
  }
}