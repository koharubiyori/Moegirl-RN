import { InteractionManager } from 'react-native'
import { getComments } from '~/api/comment'
import store from '~/redux'
import myConnect from '~/utils/redux/myConnect'
import Tree from '~/utils/tree'
import { DEL, INCREMENT_DATA, SET, SET_ACTIVE_ID, SET_LIKE_STATUS, State } from './index'

const { dispatch, getState } = store

const imr = InteractionManager.runAfterInteractions

export const getActiveData = () => {
  var state = getState().comment
  return state.pages[state.activeId]
}

export const setActiveId = (id: number) => {
  return imr(() => dispatch({ type: SET_ACTIVE_ID, id }))
}

export const load = () => new Promise((resolve, reject) => {
  imr(() => {
    var state = getActiveData()
    if ([2, 4, 5].includes(state.status)) { return resolve() }

    dispatch({ type: SET, data: { status: 2 } })
    getComments(state.pageId, state.tree.tree.length).then(data => {
      if (data.count === 0) {
        dispatch({ type: SET, data: { status: 5 } })
        return resolve()
      }

      var status = 3
      data.posts = state.data.posts.concat(data.posts)
      var tree = new Tree(data.posts)

      if (data.count === tree.tree.length) status = 4

      dispatch({ type: SET, data: { data, status, tree } })

      resolve()
    }).catch(e => {
      console.log(e)
      dispatch({ type: SET, data: { status: 0 } })
      reject()
    })
  })
})

export const incrementLoad = (isReply = false) => {
  let state = getActiveData()
  return imr(() =>
    getComments(state.pageId).then(data => dispatch({ type: INCREMENT_DATA, posts: data.posts, count: data.count, isReply }))
  ) 
}

export const del = (id: string, isReply = false) => imr(() => dispatch({ type: DEL, id, isReply })) 

export const setLikeStatus = (id: string, zan: boolean) => imr(() => dispatch({ type: SET_LIKE_STATUS, id, zan }))

interface ConnectedDispatch {
  $comment: {
    getActiveData: typeof getActiveData
    setActiveId: typeof setActiveId
    load: typeof load
    incrementLoad: typeof incrementLoad
    del: typeof del
    setLikeStatus: typeof setLikeStatus
  }
}

export type CommentConnectedProps = ConnectedDispatch & {
  state: { comment: State }
}

export const commentHOC = myConnect('$comment', { getActiveData, setActiveId, load, incrementLoad, del, setLikeStatus })