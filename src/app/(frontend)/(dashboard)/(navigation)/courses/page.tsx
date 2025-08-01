import {
  UserProfile,
  UserProfileCardSkeleton,
} from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/user-profile'; 
import { CoursesGrid } from '@/components/cards/courses-grid'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { getCoursesWithStartUrl } from '@/core/courses'
import { LearningPathsGrid } from '@/core/courses/components/dashboard/learning-paths-grid'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result';
import { redirect } from 'next/navigation'
import { Suspense } from 'react'


export default async function Page() {
  const user = await getUser()
  
  if (isFailure(user)) {
    redirect('/auth/login')
  }
  
  const courses = await getCoursesWithStartUrl()

  return (
      <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
        <div className="flex flex-col gap-6 p-6 h-full">
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <CurrentCourseCard />
              <LearningPathsGrid />
            </div>
            <div className="w-[360px] flex-shrink-0">
              <Suspense fallback={<UserProfileCardSkeleton />}>
                <UserProfile user={user.value} />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* <h2 className="text-xl font-semibold tracking-tight">Available Courses</h2> */}
            <CoursesGrid courses={courses} userId={user.value.id} />
          </div>
        </div>
      </div>
  )
}
