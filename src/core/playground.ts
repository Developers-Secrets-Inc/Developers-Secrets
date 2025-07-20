

type LockedConcept = {
    name: string 
    isLocked: true
}

type UnlockedConcept = {
    name: string 
    isLocked: false
    masteryProgress: number    
}

type Concept = LockedConcept | UnlockedConcept



const displayConcept = (concept: Concept): void => {
    if (concept.isLocked) {console.log("I'm locked")}
    else {console.log(concept.masteryProgress)}
}