import { Badge } from '@/components/ui/badge'
import { Challenge, Skill, ImplementationConcept, Concept } from '@/payload-types'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'


type SkillImpactEntry = NonNullable<Challenge['skillImpacts']>[number];
type ImpactDetail = NonNullable<SkillImpactEntry['impacts']>[number];

type ChallengeSkillImpactsProps = {
  skillImpacts: Challenge['skillImpacts']
}

export const ChallengeSkillImpacts = ({ skillImpacts }: ChallengeSkillImpactsProps) => {
  if (!skillImpacts || skillImpacts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skillImpacts
        .flatMap((skillImpactEntry: SkillImpactEntry) => {
          if (!skillImpactEntry.impacts) {
            return [];
          }

          return skillImpactEntry.impacts.map((impactDetail: ImpactDetail, impactIndex: number) => {
            let nameToDisplay: string | undefined;
            let progressAmount: number | undefined;

            if (impactDetail.blockType === 'skillConceptImpact' && typeof impactDetail.implementationConcept === 'object' && impactDetail.implementationConcept.concept && typeof impactDetail.implementationConcept.concept === 'object') {
              nameToDisplay = impactDetail.implementationConcept.concept.name;
              progressAmount = impactDetail.progressAmount;
            } else if (impactDetail.blockType === 'baseConceptImpact' && typeof impactDetail.concept === 'object' && impactDetail.concept.name) {
              nameToDisplay = impactDetail.concept.name;
              progressAmount = impactDetail.progressAmount;
            }

            if (nameToDisplay) {
              return (
                <Tooltip key={`${skillImpactEntry.id || 'skill'}-${impactDetail.id || impactIndex}`}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline">
                      {nameToDisplay}
                    </Badge>
                  </TooltipTrigger>
                  {progressAmount !== undefined && (
                    <TooltipContentCustom side="bottom">
                      You will gain {progressAmount}% progress
                    </TooltipContentCustom>
                  )}
                </Tooltip>
              );
            }
            return null;
          }).filter(Boolean); // Filter out nulls from the inner map
        })
        .filter(Boolean)} {/* Filter out nulls from the flatMap if any */}
    </div>
  );
};
