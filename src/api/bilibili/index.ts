import request from '~/request/base'

function getVideoInfo(videoId: string, isBvId: boolean) {
  return request({
    url: 'https://api.bilibili.com/x/web-interface/view',
    params: {
      [isBvId ? 'bvid' : 'aid']: videoId
    }
  }).then(data => data.data.data)
}

const bilibiliApi = { getVideoInfo }
export default bilibiliApi