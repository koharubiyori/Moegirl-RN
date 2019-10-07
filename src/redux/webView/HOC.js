import { ADD } from './actionTypes'
import { connect } from 'react-redux'
import { getArticle } from '~/api/article'

function mapDispatchToProps(dispatch){
  const getContent = (link, forceLoad = false) => dispatch((dispatch, getState) =>
    new Promise((resolve, reject) =>{
      const {webView} = getState()

      var cache = webView.pagesCache[link]
      if(cache && !forceLoad){ return resolve(cache) }

      getArticle(link).then(data =>{
        dispatch({ type: ADD, name: link, data })
        resolve(data)
      }).catch(reject)
    })
  )

  return { getContent }
}

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ webView: mapDispatchToProps(dispatch) })
  )(Element)
}