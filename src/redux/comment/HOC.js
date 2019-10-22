import { connect } from 'react-redux'
import { SET, INIT, INCREMENT_DATA, DEL, SET_LIKE_STATUS } from './actionTypes'
import { getComments } from '~/api/comment'
import Tree from '~/utils/tree'

function mapDispatchToProps(dispatch){
  const load = id => dispatch((dispatch, getState) =>
    new Promise((resolve, reject) =>{
      var state = getState().comment
      if([2, 4, 5].includes(state.status)){ return resolve() }

      id !== state.pageId && dispatch({ type: INIT, pageId: id })

      dispatch({ type: SET, data: { status: 2 } })
      getComments(id, state.tree.tree.length).then(data =>{
        if(data.count === 0){
          dispatch({ type: SET, data: { status: 5 } })
          return resolve()
        }

        var status = 3
        var tree = new Tree(data.posts)

        if(data.count <= state.tree.tree.length + tree.tree.length){
          status = 4
        }

        data.posts = state.data.posts.concat(data.posts)
        dispatch({ type: SET, data: { data, status, tree: new Tree(data.posts) } })

        resolve()
      }).catch(e =>{
        console.log(e)
        dispatch({ type: SET, data: { status: 0 } })
        reject()
      })
    })
  )

  const incrementLoad = () => dispatch((dispatch, getState) =>{
    var state = getState().comment
    return getComments(state.pageId).then(data => dispatch({ type: INCREMENT_DATA, posts: data.posts }))
  })

  const del = id => dispatch({ type: DEL, id })

  const setLikeStatus = (id, zan) => dispatch({ type: SET_LIKE_STATUS, id, zan })

  return { load, incrementLoad, del, setLikeStatus }
}

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ comment: mapDispatchToProps(dispatch) })
  )(Element)
}
