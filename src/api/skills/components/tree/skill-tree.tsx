import { NodeProps } from "reactflow"



export const SkillTree = () => {
    return (<></>)
}




type Concept = {
    name: string 
    type: 'concrete' | 'abstract'
    progress: number 
    isLocked: boolean
}


export const ConceptNode = ({ concept }: { concept: NodeProps<Concept> }) => {
    return (<></>)
}