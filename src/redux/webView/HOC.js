import { ADD } from './actionTypes'
import { connect } from 'react-redux'
import store from '~/redux'
import { getArticle } from '~/api/article'

const { dispatch } = store

export const getContent = (link, forceLoad = false) => dispatch((dispatch, getState) =>
  new Promise((resolve, reject) =>{
    const {webView} = getState()

    var cache = webView.pagesCache[link]
    if(cache && !forceLoad){ return resolve(cache) }

    getArticle(link)
      .then(data =>{
        if(data.error) return reject(data.error)
        dispatch({ type: ADD, name: link, data })
        resolve(data)
      })
      .catch(reject)
  })
)

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ 
      webView: { getContent } 
    })
  )(Element)
}