import Tree from '~/utils/tree'
import { CommentApiData, CommentData } from '~/api/comment.d'
import setActionHandler from '~/utils/redux/setActionHandler'

export const INIT_PAGE_DATA = Symbol()
export const SET = Symbol()
export const INCREMENT_DATA = Symbol()
export const DEL = Symbol()
export const SET_LIKE_STATUS = Symbol()

export interface ActionTypes {
  [INIT_PAGE_DATA]: {
    pageId: number
  }

  [SET]: {
    pageId: number
    data: State['pages'][keyof State['pages']]
  }

  [INCREMENT_DATA]: {
    pageId: number
    posts: CommentData[]
    count: number
    isReply: boolean
  }

  [DEL]: {
    pageId: number
    id: string
    isReply: boolean
  }

  [SET_LIKE_STATUS]: {
    pageId: number
    id: string
    zan: boolean
  }
}

export interface State {
  pages: { 
    [commentId: string]: {
      data: CommentApiData.Get['flowthread']
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
  pages: {}
}, action) => {
  const mixinActiveData = (pageId: number, data: Partial<State['pages'][keyof State['pages']]>) => {
    let activeData = state.pages[action.pageId]
    return {
      ...state,
      pages: {
        ...state.pages,
        [pageId]: {
          ...activeData,
          ...data
        }
      }
    }
  }

  return setActionHandler<ActionTypes, State>(action, {
    [INIT_PAGE_DATA]: action => {
      let activeData = state.pages[action.pageId]

      return {
        ...state,
        activeId: action.pageId,
        pages: {
          ...state.pages, 
          [action.pageId]: activeData || init(action.pageId)
        }
      }
    },

    [SET]: action => mixinActiveData(action.pageId, action.data),

    [INCREMENT_DATA]: action => {
      let activeData = state.pages[action.pageId]
      let currentPostIds = activeData.data.posts.map(item => item.id)
      let posts = action.posts.filter(item => !currentPostIds.includes(item.id))

      if (action.isReply) {
        var newPosts = [...activeData.data.posts, ...posts]
      } else {
        var newPosts = [...posts, ...activeData.data.posts]
      }

      return mixinActiveData(action.pageId, {
        data: {
          ...activeData.data,
          posts: newPosts,
          count: action.count
        },

        tree: new Tree(newPosts)
      })
    },

    [DEL]: action => {
      let activeData = state.pages[action.pageId]
      let newPosts = activeData.data.posts.filter(item => item.id !== action.id)
      let newPopular = activeData.data.popular.filter(item => item.id !== action.id)

      let count = action.isReply ? activeData.data.count : (activeData.data.count - 1)
      return mixinActiveData(action.pageId, {
        data: {
          posts: newPosts,
          popular: newPopular,
          count
        },

        tree: new Tree(newPosts)
      })
    },

    [SET_LIKE_STATUS]: action => {
      let activeData = state.pages[action.pageId]
      let changeTargetComment = (item: CommentData) => {
        if (item.id === action.id) {
          item.myatt = action.zan ? 1 : 0
          item.like += action.zan ? 1 : -1
        }
      }

      activeData.data.posts.forEach(changeTargetComment)
      activeData.data.popular.forEach(changeTargetComment)

      return mixinActiveData(action.pageId, {
        tree: new Tree(activeData.data.posts)
      })
    }  
  }) || state
}

export default reducer