import { action, observable, runInAction, computed } from 'mobx'
import accountApi from '~/api/account'
import { AccountApiData } from '~/api/account/types'
import editApi from '~/api/edit'
import notificationApi from '~/api/notification'
import storage from '~/utils/storage'

class UserStore {
  @observable name = ''
  @observable waitNotificationTotal = 0
  @observable info: AccountApiData.GetInfo['query']['userinfo'] | null = null
  
  @computed get isLoggedIn() {
    return !!this.name
  }

  @action.bound
  login(userName: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      accountApi.login(userName, password)
        .then(data => {
          if (data.clientlogin.status === 'PASS') {
            runInAction(() => {
              this.name = data.clientlogin.username!
            })
            storage.set('userName', data.clientlogin.username!)
            resolve(data.clientlogin.username)
          } else {
            reject(data.clientlogin.message)
          }
        }).catch(e => {
          console.log(e)
          reject(e)
        })
    })
  }

  @action.bound
  setName(name: string) {
    this.name = name
  }

  @action.bound
  logout() {
    // 清除cookies
    this.name = ''
    this.waitNotificationTotal = 0
    this.info = null
    storage.remove('userName')
  }

  @action.bound
  check(): Promise<void> {
    return new Promise((resolve, reject) => {
      editApi.getToken()
        .then(data => {
          if (data.query.tokens.csrftoken !== '+\\') return resolve()
          this.logout()
          reject()
        })
        .catch(e => {
          console.log(e)
          resolve() // 防止因为网络问题导致帐号被下线
        })
    })
  }

  @action.bound
  checkWaitNotificationTotal(): Promise<number | null> {
    return new Promise((resolve, reject) => {
      if (!this.isLoggedIn) return resolve(null)
      notificationApi.get('', 1)
        .then(data => {
          runInAction(() => {
            this.waitNotificationTotal = data.query.notifications.rawcount
          })
          resolve(data.query.notifications.rawcount)
        })
        .catch(reject)
    })
  }

  @action.bound
  markReadAllNotifications() {
    return notificationApi.markReadAll()
      .then(() => runInAction(() => this.waitNotificationTotal = 0))
  }

  @action.bound
  getUserInfo(): Promise<AccountApiData.GetInfo['query']['userinfo']> {
    return new Promise((resolve, reject) => {
      if (this.info) return resolve(this.info)
      accountApi.getInfo()
        .then(data => {
          runInAction(() => {
            this.info = data.query.userinfo
            resolve(data.query.userinfo)
          })
        })
        .catch(reject)
    })
  }
  
  @action.bound
  isAutoConfirmed(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then(userInfo => {
          resolve(userInfo.implicitgroups.includes('autoconfirmed'))
        })
        .catch(reject)
    })
  }  
}

export default UserStore