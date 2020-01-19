declare module 'react-native-cookies' {
  interface Cookies {
    get (domain: string): Promise<{ [key: string]: string }>
  } 

  const Cookies: Cookies
  export default Cookies
}