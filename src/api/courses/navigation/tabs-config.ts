import { FileTextIcon, UsersIcon, ListChecksIcon, LucideIcon, Award, Lock } from 'lucide-react'
import { isSolutionUnlocked } from '../progression/solution'
import { isNone } from '@/lib/maybe'
import { getCoursePartCompletionStatus } from '../progression'

export type TabConfig = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  active: boolean
  lock?: {
    isLocked: (coursePartId: number, userId: string) => Promise<boolean>
    dialog: {
      title: string
      description: string
      confirmLabel: string
    }
    onConfirm: (coursePartId: number, userId: string) => Promise<void>
  }
}

export const coursePartTabs = (slug: string, pathname: string): TabConfig[] => [
  {
    id: 'description',
    label: 'Description',
    href: `/courses/${slug}/description`,
    icon: FileTextIcon,
    active: pathname === `/courseParts/${slug}/description`,
  },
  {
    id: 'official-solution',
    label: 'Official Solution',
    href: `/courseParts/${slug}/official-solution`,
    icon: Award,
    active: pathname === `/courses/${slug}/official-solution`,
    lock: {
      isLocked: async (coursePartId, userId) => {
        const solutionUnlocked = await isSolutionUnlocked({ partId: coursePartId, userId })
        const completionStatus = await getCoursePartCompletionStatus({
          partId: coursePartId,
          userId,
        })

        if (isNone(solutionUnlocked) || isNone(completionStatus)) {
          return true
        }
        return !solutionUnlocked.value.isSolutionUnlocked && completionStatus.value.completionStatus !== 'completed'
      },
      dialog: {
        title: 'Unlock Official Solution',
        description: 'Unlock the official solution to see how the coursePart creator solved it.',
        confirmLabel: 'Unlock',
      },
      onConfirm: async (coursePartId, userId) => {
        // Cette fonction sera appelée par unlockTab du hook
        // qui gère automatiquement l'invalidation du cache
      },
    },
  },
  {
    id: 'submissions',
    label: 'Submissions',

    // ! Same here, href is always the same pattern
    href: `/courses/${slug}/submissions`,
    icon: ListChecksIcon,

    // ! Quite useless, same pattern everywhere `/courseParts/{slug}/{id}`. Could be dynamic
    active: pathname.startsWith(`/courseParts/${slug}/submissions`),
  },
]

/*

Chaque tab peut avoir un ensemble d'états :
- Il peut être classique, accessible directement comme un lien 
  - Il peut être actif, c'est-à-dire qu'on est sur la page en question 
- Il peut être bloqué. Un tab bloqué possède un dialog de confirmation. On doit laisser libre le choix du texte de ce dialog, j'aimerais même faire en sorte que le dialog soit dynamique. Ce dialog possède un bouton de confirmation qui quand on clique dessus effectue une action backend et ouvre automatiquement le tab.


Le problème est chaque tab possiblement bloqué est indépendant pour déterminer s'il est initialement bloqué ou non. On pourrait donc ajouter une action isLocked: (coursePartSlug) => Promise<bool>. 

- On doit aussi avoir un évènement onConfirm qui est appelé quand on confirme dans le dialog

*/
