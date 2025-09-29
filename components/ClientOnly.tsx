"use client"

import { useEffect, useState } from 'react'
import { cleanBrowserExtensionAttributes } from '@/lib/client-utils'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ClientOnly component ensures content only renders on the client side
 * This prevents hydration mismatches
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    // Clean browser extension attributes after mount
    cleanBrowserExtensionAttributes()
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook to check if component has mounted on client
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    cleanBrowserExtensionAttributes()
  }, [])

  return hasMounted
}
