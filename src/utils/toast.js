import Toast from 'react-native-tiny-toast'

export default {
  show (text, position = 'bottom'){
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

  hide (){
    Toast.hide()
  },

  showLoading (text){
    Toast.showLoading(text)
  },

  showSuccess (text){
    Toast.showSuccess(text)
  }
}