'use server'

import { query } from '@/core/functions'
import { title } from 'process'
import 'server-only'
import z from 'zod'

export type Section = {
    name: string 
    articles: {
        name: string,
        slug: string
    }[]
}

export const getTutorialSections = query({
    name: 'reference-tutorial-sections',
    args: z.object({ tutorialSlug: z.string() }),
    handler: async (ctx, args): Promise<Section[]> => {
        const documents = await ctx.payload.find({
            collection: 'tutorials',
            where: { slug: { equals: args.tutorialSlug }},
            depth: 0,
            limit: 1
        })

        const sections = await Promise.all(documents.docs[0].sections.map(async (section) => {
            const articles = await Promise.all(section.articles.map(async (articleId) => {
                const article = await ctx.payload.findByID({
                    collection: 'articles',
                    id: articleId as number,
                    select: {title: true, slug: true}
                })

                return {name: article.title, slug: article.slug}
            }))

            return {
                name: section.title,
                articles
            }
        }))

        return sections
    }
})


export const getTutorialExampleSections = query({
    name: 'example-tutorial-sections',
    args: z.object({ tutorialSlug: z.string() }),
    handler: async (ctx, args): Promise<Section[]> => {
        const documents = await ctx.payload.find({
            collection: 'tutorials',
            where: { slug: { equals: args.tutorialSlug }},
            depth: 0,
            limit: 1
        })

        const sections = await Promise.all(documents.docs[0]?.exampleSections.map(async (section) => {
            const articles = await Promise.all(section.articles.map(async (articleId) => {
                const article = await ctx.payload.findByID({
                    collection: 'articles',
                    id: articleId as number,
                    select: {title: true, slug: true}
                })

                return {name: article.title, slug: article.slug}
            }))

            return {
                name: section.title,
                articles
            }
        }))

        return sections
    }
})


export const getTutorialReferenceSections = query({
    name: 'reference-tutorial-sections',
    args: z.object({ tutorialSlug: z.string() }),
    handler: async (ctx, args): Promise<Section[]> => {
        const documents = await ctx.payload.find({
            collection: 'tutorials',
            where: { slug: { equals: args.tutorialSlug }},
            depth: 0,
            limit: 1
        })

        const sections = await Promise.all(documents.docs[0]?.referenceSections.map(async (section) => {
            const articles = await Promise.all(section.articles.map(async (articleId) => {
                const article = await ctx.payload.findByID({
                    collection: 'articles',
                    id: articleId as number,
                    select: {title: true, slug: true}
                })

                return {name: article.title, slug: article.slug}
            }))

            return {
                name: section.title,
                articles
            }
        }))

        return sections
    }
})