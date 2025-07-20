


export type ConceptState = 'unknown' | 'locked' | 'uncompleted' | 'completed'
export type ConceptStatus = Exclude<ConceptState, 'unknown'>