import { observable, action, runInAction } from 'mobx'
import CommentTree, { CommentTreeData } from '~/utils/commentTree'
import commentApi from '~/api/comment'
import { CommentData } from '~/api/comment/types'

export type MobxCommentTree = CommentTreeData & { requestOffset: number }

export interface MobxCommentData {
  popular: CommentData[]
  commentTree: MobxCommentTree[]
  offset: number
  count: number
  status: 0 | 1 | 2 | 2.1 | 3 | 4 | 5 // 0：加载失败，1：初始，2：加载中，2.1：refresh加载中，3：加载成功，4：全部加载完成，5：加载过，但没有数据
}

const createInitCommentData: () => MobxCommentData = () => ({
  popular: [],
  commentTree: [],
  offset: 0,
  count: 0,
  status: 1
})

function toMobxCommentTree(commentTree: CommentTreeData[], offset: number): MobxCommentTree[] {
  commentTree.forEach(item => (item as MobxCommentTree).requestOffset = offset)
  return commentTree as any
}

class CommentStore {
  @observable data: { [pageId: number]: MobxCommentData } = {}
 
  findByCommentId(pageId: number, commentId: string, isPopular = false): CommentTreeData | undefined {
    let foundItem = this.data[pageId][isPopular ? 'popular' : 'commentTree'].find(item => item.id === commentId)
    if (foundItem || isPopular) return foundItem
    foundItem = this.data[pageId].commentTree
      .reduce<CommentTreeData[]>((current, next) => current.concat(next.children!), [])
      .find(item => item.id === commentId) as any

    return foundItem as any
  }

  @action.bound
  loadNext(pageId: number) {
    if (this.data[pageId] && [2, 2.1, 4, 5].includes(this.data[pageId].status)) { return }
    
    this.data[pageId] = this.data[pageId] || createInitCommentData()

    let loadingStatus: MobxCommentData['status'] = 2
    if (this.data[pageId].status === 1) loadingStatus = 2.1
    this.data[pageId].status = loadingStatus
    
    commentApi.getComments(pageId, this.data[pageId].offset)
      .then(data => {
        let nextStats: MobxCommentData['status'] = 3
        const commentCount = data.posts.filter(item => item.parentid === '').length
        if (this.data[pageId].offset + commentCount >= data.count) nextStats = 4
        if (this.data[pageId].commentTree.length === 0 && data.posts.length === 0) nextStats = 5
        
        const newCommentTree = toMobxCommentTree(new CommentTree(data.posts).flatten().data, this.data[pageId].offset)

        runInAction(() => {
          this.data[pageId] = {
            popular: data.popular,
            commentTree: this.data[pageId].commentTree.concat(newCommentTree),
            offset: this.data[pageId].offset + commentCount,
            count: data.count,
            status: nextStats
          }
        })
      })
      .catch(e => {
        console.log(e)
        runInAction(() => {
          this.data[pageId].status = 0
        })
      })
  }

  @action.bound
  setLike(pageId: number, commentId: string, like = true) {
    return commentApi.toggleLike(commentId, like)
      .then(() => runInAction(() => {
        const foundItem = this.findByCommentId(pageId, commentId)!
        const foundPopularItem = this.findByCommentId(pageId, commentId, true)

        foundItem.like += like ? 1 : -1
        foundItem.myatt = like ? 1 : 0

        if (foundPopularItem) {
          foundPopularItem.like += like ? 1 : -1
          foundPopularItem.myatt = like ? 1 : 0
        }
      }))
  }

  // 传入commentId表示回复
  @action.bound
  addComment(pageId: number, content: string, commentId?: string) {
    return new Promise((resolve, reject) => {
      commentApi.postComment(pageId, content, commentId)
        .then(async () => {
          resolve()
          // 因为萌百的评论api没返回评论id，这里只好手动去查
          if (!commentId) {
            // 如果发的是评论，获取最近10条评论，并找出新评论。
            // 当然这样是有缺陷的，如果从发评论到服务器响应之间新增评论超过10条，就会导致不准。{{黑幕|不过不用担心，你百是不可能这么火的}}
           const lastCommentList = await commentApi.getComments(pageId)
           const currentCommentIds = this.data[pageId].commentTree.map(item => item.id)
           const newCommentList = lastCommentList.posts
            .filter(item => item.parentid === '' && !currentCommentIds.includes(item.id))
            .map(item => { // 映射为MobxCommentData['commentTree']
              ;(item as MobxCommentTree).children = []
              ;(item as MobxCommentTree).requestOffset = 0
              return item as MobxCommentTree
            })
  
           runInAction(() => {
            this.data[pageId].commentTree.unshift(...newCommentList)
            this.data[pageId].count++
           })

           this.data[pageId].status = this.data[pageId].commentTree.length === 0 ? 5 : 4
          } else {
            // 找出回复的目标数据index
            const parentComment = this.data[pageId].commentTree.find(item => {
              if (item.id === commentId) return true
              if (item.children!.map(childItem => childItem.id).includes(commentId)) return true
              return false
            })!
  
            // 用回复目标的requestOffset请求，再找出回复目标数据，格式化其children，赋给当前渲染的评论数据
            const targetCommentList = await commentApi.getComments(pageId, parentComment.requestOffset)
            const newCommentChildren = new CommentTree(targetCommentList.posts).flatten().data.find(item => item.id === parentComment.id)
            
            runInAction(() => {
              if (newCommentChildren) {
                parentComment.children = toMobxCommentTree(newCommentChildren.children!, parentComment.requestOffset)
              }
            })

            this.data[pageId].status = this.data[pageId].commentTree.length === 0 ? 5 : 4
          }
        })
        .catch(reject)
    })
  }

  @action.bound
  remove(pageId: number, commentId: string, rootCommentId?: string) {
    return commentApi.delComment(commentId)
    .then(() => runInAction(() => {
      const foundItem = this.findByCommentId(pageId, commentId)!

      if (foundItem.parentid === '') {
        const targetIndex = this.data[pageId].commentTree.indexOf(foundItem as MobxCommentTree)
        this.data[pageId].commentTree.splice(targetIndex, 1)
      } else {
        // 如果不是根评论，则要找到其父评论，并收集其所有子评论，删除本身和其子评论
        const foundRootComment = this.findByCommentId(pageId, rootCommentId!)!
        const childrenCommentIdList: string[] = [commentId]

        // 递归查找子评论的子评论
        function collectChildrenCommentId(idList: string[]) {
          const oldListLength = childrenCommentIdList.length
          const resultIdList = foundRootComment.children!
            .filter(item => idList.includes(item.parentid))
            .map(item => item.id)
          childrenCommentIdList.push(...resultIdList)
          oldListLength !== childrenCommentIdList.length && collectChildrenCommentId(resultIdList)
        }
        
        collectChildrenCommentId([commentId])
        foundRootComment.children = foundRootComment.children!.filter(item => !childrenCommentIdList.includes(item.id))
      }

      this.data[pageId].status = this.data[pageId].commentTree.length === 0 ? 5 : 4
    }))
  }

  @action.bound
  refresh(pageId: number) {
    this.data[pageId] = createInitCommentData()
    this.loadNext(pageId)
  }
}

export default CommentStore