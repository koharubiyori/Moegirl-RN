import { useEffect } from 'react'

export default function useLockDrawer() {
  useEffect(() => {
    console.log($drawer)
    $drawer.setLock(true)
    return () => $drawer.setLock(false)
  }, [])
}