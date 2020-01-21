export interface OriginalTreeData {
  id: string
  parentid: string
  [key: string]: any
}

export interface TreeData extends OriginalTreeData {
  children: TreeData[]
}

export default class Tree {
  tree: TreeData[]
  
  constructor (data: OriginalTreeData[]) {
    // this.data = data || []     // Tree实例中不再保存原始评论数据，以此尝试是否能提高性能解决评论卡顿
    this.tree = this.toTree(data || [])
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
  getChildrenById (root: OriginalTreeData, data: OriginalTreeData[]) {
    let through = (root: OriginalTreeData) => {
      let result: TreeData[] = []
      data.forEach(original => {
        if (root.id === original.parentid) {
          (original as TreeData).children = through(original)
          result.push(original as TreeData)
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
  //     this.data.some(original =>{
  //       if(original.id === item.parentid){
  //         parents.unshift(original)
  //         result = through(original)
  //         return true
  //       }
  //     })
      
  //     return result
  //   }

  //   through(item)
  //   return parents
  // }

  // 树化
  toTree (data: OriginalTreeData[]) {
    let roots = data.filter(item => !item.parentid) as any as TreeData[]
    roots.forEach(root => {
      root.children = this.getChildrenById(root, data)
    })

    return roots
  }
}