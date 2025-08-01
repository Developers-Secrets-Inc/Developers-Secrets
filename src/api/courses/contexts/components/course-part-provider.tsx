'use client'

import React from 'react'
import { CoursePartContext } from '../course-part-context'
import { CoursePartContextType } from '../types'

export const CoursePartProvider = ({
  children,
  coursePart,
  metadata
}: CoursePartContextType & { children: React.ReactNode}
) => {
  return <CoursePartContext.Provider value={{ coursePart, metadata }}>{children}</CoursePartContext.Provider>
}
