import React, { PropsWithChildren } from 'react'
import { ActivityIndicator } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import StatusBar from '~/components/StatusBar'

export interface Props {

}

export interface RouteParams {
  imgs: { url: string }[]
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function MyImageViewer(props: PropsWithChildren<FinalProps>) {
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