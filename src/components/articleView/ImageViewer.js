import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, ActivityIndicator,
  StyleSheet
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import StatusBar from '~/components/StatusBar'

function MyImageViewer(props){
  const imgs = props.navigation.getParam('imgs')

  return (
    <>
      <StatusBar hidden />
      <ImageViewer 
        imageUrls={imgs} 
        saveToLocalByLongPress={false} 
        loadingRender={() => <ActivityIndicator color="white" size={60} />}
      />
    </>
  )
}

export default MyImageViewer