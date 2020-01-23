import request from '~/utils/moeRequest'
import { ApiData } from './article.d'

function getContent(pageName = 'Mainpage') {
  return request<ApiData.GetContent>({
    params: {
      action: 'parse',
      page: pageName,
      redirects: 1,
      prop: 'text|categories|templates|sections|images'
    }
  })
}

function getMainImage(pageName: string) {
  return request<ApiData.GetImages>({
    params: {
      action: 'query',
      prop: 'pageimages',
      titles: pageName,
      pithumbsize: 500
    }
  }).then(data => {
    var { pages } = data.query
    return Object.values(pages)[0].thumbnail
  })
}

function getImageUrl(imageName: string) {
  return request<ApiData.getImgUrl>({
    baseURL: 'https://commons.moegirl.org/api.php',
    method: 'post',
    params: {
      action: 'query',
      prop: 'imageinfo',
      titles: 'File:' + imageName,
      iiprop: 'url'
    }
  }).then(data => {
    return Object.values(data.query.pages)[0].imageinfo[0].url
  })
}

const articleApi = { getContent, getImageUrl, getMainImage }
export default articleApi