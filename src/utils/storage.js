import AsyncStorage from '@react-native-community/async-storage'

export default {
  set: (key, val) => AsyncStorage.setItem(key, JSON.stringify(val)),
  get: key => new Promise((resolve, reject) => AsyncStorage.getItem(key).then(data => resolve(JSON.parse(data)))
       .catch(reject)),
  remove: key => AsyncStorage.removeItem(key),
  merge: (key, val) => AsyncStorage.mergeItem(key, JSON.stringify(val))
}