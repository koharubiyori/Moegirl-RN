import request from '~/utils/request'

export function getComments(pageid, offset = 0){
  return request({
    params: {
      action: 'flowthread',
      type: 'list',
      pageid, offset
    }
  }).then(data => data.flowthread)
}

export function toggleLike(postid, isLiked){
  return new Promise((resolve, reject) =>{
    request({
      method: 'post',
      params: {
        action: 'flowthread',
        type: isLiked ? 'dislike' : 'like',
        postid
      }
    }).then(data =>{
      'error' in data ? reject() : resolve()
    }).catch(reject)
  })
}