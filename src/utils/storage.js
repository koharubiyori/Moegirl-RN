import AsyncStorage from '@react-native-community/async-storage'

export default {
  set: (key, val) => AsyncStorage.setItem(key, JSON.stringify(val)),
  get: key => AsyncStorage.getItem(key),
  remove: key => AsyncStorage.removeItem(key),
  merge: (key, val) => AsyncStorage.mergeItem(key, JSON.stringify(val))
}