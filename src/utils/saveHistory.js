import { DeviceEventEmitter } from 'react-native'
import storage from '~/utils/storage'
import axios from 'axios'
import { getMainImage } from '~/api/article'

export default function(title){
  const timestamp = new Date().getTime()
  

  Promise.all([
    storage.get('browsingHistory'),
    getMainImage(title)
  ]).then(async ([history, img]) =>{
    history = history || []
    history.some((item, index) =>{
      if(item.title === title){
        history.splice(index, 1)
        return true
      }
    })

    var result = { title, timestamp, img: null }

    if(img){
      try{
        var {data: blob} = await axios({ url: img.source, responseType: 'blob' })
        blob = new Blob([blob], { type: `image/${img.source.replace(/^.+\.([^\.]+)$/, '$1')}` })    // 上面拿到的blob没有类型，必须手动设置
        
        await new Promise((resolve, reject) =>{
          var reader = new FileReader
          reader.readAsDataURL(blob)
          reader.onload = () =>{
            result.img = {
              uri: reader.result
            }
            resolve()
          }

          reader.error = reject
        })
      }catch(e){ console.log(e) }
    }

    history.unshift(result)
    storage.set('browsingHistory', history).then(() => 
      DeviceEventEmitter.emit('refreshHistory')
    )
  }).catch(e => console.log(e))
}