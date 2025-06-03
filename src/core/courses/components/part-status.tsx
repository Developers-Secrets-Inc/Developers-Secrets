import { CoursePartStatusClient } from "@/core/courses/components/part-status-client"
import { getUser } from "@/core/user"
import { getUserPartCompletionStatus } from "../progression/completion-status"
import { Skeleton } from "@/components/ui/skeleton"

export const PartStatusSkeleton = () => {
    return <Skeleton className="h-8 w-24" />
}

export const PartStatus = async ({ partId }: { partId: number }) => {
    const user = await getUser()

    if (!user) {
        return null
    }

    const initialStatus = await getUserPartCompletionStatus(user.id, partId)

    return <CoursePartStatusClient partId={partId} initialStatus={initialStatus} />
}

