'use server'

import 'server-only'
import { find } from '..'


export const getSkillTreesSelectInformations = async (): Promise<{
    id: number,
    name: string,
    slug: string
}[]> => {
    const skillsDocs = await find({
        collection: 'skills',
        select: {
            name: true,
            slug: true
        }
    })

    return skillsDocs.docs
}