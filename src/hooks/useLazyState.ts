import { Dispatch, SetStateAction, useState } from 'react'

export default function useLazyState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const [value, _setValue] = useState(initialState)
  const setValue: typeof _setValue = paramValue => {
    let willSetValue = typeof paramValue === 'function' ? (paramValue as any)(value) : paramValue
    value !== willSetValue && _setValue(willSetValue)
  }
  return [value, setValue]
}