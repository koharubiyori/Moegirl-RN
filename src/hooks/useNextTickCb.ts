import { useEffect, useRef } from 'react'
import createPromiser from '~/utils/createPromiser'

export default function useNextTickFunc<T extends any[]>(func: (waitingNextTickPromise: Promise<void>, ...args: T) => any) {
  const promiser = useRef(createPromiser())

  useEffect(() => {
    promiser.current.resolve()
    promiser.current = createPromiser()
  })

  return (...args: T) => func(promiser.current.promise, ...args)
}