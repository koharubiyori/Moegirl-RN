import { InteractionManager } from 'react-native'
import { getComments } from '~/api/comment'
import store from '~/redux'
import myConnect from '~/utils/redux/myConnect'
import Tree from '~/utils/tree'
import { DEL, INCREMENT_DATA, SET, INIT_PAGE_DATA, SET_LIKE_STATUS, State } from './index'

const { dispatch, getState } = store

const imr = InteractionManager.runAfterInteractions

export const initPageData = (pageId: number) => store.dispatch({ type: INIT_PAGE_DATA, pageId })

export const getCommentDataByPageId = (pageId: number) => {
  let state = getState().comment
  return state.pages[pageId]
}

export const load = (pageId: number) => new Promise((resolve, reject) => {
  imr(() => {
    if (pageId === 0) return resolve()
    let state = getCommentDataByPageId(pageId)
    if ([2, 4, 5].includes(state.status)) { return resolve() }

    dispatch({ type: SET, pageId, data: { status: 2 } })
    getComments(state.pageId, state.tree.tree.length).then(data => {
      if (data.count === 0) {
        dispatch({ type: SET, pageId, data: { status: 5 } })
        return resolve()
      }

      let status = 3
      data.posts = state.data.posts.concat(data.posts)
      let tree = new Tree(data.posts)

      if (data.count === tree.tree.length) status = 4

      dispatch({ type: SET, pageId, data: { data, status, tree } })

      resolve()
    }).catch(e => {
      console.log(e)
      dispatch({ type: SET, pageId, data: { status: 0 } })
      reject()
    })
  })
})

export const incrementLoad = (pageId: number, isReply = false) => {
  let state = getCommentDataByPageId(pageId)
  return imr(() =>
    getComments(state.pageId).then(data => dispatch({ type: INCREMENT_DATA, pageId, posts: data.posts, count: data.count, isReply }))
  ) 
}

export const del = (pageId: number, id: string, isReply = false) => imr(() => dispatch({ type: DEL, pageId, id, isReply })) 

export const setLikeStatus = (pageId: number, id: string, zan: boolean) => imr(() => dispatch({ type: SET_LIKE_STATUS, pageId, id, zan }))

interface ConnectedDispatch {
  $comment: {
    getCommentDataByPageId: typeof getCommentDataByPageId
    initPageData: typeof initPageData
    load: typeof load
    incrementLoad: typeof incrementLoad
    del: typeof del
    setLikeStatus: typeof setLikeStatus
  }
}

export type CommentConnectedProps = ConnectedDispatch & {
  state: { comment: State }
}

export const commentHOC = myConnect('$comment', { getCommentDataByPageId, initPageData, load, incrementLoad, del, setLikeStatus })