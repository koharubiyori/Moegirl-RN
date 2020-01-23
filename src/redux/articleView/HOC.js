import { ADD } from './actionTypes'
import { connect } from 'react-redux'
import store from '~/redux'
import { getArticle } from '~/api/article'

const { dispatch, getState } = store

export const getContent = (link, forceLoad = false) => new Promise((resolve, reject) =>{
  const {articleView} = getState()

  var cache = articleView.pagesCache[link]
  if(cache && !forceLoad){ return resolve(cache) }

  getArticle(link)
    .then(data =>{
      if(data.error) return reject(data.error)
      dispatch({ type: ADD, name: link, data })
      resolve(data)
    })
    .catch(reject)
})

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ 
      articleView: { getContent } 
    })
  )(Element)
}