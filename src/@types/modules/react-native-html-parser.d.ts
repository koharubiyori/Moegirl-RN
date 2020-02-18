declare module 'react-native-html-parser' {  
  export interface ParseFormString {
    (html: string, type: 'text/html' | 'text/xml'): Document
  }

  interface DOMParser {
    parseFromString: ParseFormString
  }

  export interface DOMParserStatic {
    new (): DOMParser
  }

  export const DOMParser: DOMParserStatic
}