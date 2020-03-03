import React, { PropsWithChildren } from 'react'
import { ActivityIndicator } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import StatusBar from '~/components/StatusBar'

export interface Props {

}

export interface RouteParams {
  imgs: { url: string }[]
  index: number
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function MyImageViewer(props: PropsWithChildren<FinalProps>) {
  const imgs = props.navigation.getParam('imgs')
  const index = props.navigation.getParam('index')

  return (
    <>
      <StatusBar hidden />
      <ImageViewer 
        style={{ backgroundColor: 'black' }}
        imageUrls={imgs} 
        index={index}
        saveToLocalByLongPress={false} 
        loadingRender={() => <ActivityIndicator color="white" size={60} />}
      />
    </>
  )
}

export default MyImageViewer