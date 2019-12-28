export default class Tree{
  constructor (data){
    // this.data = data || []     // Tree实例中不再保存原始评论数据，以此尝试是否能提高性能解决评论卡顿
    this.tree = this.toTree(data || [])
  }

  static toFlat (root){
    function flat(children){
      return children.reduce((prev, next) =>{
        const children = next.children || []
        return prev.concat([next], flat(children))
      }, [])
    }

    return flat(root)
  }

  // 获取一个目录下所有目录
  getChildrenById (item, data){
    var through = item =>{
      var result = []
      data.forEach(original =>{
        if(item.id === original.parentid){
          original.children = through(original)
          result.push(original)
        }
      })
      
      return result
    }

    return through(item) 
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
  toTree (data){
    var roots = data.filter(item => !item.parentid)

    roots.forEach(root =>{
      root.children = this.getChildrenById(root, data)
    })

    return roots
  }
}