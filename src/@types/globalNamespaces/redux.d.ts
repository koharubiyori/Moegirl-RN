import { Reducer } from '~/../node_modules/redux'

export = Redux
export as namespace __Redux

declare namespace Redux {
  interface ReduxAction<Type> {
    type: Type
    [key: string]: any
  }

  type ReduxReducer<State, Type = symbol, ParamNames = any> = Reducer<State, ReduxAction<Type>>
}