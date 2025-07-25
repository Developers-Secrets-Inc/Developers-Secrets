// challenge-tabs.config.ts
import { canAccessSolution } from '@/core/challenges/user-progression/completion-status'
import { FileTextIcon, UsersIcon, ListChecksIcon, LucideIcon, Award, Lock } from 'lucide-react'

export type TabConfig = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  active: boolean
  lock?: {
    isLocked: (challengeId: number, userId: string) => Promise<boolean>
    dialog: {
      title: string
      description: string
      confirmLabel: string
    }
    onConfirm: (challengeId: number, userId: string) => Promise<void>
  }
}

export const challengeTabs = (slug: string, pathname: string): TabConfig[] => [
  {
    id: 'description',
    label: 'Description',
    href: `/challenges/${slug}/description`,
    icon: FileTextIcon,
    active: pathname === `/challenges/${slug}/description`,
  },
  {
    id: 'official-solution',
    label: 'Official Solution',
    href: `/challenges/${slug}/official-solution`,
    icon: Award,
    active: pathname === `/challenges/${slug}/official-solution`,
    lock: {
      isLocked: async (challengeId, userId) => {
        return !(await canAccessSolution(userId, challengeId))
      },
      dialog: {
        title: 'Unlock Official Solution',
        description: 'Unlock the official solution to see how the challenge creator solved it.',
        confirmLabel: 'Unlock',
      },
      onConfirm: async (challengeId, userId) => {
        // Replace with actual backend action
        return Promise.resolve()
      },
    },
  },
  {
    id: 'solutions',
    label: 'Solutions',
    href: `/challenges/${slug}/solutions`,
    icon: UsersIcon,
    active: pathname.startsWith(`/challenges/${slug}/solutions`),
    lock: {
      isLocked: async (challengeId, userId) => {
        return !(await canAccessSolution(userId, challengeId))
      },
      dialog: {
        title: 'Unlock Community Solutions',
        description: 'Unlock community solutions to see how others have solved this challenge.',
        confirmLabel: 'Unlock',
      },
      onConfirm: async (challengeId, userId) => {
        // Replace with actual backend action
        return Promise.resolve()
      },
    },
  },
  {
    id: 'submissions',
    label: 'Submissions',

    // ! Same here, href is always the same pattern
    href: `/challenges/${slug}/submissions`,
    icon: ListChecksIcon,

    // ! Quite useless, same pattern everywhere `/challenges/{slug}/{id}`. Could be dynamic
    active: pathname.startsWith(`/challenges/${slug}/submissions`),
  },
]

/*

Chaque tab peut avoir un ensemble d'états :
- Il peut être classique, accessible directement comme un lien 
  - Il peut être actif, c'est-à-dire qu'on est sur la page en question 
- Il peut être bloqué. Un tab bloqué possède un dialog de confirmation. On doit laisser libre le choix du texte de ce dialog, j'aimerais même faire en sorte que le dialog soit dynamique. Ce dialog possède un bouton de confirmation qui quand on clique dessus effectue une action backend et ouvre automatiquement le tab.


Le problème est chaque tab possiblement bloqué est indépendant pour déterminer s'il est initialement bloqué ou non. On pourrait donc ajouter une action isLocked: (challengeSlug) => Promise<bool>. 

- On doit aussi avoir un évènement onConfirm qui est appelé quand on confirme dans le dialog

*/
