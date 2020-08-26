import createI18n from './createI18n'

export function diffDate(dateObj: Date) {
  const i = createI18n({
    'zh-hans': {
      second: '秒前',
      minute: '分钟前',
      hour: '小时前',
      day: '天前'
    },
    'zh-hant': {
      second: '秒前',
      minute: '分鐘前',
      hour: '小時前',
      day: '天前'
    }
  })
  
  let comDate = dateObj
  let nowDate = new Date()
  let diff = nowDate.getTime() - comDate.getTime()
  diff = Math.floor(Math.abs(diff) / 1000)
  let date = ''

  let needFullDate = false
  if (diff < 60) {
    date = diff + i.second
  } else if (diff < 60 * 60) {
    date = Math.floor(diff / 60) + i.minute
  } else if (diff < 60 * 60 * 24) {
    date = Math.floor(diff / 60 / 60) + i.hour
  } else if (diff < 60 * 60 * 24 / 30) {
    date = Math.floor(diff / 60 / 60 / 24) + i.day
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
}