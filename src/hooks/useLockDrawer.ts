import { useEffect } from 'react'

export default function useLockDrawer() {
  useEffect(() => {
    $drawer.setLock(true)
    return () => $drawer.setLock(false)
  }, [])
}