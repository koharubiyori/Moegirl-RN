import moeRequest from '~/request/moegirl'
import { ArticleApiData } from './types'

async function getContent(pageName = 'Mainpage') {
  const translatedTitle = await translateTitle(pageName)
  return moeRequest<ArticleApiData.GetContent>({
    params: {
      action: 'parse',
      page: translatedTitle,
      redirects: 1,
      prop: 'text|categories|templates|sections|images|displaytitle'
    }
  })
}

async function getMainImage(pageName: string, size = 500) {
  const translatedTitle = await translateTitle(pageName)
  
  return moeRequest<ArticleApiData.GetImages>({
    params: {
      action: 'query',
      prop: 'pageimages',
      titles: translatedTitle,
      pithumbsize: size
    }
  }).then(data => {
    const { pages } = data.query
    return Object.values(pages)[0].thumbnail
  })
}

function getImageUrl(imageName: string) {
  return moeRequest<ArticleApiData.getImgUrl>({
    baseURL: 'https://commons.moegirl.org.cn/api.php',
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

function translateTitle(title: string) {
  return moeRequest<ArticleApiData.translateTitle>({
    params: {
      action: 'query',
      format: 'json',
      titles: title,
      converttitles: 1,
    }
  })
    .then(data => Object.values(data.query.pages)[0].title)
    .catch(() => Promise.resolve(title))
}

const articleApi = { getContent, getImageUrl, getMainImage, translateTitle }
export default articleApi