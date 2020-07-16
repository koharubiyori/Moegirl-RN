import { CommentData } from '~/api/comment/types'

export interface CommentTreeData extends CommentData {
  children?: CommentTreeData[]
}

export interface CommentTreeDataWithTarget extends CommentTreeData {
  target?: CommentTreeData // 这个字段实际是parentid指向的评论数据 
}

export default class CommentTree {
  data: CommentTreeData[]
  
  constructor(data: CommentData[] = []) {
    this.data = this.toCommentTree(data)
  }

  // 获取一条评论下下所有目录
  getChildrenById(root: CommentData, data: CommentData[]) {
    let through = (root: CommentData) => {
      let result: CommentTreeData[] = []
      data.forEach(raw => {
        if (root.id === raw.parentid) {
          (raw as CommentTreeData).children = through(raw)
          result.push(raw as CommentTreeData)
        }
      })
      
      return result
    }

    return through(root) 
  }

  // 树化
  toCommentTree(data: CommentData[]) {
    let roots = data.filter(item => !item.parentid) as any as CommentTreeData[]
    roots.forEach(root => {
      root.children = this.getChildrenById(root, data)
    })

    return roots
  }

  static flattenItem(children: CommentTreeData[]): CommentTreeData[] {
    return children.reduce<CommentTreeData[]>((prev, next) => {
      const children = next.children || []
      return prev.concat([next], CommentTree.flattenItem(children))
    }, [])
  }

  // 从第二层开始扁平化
  flatten() {
    this.data.forEach(item => item.children = CommentTree.flattenItem(item.children!))
    return this
  }

  // withRootCommentId() {
  //   this.data.forEach(item => {
  //     item.children!.forEach(replyItem => item.)
  //   })
  // }

  // 为回复带上回复对象(target)的数据
  static withTargetData(children: CommentTreeData[], selfId: string): CommentTreeDataWithTarget[] {
    return children.map(item => {
      if (item.parentid !== selfId) { // 如果parentId等于selfId说明是回复当前评论的
        // 使用defineProperty，避免触发mobx的proxy
        Object.defineProperty(item, 'target', {
          value: children.find(item2 => item2.id === item.parentid)
        })
      }

      return item
    }) as any
  }
}