export interface CommentData {
  id: string
  userid: number
  username: string
  text: string
  timestamp: number
  parentid: string
  like: number
  myatt: number
} 

export namespace CommentApiData {
  interface Get {
    flowthread: {
      count: number
      popular: CommentData[]
      posts: CommentData[]
    }
  }
}