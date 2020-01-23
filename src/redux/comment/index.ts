import Tree from '~/utils/tree'
import { ApiData, CommentData } from '~/api/comment.d'
import setActionHandler from '~/utils/redux/setActionHandler'

export const SET_ACTIVE_ID = Symbol()
export const SET = Symbol()
export const INCREMENT_DATA = Symbol()
export const DEL = Symbol()
export const SET_LIKE_STATUS = Symbol()

export interface ActionTypes {
  [SET_ACTIVE_ID]: {
    id: number
  }

  [SET]: {
    data: State['pages'][keyof State['pages']]
  }

  [INCREMENT_DATA]: {
    posts: CommentData[]
    count: number
    isReply: boolean
  }

  [DEL]: {
    id: string
    isReply: boolean
  }

  [SET_LIKE_STATUS]: {
    id: string
    zan: boolean
  }
}

export interface State {
  activeId: number
  pages: { 
    [commentId: string]: {
      data: ApiData.Get['flowthread']
      tree: InstanceType<typeof Tree>
      pageId: number
      status: number
      activeId: string
    }
  }
}

const init = (pageId = 0) => ({
  data: {
    popular: [],
    posts: [],
    count: 0
  },

  tree: new Tree(),
  pageId,
  status: 1,
  activeId: '' // 当前正在显示的评论id(处于评论的回复界面)
})

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = {
  pages: {},
  activeId: 0 // 当前正在显示的页面id(处于评论界面)
}, action) => {
  let activeData = state.pages[state.activeId]

  const mixinActiveData = (data: Partial<State['pages'][keyof State['pages']]>) => ({
    ...state,
    pages: {
      ...state.pages,
      [state.activeId]: {
        ...activeData,
        ...data
      }
    }
  })

  return setActionHandler<ActionTypes, State>(action, {
    [SET_ACTIVE_ID]: action => {
      return {
        ...state,
        activeId: action.id,
        pages: {
          ...state.pages, 
          [action.id]: state.pages[action.id] || init(action.id)
        }
      }
    },

    [SET]: action => mixinActiveData(action.data),

    [INCREMENT_DATA]: action => {
      let currentPostIds = activeData.data.posts.map(item => item.id)
      let posts = action.posts.filter(item => !currentPostIds.includes(item.id))

      if (action.isReply) {
        var newPosts = [...activeData.data.posts, ...posts]
      } else {
        var newPosts = [...posts, ...activeData.data.posts]
      }

      return mixinActiveData({
        data: {
          ...activeData.data,
          posts: newPosts,
          count: action.count
        },

        tree: new Tree(newPosts)
      })
    },

    [DEL]: action => {
      let newPosts = activeData.data.posts.filter(item => item.id !== action.id)
      let newPopular = activeData.data.popular.filter(item => item.id !== action.id)

      let count = action.isReply ? activeData.data.count : (activeData.data.count - 1)
      return mixinActiveData({
        data: {
          posts: newPosts,
          popular: newPopular,
          count
        },

        tree: new Tree(newPosts)
      })
    },

    [SET_LIKE_STATUS]: action => {
      let changeTargetComment = (item: CommentData) => {
        if (item.id === action.id) {
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
  }) || state
}

export default reducer