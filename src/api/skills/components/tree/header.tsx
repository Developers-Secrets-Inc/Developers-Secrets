import { getSkillTreesSelectInformations } from "@/api/skills"
import { SkillTreeSelect } from "./skill-stree-select"
import { SkillTreeHelpDialog } from "./help-dialog"

export const SkillTreeHeader = async () => {
    const allSkills = await getSkillTreesSelectInformations()

    return (
        <div className="flex items-center justify-between px-8 py-2 border-b">
            {allSkills && allSkills.length > 0 && (
                <SkillTreeSelect skills={allSkills} />
            )}
            {/* Placeholder for overall mastery percentage */}
            {/* <div className="text-lg">Overall Mastery: XX%</div> */}
            <SkillTreeHelpDialog />
        </div>
    )
}
