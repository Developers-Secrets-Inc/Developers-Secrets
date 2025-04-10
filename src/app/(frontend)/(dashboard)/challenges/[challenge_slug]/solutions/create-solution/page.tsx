import EditorContainer from '@/app/(frontend)/(dashboard)/challenges/create-solution/components/EditorContainer'

export default async function Page({ params }: { params: Promise<{ challenge_slug: string }> }) {
  const { challenge_slug } = await params

  return (
    <div className="h-full w-full bg-[#1f1f1f]">
      <EditorContainer />
    </div>
  )
}
