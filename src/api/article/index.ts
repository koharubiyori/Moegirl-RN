import moeRequest from '~/request/moegirl'
import { ArticleApiData } from './types'

function getContent(pageName = 'Mainpage') {
  return moeRequest<ArticleApiData.GetContent>({
    params: {
      action: 'parse',
      page: pageName,
      redirects: 1,
      prop: 'text|categories|templates|sections|images|displaytitle'
    }
  })
}

function getMainImage(pageName: string, size = 500) {
  return moeRequest<ArticleApiData.GetImages>({
    params: {
      action: 'query',
      prop: 'pageimages',
      titles: pageName,
      pithumbsize: size
    }
  }).then(data => {
    const { pages } = data.query
    return Object.values(pages)[0].thumbnail
  })
}

function getImageUrl(imageName: string) {
  return moeRequest<ArticleApiData.getImgUrl>({
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