import type { CollectionConfig } from 'payload'

/**
 * Type représentant un utilisateur du système
 * Basé sur la collection Users de Payload CMS
 */
export type User = {
  id: string
  email: string
  // Autres champs qui pourraient être ajoutés dans le futur
}
