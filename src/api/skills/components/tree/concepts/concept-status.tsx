import React from 'react'

import type { ConceptStatus as ConceptStatusType } from '@/api/skills/types'


const CompletedConceptIcon = () => {
  return <></>
}

const UncompletedConceptGauge = ({ progress }: { progress: number }) => {
  return <></>
}

const LockedConceptIcon = () => {
  return <></>
}


type ConceptStatusProps = 
  | {
      status: Exclude<ConceptStatusType, 'uncompleted'>
    }
  | {
      status: 'uncompleted'
      progress: number
    }

export const ConceptStatus = (props: ConceptStatusProps) => {
  if (props.status === 'uncompleted') {
    return <UncompletedConceptGauge progress={props.progress} />
  }
  const statusComponent: Record<Exclude<ConceptStatusType, 'uncompleted'>, React.ReactNode> = {
    completed: <CompletedConceptIcon />,
    locked: <LockedConceptIcon />,
  }
  return statusComponent[props.status]
}
