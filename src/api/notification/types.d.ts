export interface NotificationSecondaryData {
  url: string
  label: string
  tooltip: string
  description: string
  icon: string
  prioritized: string
}

export interface NotificationData {
  wiki: string
  id: string
  type: 'edit-thank' | 
        'edit-user-talk' | 
        'mention' |
        'flowthread_reply' | 
        'flowthread_userpage' | 
        'flowthread_delete' | 
        'flowthread_spam' | 
        'flowthread_mention'
  category: string
  read: string
  targetpages: any[]
  revid: number
  '*': {
    header: string
    compactHeader: string
    body: string
    icon: string
    links: {
      primary: {
        url: string
        label: string
      }

      secondary: NotificationSecondaryData[]
    }
  }

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
        rawcount: number
        count: string
      }
    }
  }

  interface GetToken {
    query: {
      tokens: {
        csrftoken: string
      }
    }
  }

  interface CheckAll {
    query: {
      echomarkread: {
        result: 'success'
      }
    }
  }
}