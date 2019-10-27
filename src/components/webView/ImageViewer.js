import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, ActivityIndicator,
  StyleSheet
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

export default class MyImageViewer extends React.Component{
  static propTypes = {
    imgs: PropTypes.array,
    visible: PropTypes.bool,
    onClose: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {
      index: 0
    }
  }

  render (){
    return (
      <Modal visible={this.props.visible} onRequestClose={this.props.onClose} animationType="fade">
        <ImageViewer 
          imageUrls={this.props.imgs} 
          index={this.props.index} 
          saveToLocalByLongPress={false} 
          loadingRender={() => <ActivityIndicator color="white" size={60} />}
        />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  
})