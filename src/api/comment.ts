import request from '~/utils/moeRequest'
import { CommentApiData } from './comment.d'

export function getComments(pageid: number, offset = 0) {
  return request<CommentApiData.Get>({
    params: {
      action: 'flowthread',
      type: 'list',
      pageid,
      offset
    }
  }).then(data => data.flowthread)
}

export function toggleLike(postid: string, isLiked: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    request({
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

export function report(postid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request({
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

export function delComment(postid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request({
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

export function postComment(pageid: number, content: string, postid?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request({
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