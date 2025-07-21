import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ course_slug: string, chapter_slug: string, part_slug: string }> }) {
    const { course_slug, chapter_slug, part_slug } = await params


    return redirect(`/courses/${course_slug}/${chapter_slug}/${part_slug}/description`)
}
