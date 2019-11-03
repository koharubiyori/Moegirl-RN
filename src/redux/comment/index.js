import { SET_ACTIVE_ID, SET, INCREMENT_DATA, DEL, SET_LIKE_STATUS } from './actionTypes'
import Tree from '~/utils/tree'

const init = (pageId = '') =>({
  data: {
    popular: [],
    posts: [],
    count: 0
  },

  tree: new Tree,
  pageId,
  status: 1,
  activeId: ''        // 当前正在显示的评论id(处于评论的回复界面)
})

export default function reducer(state = {
  pages: {},
  activeId: ''     // 当前正在显示的页面id(处于评论界面)
}, action){
  var activeData = state.pages[state.activeId]

  const mixinActiveData = data => ({
    ...state,
    pages: {
      ...state.pages,
      [state.activeId]: {
        ...activeData,
        ...data
      }
    }
  })

  switch(action.type){
    // id
    case SET_ACTIVE_ID: {       
      return {
        ...state,
        activeId: action.id,
        pages: {
          ...state.pages,
          [action.id]: state.pages[action.id] || init(action.id)
        }
      }
    }

    // data
    case SET: {    
      return mixinActiveData(action.data)
    }
    
    // posts, count
    case INCREMENT_DATA: {
      var currentPostIds = activeData.data.posts.map(item => item.id)
      var posts = action.posts.filter(item => !currentPostIds.includes(item.id))

      if(action.isReply){
        var newPosts = [ ...activeData.data.posts, ...posts ]
      }else{
        var newPosts = [ ...posts, ...activeData.data.posts, ]
      }

      return mixinActiveData({
        data: {
          ...activeData.data,
          posts: newPosts,
          count: action.count
        },

        tree: new Tree(newPosts)
      })
    }

    // id, isReply(删除回复时不减count)
    case DEL: {
      var newPosts = activeData.data.posts.filter(item => item.id !== action.id)
      var newPopular = activeData.data.popular.filter(item => item.id !== action.id)

      var count = action.isReply ? activeData.data.count : (activeData.data.count - 1)
      return mixinActiveData({
        data: {
          posts: newPosts,
          popular: newPopular,
          count
        },

        tree: new Tree(newPosts)
      })
    }

    // id
    case SET_LIKE_STATUS: {
      var changeTargetComment = item =>{
        if(item.id === action.id){
          item.myatt = action.zan ? 1 : 0
          item.like += action.zan ? 1 : -1
        }
      }

      activeData.data.posts.forEach(changeTargetComment)
      activeData.data.popular.forEach(changeTargetComment)

      return mixinActiveData({
        tree: new Tree(activeData.data.posts)
      })
    }

    default: {
      return state
    }
  }
}