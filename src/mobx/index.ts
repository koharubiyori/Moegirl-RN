import UserStore from './user'
import SettingsStore from './settings'
import { configure } from 'mobx'
import CommentStore from './comment'

configure({ enforceActions: 'observed' })

const store = {
  user: new UserStore(),
  settings: new SettingsStore(),
  comment: new CommentStore()
}

export default store