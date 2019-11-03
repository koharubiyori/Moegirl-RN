import { connect } from 'react-redux'
import { SET_ACTIVE_ID, SET, INCREMENT_DATA, DEL, SET_LIKE_STATUS } from './actionTypes'
import { InteractionManager } from 'react-native'
import store from '~/redux'
import { getComments } from '~/api/comment'
import Tree from '~/utils/tree'

const { dispatch, getState } = store

const imr = InteractionManager.runAfterInteractions

export const getActiveData = () =>{
  var state = getState().comment
  return state.pages[state.activeId]
}

export const setActiveId = id =>{
  imr(() => dispatch({ type: SET_ACTIVE_ID, id }))
}

export const load = () => dispatch((dispatch, getState) =>
  new Promise((resolve, reject) =>{
    imr(() =>{
      var state = getActiveData()
      if([2, 4, 5].includes(state.status)){ return resolve() }
  
      dispatch({ type: SET, data: { status: 2 } })
      getComments(state.pageId, state.tree.tree.length).then(data =>{
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
  })
)

export const incrementLoad = (isReply = false) => dispatch((dispatch, getState) =>{
  var state = getActiveData()
  imr(() =>
    getComments(state.pageId).then(data => dispatch({ type: INCREMENT_DATA, posts: data.posts, count: data.count, isReply }))
  ) 
})

export const del = (id, isReply = false) => imr(() => dispatch({ type: DEL, id, isReply })) 

export const setLikeStatus = (id, zan) => imr(() => dispatch({ type: SET_LIKE_STATUS, id, zan }))


export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ 
      comment: { getActiveData, setActiveId, load, incrementLoad, del, setLikeStatus }
    })
  )(Element)
}
