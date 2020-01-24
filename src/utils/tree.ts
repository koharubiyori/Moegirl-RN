export interface RawTreeData {
  id: string
  parentid: string
  [key: string]: any
}

export interface TreeData extends RawTreeData {
  children: TreeData[]
}

export default class Tree {
  tree: TreeData[]
  
  constructor (data: RawTreeData[] = []) {
    // this.data = data || []     // Tree实例中不再保存原始评论数据，以此尝试是否能提高性能解决评论卡顿
    this.tree = this.toTree(data)
  }

  static toFlat (children: TreeData[]) {
    function flat(children: TreeData[]): TreeData[] {
      return children.reduce<TreeData[]>((prev, next) => {
        const children = next.children || []
        return prev.concat([next], flat(children))
      }, [])
    }

    return flat(children)
  }

  // 获取一个目录下所有目录
  getChildrenById (root: RawTreeData, data: RawTreeData[]) {
    let through = (root: RawTreeData) => {
      let result: TreeData[] = []
      data.forEach(raw => {
        if (root.id === raw.parentid) {
          (raw as TreeData).children = through(raw)
          result.push(raw as TreeData)
        }
      })
      
      return result
    }

    return through(root) 
  }

  // 获取一个目录的所有父级目录（包括自己）
  // getParents (item){
  //   var parents = [item]
  //   var through = item =>{
  //     var result = {}
  //     if(item.parentid === 0){ return null }
  //     this.data.some(raw =>{
  //       if(raw.id === item.parentid){
  //         parents.unshift(raw)
  //         result = through(raw)
  //         return true
  //       }
  //     })
      
  //     return result
  //   }

  //   through(item)
  //   return parents
  // }

  // 树化
  toTree (data: RawTreeData[]) {
    let roots = data.filter(item => !item.parentid) as any as TreeData[]
    roots.forEach(root => {
      root.children = this.getChildrenById(root, data)
    })

    return roots
  }
}