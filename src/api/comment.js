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