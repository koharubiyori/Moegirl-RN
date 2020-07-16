import Toast from 'react-native-tiny-toast'

const toast = (text: string, position: 'top' | 'center' | 'bottom' = 'bottom') => {
  Toast.show(text, {
    position: {
      top: 50,
      center: 0,
      bottom: -50
    }[position],
    
    containerStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: 20,
    },
  })
}

toast.hide = (toast: any) => {
  Toast.hide(toast)
}

toast.success = (text: string) => {
  Toast.showSuccess(text, {
    imgSource: require('~/assets/images/check.png'),
  })
}

export default toast