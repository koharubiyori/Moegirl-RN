import storage from '~/utils/storage'
import axios from 'axios'
import { getMainImage } from '~/api/article'

export default function(title){
  Promise.all([
    storage.get('browsingHistory'),
    getMainImage(title)
  ]).then(([history, img]) =>{
    history = history || []
    history.some((item, index) =>{
      if(item.title === title){
        history.splice(index, 1)
        return true
      }
    })

    axios({ url: img.source, responseType: 'blob'}).then(({data: blob}) =>{
      var reader = new FileReader
      reader.readAsDataURL(blob)
      reader.onload = () =>{
        img.source = reader.result
        history.unshift({ title, img })
        storage.set('browsingHistory', history)
      }
    })
  }).catch(e => console.log(e))
}