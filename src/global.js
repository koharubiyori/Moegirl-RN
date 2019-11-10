import storage from './utils/storage'

const colors = {
  main: '#3CAD3D',
  dark: '#318D32',
  light: '#87CD88',
  sub: '#0DBC79'
}

global.$colors = colors
global.$avatarUrl = 'https://commons.moegirl.org/extensions/Avatar/avatar.php?user='

// 读取记录的最后热更新时间
storage.get('lastUpdateDate').then(date => global.$lastUpdateDate = date)
storage.get('lastUpdateVersion').then(version => global.$lastUpdateVersion = version)
                                