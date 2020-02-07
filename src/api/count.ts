import request from '~/utils/request'

function increment(username = '') {
  return request({
    url: 'https://api.koharu.top/moegirl/increment',
    params: { username }
  })
}

export default { increment }