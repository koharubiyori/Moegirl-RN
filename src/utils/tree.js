export default class Tree{
  constructor (data){
    this.data = data || []
    this.tree = this.toTree()
  }

  static toFlat (root){
    function flat(children){
      return children.reduce((prev, next) =>{
        const children = (next.children || []).concat([])
        delete next.children
        return prev.concat([next], flat(children))
      }, [])
    }

    return flat(root)
  }

  // 获取一个目录下所有目录
  getChildrenById (item){
    var through = item =>{
      var result = []
      this.data.forEach(original =>{
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
  getParents (item){
    var parents = [item]
    var through = item =>{
      var result = {}
      if(item.parentid === 0){ return null }
      this.data.some(original =>{
        if(original.id === item.parentid){
          parents.unshift(original)
          result = through(original)
          return true
        }
      })
      
      return result
    }

    through(item)
    return parents
  }

  // 树化
  toTree (){
    var roots = this.data.filter(catalog =>{
      return !this.data.some(original => catalog.parentid == original.id)
    })

    roots.forEach(root =>{
      root.children = this.getChildrenById(root)
    })

    return roots
  }
}