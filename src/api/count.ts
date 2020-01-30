import request from '~/utils/request'

function increment(username = '') {
  return request({
    url: 'https://koharu.top/moegirl/increment',
    params: { username }
  })
}

export default { increment }