import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'articleStatus', 'difficultyLevel', 'updatedAt'],
  },
  // Activation du système de versions avec brouillons
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Sous-titre',
      type: 'text',
    },
    {
      name: 'content',
      label: 'Contenu',
      type: 'textarea',
      required: true,
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      admin: {
        description:
          "Informations pour le référencement (SEO) de l'article en langue principale (anglais)",
      },
      fields: [
        {
          name: 'title',
          label: 'Titre SEO',
          type: 'text',
          admin: {
            description:
              'Titre optimisé pour les moteurs de recherche (si différent du titre principal)',
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          admin: {
            description:
              'Description courte pour les résultats de recherche (150-160 caractères recommandés)',
          },
        },
        {
          name: 'keywords',
          label: 'Mots-clés',
          type: 'array',
          admin: {
            description: 'Mots-clés pertinents pour le référencement',
          },
          fields: [
            {
              name: 'keyword',
              label: 'Mot-clé',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'articleStatus',
      label: 'Visibilité',
      type: 'select',
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Archivé', value: 'archived' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
        description: "Visibilité de l'article (indépendant du système de brouillon/publication)",
      },
    },
    {
      name: 'difficultyLevel',
      label: 'Niveau de difficulté',
      type: 'select',
      options: [
        { label: 'Débutant', value: 'beginner' },
        { label: 'Intermédiaire', value: 'intermediate' },
        { label: 'Avancé', value: 'advanced' },
      ],
      defaultValue: 'beginner',
      required: true,
      admin: {
        position: 'sidebar',
        description: "Niveau de difficulté de l'article",
      },
    },
    {
      name: 'author',
      label: 'Auteur',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'translations',
      label: 'Traductions',
      type: 'array',
      admin: {
        description:
          "Ajoutez des traductions pour cet article (la langue par défaut est l'anglais)",
      },
      fields: [
        {
          name: 'language',
          label: 'Langue',
          type: 'select',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'Espagnol', value: 'es' },
          ],
          required: true,
        },
        {
          name: 'title',
          label: 'Titre',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          label: 'Sous-titre',
          type: 'text',
        },
        {
          name: 'content',
          label: 'Contenu',
          type: 'textarea',
          required: true,
        },
        {
          name: 'translator',
          label: 'Traducteur',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'seo',
          label: 'SEO',
          type: 'group',
          admin: {
            description: 'Informations pour le référencement (SEO) de cette traduction',
          },
          fields: [
            {
              name: 'title',
              label: 'Titre SEO',
              type: 'text',
              admin: {
                description:
                  'Titre optimisé pour les moteurs de recherche (si différent du titre traduit)',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              admin: {
                description:
                  'Description courte pour les résultats de recherche (150-160 caractères recommandés)',
              },
            },
            {
              name: 'keywords',
              label: 'Mots-clés',
              type: 'array',
              admin: {
                description: 'Mots-clés pertinents pour le référencement dans cette langue',
              },
              fields: [
                {
                  name: 'keyword',
                  label: 'Mot-clé',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'relatedArticles',
      label: 'Articles reliés',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Sélectionnez les articles qui sont reliés à cet article',
      },
    },
    {
      name: 'prerequisites',
      label: 'Prérequis',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Articles qui devraient être lus avant celui-ci',
      },
    },
    {
      name: 'nextSteps',
      label: 'Étapes suivantes',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Articles recommandés à lire après celui-ci',
      },
    },
  ],
}
