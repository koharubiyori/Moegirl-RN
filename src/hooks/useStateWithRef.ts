import { useRef, useEffect, useState, Dispatch, SetStateAction, MutableRefObject } from 'react'

export default function useStateWithRef<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state })
  
  return [state, setState, stateRef]
}