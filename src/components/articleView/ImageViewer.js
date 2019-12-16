import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, ActivityIndicator,
  StyleSheet
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import StatusBar from '~/components/StatusBar'

MyImageViewer.propTypes = {
  imgs: PropTypes.array,
  visible: PropTypes.bool,
  onClose: PropTypes.func
}

function MyImageViewer(props){

  return (
    <Modal visible={props.visible} onRequestClose={props.onClose} animationType="fade">
      <StatusBar hidden />
      <ImageViewer 
        imageUrls={props.imgs} 
        index={props.index} 
        saveToLocalByLongPress={false} 
        loadingRender={() => <ActivityIndicator color="white" size={60} />}
      />
    </Modal>
  )
}

export default MyImageViewer