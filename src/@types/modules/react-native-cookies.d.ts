declare module 'react-native-cookies' {
  interface Cookies {
    get (domain: string): Promise<{ [key: string]: string }>
    clearAll (): void
  } 

  const Cookies: Cookies
  export default Cookies
}