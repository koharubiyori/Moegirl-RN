export function diffDate(dateObj: Date) {
  let comDate = dateObj
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
}