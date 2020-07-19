import { useEffect, useRef } from 'react'
import Promiser from '~/utils/createPromiser'

export default function useNextTickFunc<T extends any[]>(func: (waitingNextTickPromise: Promise<void>, ...args: T) => any) {
  const promiser = useRef(new Promiser())

  useEffect(() => {
    promiser.current.resolve()
    promiser.current = new Promiser()
  })

  return (...args: T) => func(promiser.current.promise, ...args)
}