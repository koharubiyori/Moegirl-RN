import { useEffect } from 'react'
import { drawerController } from '~/views/drawer'

export default function useLockDrawer() {
  useEffect(() => {
    drawerController.setLock()
    return () => drawerController.setLock(false)
  }, [])
}