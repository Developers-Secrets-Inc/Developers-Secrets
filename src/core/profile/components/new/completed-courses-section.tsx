import { CourseCard } from './course-card'

// Placeholder data - Replace with actual data fetching based on userId
const placeholderCourses = [
  {
    id: '1',
    title: 'Introduction to React Hooks and Advanced Patterns',
    href: '/courses/react-hooks',
    thumbnailUrl: '/images/placeholder-course-1.jpg', // Replace with actual path or URL
  },
  {
    id: '2',
    title: 'Mastering Next.js 14: Server Actions and App Router',
    href: '/courses/nextjs-14',
    // No thumbnail example
  },
  {
    id: '3',
    title: 'TypeScript Fundamentals for Modern Web Development',
    href: '/courses/typescript-fundamentals',
    thumbnailUrl: '/images/placeholder-course-3.jpg', // Replace with actual path or URL
  },
  {
    id: '4',
    title: 'Building Scalable APIs with Node.js and Express',
    href: '/courses/nodejs-apis',
    thumbnailUrl: '/images/placeholder-course-4.jpg',
  },
]

interface CompletedCoursesSectionProps {
  // userId would likely be needed here to fetch real data
  // userId: string;
}

export const CompletedCoursesSection = ({}: CompletedCoursesSectionProps) => {
  // In a real scenario, fetch completed courses based on userId here
  const courses = placeholderCourses // Use placeholder data for now

  if (courses.length === 0) {
    // Optionally render something if user has no completed courses
    return null
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Completed Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            href={course.href}
            thumbnailUrl={course.thumbnailUrl}
          />
        ))}
      </div>
      {/* TODO: Add "View All Courses" button/link later */}
    </div>
  )
}
