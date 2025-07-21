import { TranslationLanguage } from './article'

import { Article, Tutorial as PayloadTutorial } from '@/payload-types'

import { getPayload } from 'payload'
import config from '@payload-config'

// Visibility status for a tutorial
export type TutorialVisibility = 'active' | 'archived'

// A section within a tutorial
export type TutorialSection = {
  id: string
  title: string
  description?: string
  articles: string[] // Article IDs or slugs in order
}

// A section of example articles
export type ExampleSection = {
  id: string
  title: string
  articles: string[] // Example article IDs
}

// A section of reference articles
export type ReferenceSection = {
  id: string
  title: string
  description?: string
  articles: string[] // Reference article IDs
}

// Metadata for a tutorial
export type TutorialMetadata = {
  createdAt: string
  updatedAt: string
  publishedAt?: string
  tutorialStatus: TutorialVisibility
}

// Translation of a tutorial
export type TutorialTranslation = {
  title: string
}

// The main Tutorial type
export type Tutorial = {
  id: string
  title: string // Title in default language (English)
  description?: string // Description in default language
  slug: string

  metadata: TutorialMetadata

  // Content structure - sections containing articles
  sections: TutorialSection[]

  // Example articles organized in sections
  exampleSections?: ExampleSection[]

  // Reference articles organized in sections
  referenceSections?: ReferenceSection[]

  // Translations
  translations?: Record<TranslationLanguage, TutorialTranslation>
}

