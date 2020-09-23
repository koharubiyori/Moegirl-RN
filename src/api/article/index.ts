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

// 请求图片原始链接每次最多50个，这里进行分段请求
function getImagesUrl(imageNames: string[]): Promise<{ [fileName: string]: string }> {
  const requestFragments: string[][] = [[]]
  imageNames.forEach(item => {
    const lastFragment = requestFragments[requestFragments.length - 1]
    if (lastFragment.length === 50) {
      requestFragments.push([item])
    } else {
      lastFragment.push(item)
    }
  })
  
  return Promise.all(
    requestFragments.map(imageNamesFragment => moeRequest<ArticleApiData.getImgUrl>({
      baseURL: 'https://commons.moegirl.org.cn/api.php',
      method: 'post',
      params: {
        action: 'query',
        prop: 'imageinfo',
        titles: imageNamesFragment.map(item => 'File:' + item).join('|'),
        iiprop: 'url'
      }
    }))
  )
    .then(res => {
      return res.map(resItem => Object.values(resItem.query.pages)).flat().reduce((result, item) => {
        result[item.title.replace('File:', '')] = item.imageinfo[0].url
        return result
      }, {} as { [fileName: string]: string })
    }) as any
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

const articleApi = { getContent, getImagesUrl, getMainImage, translateTitle }
export default articleApi