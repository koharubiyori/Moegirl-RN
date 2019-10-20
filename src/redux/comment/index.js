import { SET, INCREMENT_DATA, DEL, SET_LIKE_STATUS } from './actionTypes'
import Tree from '~/utils/tree'

const init = (pageId = '') =>({
  data: null,
  tree: null,
  pageId,
  title: '',
  activeId: '',
  status: 1
})

export default function reducer(state = init(), action){
  switch(action.type){
    // data
    case SET: {
      return { ...state, ...action.data }
    }

    // id, posts, count
    case INCREMENT_DATA: {
      var currentPostIds = state.data.posts.map(item => item.id)
      var posts = action.posts.filter(item => !currentPostIds.includes(item.id))

      var newPosts = [ ...posts, ...state.data.posts ]

      return {
        ...state,
        data: {
          ...state.data,
          posts: newPosts,
          count: action.count
        },

        tree: new Tree(newPosts)
      }
    }

    // id
    case DEL: {
      var newPosts = state.data.posts.filter(item => item.id !== action.id)

      return {
        ...state,
        data: {
          ...state.data,
          posts: newPosts,
          count: state.data.count - 1
        },

        tree: new Tree(newPosts)
      }
    }

    case SET_LIKE_STATUS: {
      
    }

    default: {
      return state
    }
  }
}