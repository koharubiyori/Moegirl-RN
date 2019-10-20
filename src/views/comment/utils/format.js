import Tree from '~/utils/tree'

export default {
  date (timestamp){
    var comDate = new Date(timestamp * 1000)
    var nowDate = new Date()
    var diff = nowDate - comDate
    diff = Math.floor(Math.abs(diff) / 1000)
    var date = ''
    if(diff < 60){
      date = diff + '秒前'
    }else if(diff < 60 * 60){
      date = Math.floor(diff / 60) + '分钟前'
    }else if(diff < 60 * 60 * 24){
      date = Math.floor(diff / 60 / 60) + '小时前'
    }else if(diff < 60 * 60 * 24 / 30){
      date = Math.floor(diff / 60 / 60 / 24) + '天前'
      var needFullDate = true
    }else{
      date = `${comDate.getFullYear()}年${comDate.getMonth() + 1}月${comDate.getDate()}日`
      var needFullDate = true
    }

    const bu_ling = number => number < 10 ? '0' + number : number
    var time = `${bu_ling(comDate.getHours())}:${bu_ling(comDate.getMinutes())}`

    if(needFullDate){
      return `${date} ${time}`
    }else{
      return date
    }
  },

  content (text){
    text = text.replace(/(<.+?>|<\/.+?>)/g, '')
    .replace(/&(.+?);/g, (s, s1) => ({
      gt: '>' ,
      lt: '<',
      amp: '&'
    })[s1] || s)
  
    return text.trim()
  },

  children (children, parentId){
    if(children.length === 0){ return [] }

    var result = Tree.toFlat(children)

    return result.map(item =>{
      if(item.parentid !== parentId){
        item.targetName = result.filter(item2 => item2.id === item.parentid)[0].username
      }

      return item
    }).reverse()
  }
}