
declare module 'react-redux' {
  export * from '~/../node_modules/@types/react-redux'
  import { FC } from 'react'

  export interface MapStateToProps{
    <T>(state: T): { state: T }
  }

  export interface MapDispatchToProps {
    (dispatch: any): {
      [stateName: string]: { 
        [dispatchName: string]: Function 
      } 
    }
  }

  export function connect(mapStateToProps: MapStateToProps, mapDispatchToProps: MapDispatchToProps): (Element: FC<any>) => FC<any>
}