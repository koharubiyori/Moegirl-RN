import { Dispatch, SetStateAction } from 'react'

export default function<Values extends any[]>(...setters: Dispatch<SetStateAction<any>>[]): Values {
  let values: any[] = []
  setters.forEach(setter => setter((prevVal: any) => {
    values.push(prevVal)
    return prevVal
  }))

  return values as any
}