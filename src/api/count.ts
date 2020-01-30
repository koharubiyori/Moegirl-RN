import request from '~/utils/request'

function increment(username = '') {
  return request({
    url: 'https://koharu.top/moegirl/increment',
    params: { username }
  }).then(data => console.log(data)).catch(e => console.log(e))
}

export default { increment }