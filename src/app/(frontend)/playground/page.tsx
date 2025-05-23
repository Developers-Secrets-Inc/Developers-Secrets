import { serialize } from 'next-mdx-remote/serialize'
import { MarkdownRemoteClient } from '@/components/MarkdownRemoteClient'

export default async function Page() {
  // Simule la récupération du markdown/MDX depuis la base
  const mdxString = `
# Hello

Ceci est du markdown.

<Button>Primary Button</Button>

<InfoNote>
  Ceci est une note d'information avec une icône !
</InfoNote>
`
  // Sérialisation côté serveur
  const mdxSource = await serialize(mdxString)

  return (
    <div className="h-screen p-10">
      <MarkdownRemoteClient source={mdxSource} />
    </div>
  )
}
