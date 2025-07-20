"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Skill = {
    id: number
    name: string
    slug: string
}

export const SkillTreeSelect = ({ skills }: { skills: Skill[] }) => {
    const router = useRouter()
    const [selectedSkillSlug, setSelectedSkillSlug] = useState<string | undefined>(
        skills.length > 0 ? skills[0].slug : undefined
    )

    const handleSkillChange = (slug: string) => {
        setSelectedSkillSlug(slug)
        router.push(`/skills/${slug}`)
    }

    return (
        <Select onValueChange={handleSkillChange} value={selectedSkillSlug}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a skill tree" />
            </SelectTrigger>
            <SelectContent>
                {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.slug}>
                        {skill.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
