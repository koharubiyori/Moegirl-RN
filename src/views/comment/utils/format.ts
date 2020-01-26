import Tree, { TreeData } from '~/utils/tree'

export default {
  date (timestamp: number) {
    let comDate = new Date(timestamp * 1000)
    let nowDate = new Date()
    let diff = nowDate.getTime() - comDate.getTime()
    diff = Math.floor(Math.abs(diff) / 1000)
    let date = ''

    let needFullDate = false
    if (diff < 60) {
      date = diff + '秒前'
    } else if (diff < 60 * 60) {
      date = Math.floor(diff / 60) + '分钟前'
    } else if (diff < 60 * 60 * 24) {
      date = Math.floor(diff / 60 / 60) + '小时前'
    } else if (diff < 60 * 60 * 24 / 30) {
      date = Math.floor(diff / 60 / 60 / 24) + '天前'
      needFullDate = true
    } else {
      date = `${comDate.getFullYear() === nowDate.getFullYear() ? '' : comDate.getFullYear() + '年'}${comDate.getMonth() + 1}月${comDate.getDate()}日`
      needFullDate = true
    }

    const bu_ling = (number: number) => number < 10 ? '0' + number : number.toString()
    let time = `${bu_ling(comDate.getHours())}:${bu_ling(comDate.getMinutes())}`

    if (needFullDate) {
      return `${date} ${time}`
    } else {
      return date
    }
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