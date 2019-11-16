import store from './redux'
import storage from './utils/storage'
// import toast from './utils/toast'
import { SET_INFO } from './redux/user/actionTypes'
import { logout as userLogout } from './redux/user/HOC'
import { check as checkLoginStatus } from './redux/user/HOC'
import { set as setConfig, init as initConfig } from './redux/config/HOC'
// 暂时隐藏热更新
// import { Platform, Linking } from 'react-native'
// import {
//   isFirstTime,
//   isRolledBack,
//   checkUpdate as _checkUpdate,
//   downloadUpdate,
//   switchVersion,
//   markSuccess,
// } from 'react-native-update'
// import updateConfig from '../update.json'


// const { appKey } = updateConfig[Platform.OS]

// 热更新逻辑
// isFirstTime && markSuccess()
// isRolledBack && $dialog.alert.show({ content: '因更新出现问题，应用已自动回滚' })

// export const checkUpdate = (isSilent = false) =>{
//   if(global.__DEV__){ return }
//   !isSilent && toast.showLoading('检查更新中')
//   _checkUpdate(appKey)
//     .finally(toast.hide)
//     .then(info =>{
//       if(info.expired){
//         $dialog.confirm.show({
//           content: '发现更新，是否前往酷安下载？',
//           onTapCheck: () =>{
//             Linking.openURL('https://www.coolapk.com/apk/247471')
//           }
//         })
//       }

//       if(info.update){
//         var metaInfo = JSON.parse(info.metaInfo || '{}')

//         // 如果在远程配置了isSilentUpdate(静默更新)且本身也为静默模式，则完全静默，进行用户无感知的热更新
//         if(metaInfo.isSilentUpdate && isSilent){
//           downloadUpdate(info).then(switchVersionLater)
//         }else{
//           setTimeout(() =>{
//             $dialog.confirm.show({
//               content: `检查到新版本：${info.name}，是否进行更新？\n\n${info.description}`,
//               onTapCheck: () =>{
//                 toast.showLoading('执行热更新')
//                 downloadUpdate(info)
//                   .finally(toast.hide)
//                   .then(hash =>{
//                     storage.set('lastUpdateDate', metaInfo.date)
//                     storage.set('lastUpdateVersion', info.name)
//                     $dialog.alert.show({ 
//                       content: '更新成功，即将重启应用',
//                       onTapCheck: () => setTimeout(() => switchVersion(hash), 500)
//                     })
//                   })
//                   .catch(() => !isSilent && $dialog.alert.show({ content: '更新失败' }))
//               }
//             })
//           }, 500)
//         }
//       }

//       if(info.upToDate){
//         !isSilent && $dialog.alert.show({ content: '应用已是最新' })
//       }
//     })
// }

store.dispatch(dispatch =>{
  storage.get('userName').then(name =>{
    if(!name){ return }
    dispatch({ type: SET_INFO, name })

    // 获取一次编辑令牌，判断登录状态是否有效
    checkLoginStatus().catch(() =>{
      userLogout()
      $dialog.confirm.show({
        content: '登录状态貌似失效了，要前往登录吗？',
        onTapCheck: () =>{
          $appNavigator.current._navigation.push('login')
        }
      })
    })    
  })
})

storage.get('config').then(localConfig =>{
  localConfig ? setConfig(localConfig) : initConfig()
})