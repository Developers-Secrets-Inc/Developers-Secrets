import { DescriptionComments } from "../../components/comments/description-comments"
import { Challenge as PayloadChallenge } from "@/payload-types"

export const ChallengeDescriptionFooter = ({
    challenge
}: {
    challenge: PayloadChallenge
}) => {
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <DescriptionComments challenge={challenge} />
    </div>
  )
}
