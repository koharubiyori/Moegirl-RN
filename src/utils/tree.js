export default class Tree{
  constructor (data){
    this.data = data || []
    this.tree = this.toTree()
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