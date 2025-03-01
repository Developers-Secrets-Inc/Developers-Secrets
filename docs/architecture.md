

- On utilises payloadCMS pour la gestion de la base de données. Toutes les collections sont dans le dossier src/collections.
- On utilises NextJS 15 avec app router.
- On utilise les components de Shadcn/UI.
- On utilise Tailwind 4 qui est sorti très récemment.
- On utilise Lucide pour les icons.

On ne crée pas de routes API, uniquement des server actions. La collections Users représente les Admins de payload. Les collections sont placées dans payload.config.ts. Analyse en profondeur avant de modifier l'architecture du code. 

Pour import payloadCMS, on utilise le code suivant :

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

