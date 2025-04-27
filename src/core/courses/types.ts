
type Skill = any

type Course = {
    id: number
    name: string 
    slug: string 
    description?: string 

    chapters: Chapter[]

    requiredCourses: Course[]
    skills: Skill[]
}

type UserCourseCompletion = {
    userId: string 
    courseId: number
    isCompleted: boolean
    completedAt: Date | null
}

type Chapter = {
    name: string 
    slug: string 

    requiredChapters: Chapter[]
    parts: Part[]
}

type Part = {
    name: string 
    slug: string 

    engagement: Engagement
    description: {
        statement: string 
        hint: Hint[]
    }
    officialSolution: {
        statement: string 
    }
    challenges: Challenge[]
}

type Hint = {
    content: string 
    isVisible: boolean
}

type Engagement = {
    likes: number 
    dislikes: number 
}


type Language = string

type Challenge = {
    languages: {
        name: Language 
        initialCode: string 
        testCases: {
            input: string 
            expectedOutput: string 
        }[]
    }[]
}

