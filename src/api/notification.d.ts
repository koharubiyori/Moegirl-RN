export interface NotificationData {
  wiki: string
  id: string
  type: string
  category: string
  read: string
  targetpages: any[]

  timestamp: {
    utciso8601: string
    utcunix: string
    unix: string
    utcmw: string
    mw: string
    date: string
  }

  title: {
    full: string
    namespace: string
    'namespace-key': number
    text: string
  }

  agent: {
    id: number
    name: string
  }
}

export namespace NotificationApiData {
  interface Get {
    query: {
      notifications: {
        list: NotificationData[]
        continue: string
      }
    }
  }
}