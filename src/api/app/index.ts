import request from '~/request/base'
import { AppApiData } from './types'

function getGithubLastRelease() {
  return request({
    url: 'https://api.github.com/repos/koharubiyori/moegirlViewer/releases/latest'
  })
    .then(rawData => {
      let data: AppApiData.getGithubLastRelease = rawData.data
      return {
        version: data.tag_name,
        downloadLink: data.assets[0].browser_download_url,
        info: data.body
      }
    })
}

const appApi = { getGithubLastRelease }
export default appApi