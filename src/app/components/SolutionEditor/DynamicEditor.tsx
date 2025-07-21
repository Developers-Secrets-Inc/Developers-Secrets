'use client'

import dynamic from 'next/dynamic'

export const DynamicEditor = dynamic(() => import('./Editor'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#1f1f1f]">
      Loading editor...
    </div>
  ),
})
