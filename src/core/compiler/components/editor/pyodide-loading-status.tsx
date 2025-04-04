'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export const PyodideLoadingStatus = ({
    pyodideStatus,
  }: {
    pyodideStatus: 'loading' | 'loaded' | 'error' | 'uninitialized'
  }) => {
    const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
  
    // On server or initial client render, return empty div to prevent hydration mismatch
    if (!isClient) {
      return <div className="text-xs flex items-center" />
    }
  
    return (
      <div className="text-xs flex items-center">
        {pyodideStatus === 'loading' && (
          <>
            <Loader2 size={12} className="animate-spin mr-1" />
            <span className="text-yellow-500">Loading Python...</span>
          </>
        )}
        {pyodideStatus === 'error' && <span className="text-red-500">Python load failed</span>}
        {pyodideStatus === 'uninitialized' && (
          <span className="text-gray-500">Python not initialized</span>
        )}
      </div>
    )
  }
  