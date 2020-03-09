import Tree, { TreeData } from '~/utils/tree'
import toViewDate from '~/utils/toViewDate'

export default {
  date (timestamp: number) {
    let date = new Date(timestamp * 1000)
    return toViewDate(date)
  },

  content (text: string) {
    text = text.replace(/(<.+?>|<\/.+?>)/g, '')
      .replace(/&(.+?);/g, (s, s1: string) => (({
        gt: '>',
        lt: '<',
        amp: '&'
      } as any))[s1] || s)
  
    return text.trim()
  },

  children (children: TreeData[], parentId: string) {
    if (children.length === 0) { return [] }

    let result = Tree.toFlat(children)

    return result.map(item => {
      if (item.parentid !== parentId) {
        item.targetName = result.filter(item2 => item2.id === item.parentid)[0].username
      }

      return item
    }).reverse()
  }
}