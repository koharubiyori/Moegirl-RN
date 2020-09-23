import React, { PropsWithChildren, useRef } from 'react'
import { ActivityIndicator, Linking, PermissionsAndroid, StyleSheet, ToastAndroid, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageViewer from 'react-native-image-zoom-viewer'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import RNFetchBlob from 'rn-fetch-blob'
import MyStatusBar from '~/components/MyStatusBar'
import useLockDrawer from '~/hooks/useLockDrawer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import dialog from '~/utils/dialog'
import i from './lang'

export interface Props {

}

export interface RouteParams {
  imgs: { url: string }[]
  index: number
}

function ImageViewerPage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const imgs = route.params.imgs
  const index = route.params.index

  const refs = {
    currentIndex: useRef(index)
  }

  useLockDrawer()

  async function saveImg() {
    const checkedResult = await checkPermission()
    if (checkedResult === undefined) {
      ToastAndroid.show(i.index.saveImg.unknownErr, ToastAndroid.SHORT)
      return 
    }

    if (checkedResult === false) {
      await dialog.confirm.show({
        content: i.index.saveImg.noPermissionMsg,
      })

      Linking.openSettings()
      return
    }
    
    const url = imgs[refs.currentIndex.current].url
    const fileName = decodeURIComponent(url.match(/\/([^\/]+)$/)![1])
    const dirPath = '/moegirlViewer图片保存/'
    const savePath = RNFetchBlob.fs.dirs.SDCardDir + dirPath + fileName
    ToastAndroid.show(i.index.saveImg.downloadStart, ToastAndroid.SHORT)
    RNFetchBlob
      .config({ 
        path: savePath,
        timeout: 6000,
        addAndroidDownloads: {
          notification: true,
          title: fileName,
          description: i.index.saveImg.downloading,
          mime: 'image/' + fileName.split('.')[1]
        }
      })
      .fetch('get', url)
      .then(res => ToastAndroid.show(i.index.saveImg.saved + dirPath + fileName, ToastAndroid.LONG))
      .catch(e => {
        console.log(e)
        ToastAndroid.show(i.index.saveImg.netErr, ToastAndroid.SHORT)
      })
  }

  async function checkPermission() {
    try {
      const writeStoragePermission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      const checkedResult = await PermissionsAndroid.check(writeStoragePermission)
      if (checkedResult) { return true }

      const granted = await PermissionsAndroid.request(writeStoragePermission, i.index.checkPermission)

      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar hidden />
      <ImageViewer 
        style={{ backgroundColor: 'black' }}
        imageUrls={imgs} 
        index={index}
        saveToLocalByLongPress={false} 
        onChange={index => refs.currentIndex.current = index!}
        footerContainerStyle={styles.footerContainerStyle}
        
        loadingRender={() => <ActivityIndicator color="white" size={60} />}

        renderFooter={() => 
          <TouchableOpacity onPress={saveImg}>
            <MaterialIcon 
              name="file-download" 
              color="#eee" 
              size={35} 
              style={{ opacity: 0.5 }} 
            />
          </TouchableOpacity>  
        }
      />
    </View>
  )
}

export default ImageViewerPage

const styles = StyleSheet.create({
  footerContainerStyle: {
    // imageViewer自带样式 
    // bottom: 0, 
    // position: 'absolute', 
    // zIndex: 9999
    
    justifyContent: 'flex-end', 
    flexDirection: 'row', 
    width: 40,
    height: 40,
    right: 20,
    bottom: 20,
  }
})