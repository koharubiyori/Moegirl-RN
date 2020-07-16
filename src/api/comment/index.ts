import moeRequest from '~/request/moegirl'
import { CommentApiData } from './types'

function getComments(pageid: number, offset = 0) {
  return moeRequest<CommentApiData.Get>({
    params: {
      action: 'flowthread',
      type: 'list',
      pageid,
      offset
    }
  }).then(data => data.flowthread)
}

function toggleLike(postid: string, isLiked: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    moeRequest({
      method: 'post',
      params: {
        action: 'flowthread',
        type: isLiked ? 'dislike' : 'like',
        postid
      }
    }).then(data => {
      'error' in data ? reject() : resolve()
    }).catch(reject)
  })
}

function report(postid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    moeRequest({
      method: 'post',
      params: {
        action: 'flowthread',
        type: 'report',
        postid
      }
    }).then(data => {
      'error' in data ? reject() : resolve()
    }).catch(reject)
  })
}

function delComment(postid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    moeRequest({
      method: 'post',
      params: {
        action: 'flowthread',
        type: 'delete',
        postid
      }
    }).then(data => {
      'error' in data ? reject() : resolve()
    }).catch(reject)
  })
}

function postComment(pageid: number, content: string, postid?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    moeRequest({
      method: 'post',
      params: {
        action: 'flowthread',
        type: 'post',
        pageid,
        content,
        ...(postid ? { postid } : {})
      }
    }).then(data => {
      'error' in data ? reject() : resolve()
    }).catch(reject)
  })
}

const commentApi = { getComments, toggleLike, report, delComment, postComment }
export default commentApi