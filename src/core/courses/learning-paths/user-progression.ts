'use server'

import 'server-only'
import { getLearningPathCourses } from "."
import { getUserCourseProgression } from '../progression'
import { Course } from '@/payload-types'

// export const getUserLearningPathProgression = async (userId: string, learningPathId: number) => {
//   const learningPathCourses = await getLearningPathCourses(learningPathId)
//   const userPartProgress = await Promise.all(
//     learningPathCourses.map(async (course) => {
//       if (typeof course === 'number' || !course.orderedChapters || course.orderedChapters.length === 0) {
//         return 0
//       } else {
//         const courseProgress = await getUserCourseProgression(userId, course.id)
//         return courseProgress
//       }
//     })
//   )

//   return userPartProgress.reduce((acc, curr) => acc + curr, 0) / userPartProgress.length
// }




/*  

Getting course progression should be O(1). Every time a part is completed, we should update the course progression. It should be done with a payload hook.

So we may have a CourseUserProgression collection that will be updated every time a part is completed.
- userId
- courseId
- percentage



*/
