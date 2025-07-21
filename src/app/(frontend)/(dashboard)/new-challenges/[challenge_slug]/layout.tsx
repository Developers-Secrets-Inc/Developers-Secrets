import { getChallengeBySlug } from "@/api/challenges"
import { notFound } from "next/navigation"

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ challenge_slug: string }>
}) => {
    const { challenge_slug } = await params 

    // TODO: This query should not return an optional value but a Result where the error chould be a challenge not found. Next, this challenge will need to be passed to a challenge store. 
    const challenge = await getChallengeBySlug({ slug: challenge_slug })

    if (!challenge) {
        return notFound()
    }

    // TODO: We need to check multiple things for a challenge : It can be a draft, in this case, is only available to admins. The user can not have an account when visiting this page, we need to decide if we change the user status to let his stay on the challenge or redirect his to login page. We could have a behavior where no action is permited when the user is not logged in.

    /*
    
    <ChallengeLayout.Root>
        <ChallengeLayout.Header />
        <ChallengeLayout.Body>
            <ChallengeLayout.LeftPart>
                <ChallengeLayout.Navigation />
                <ChallengeLayout.Content />
            <ChallengeLayout.LeftPart>
            <ChallengeLayout.RightPart>
                <ChallengeLayout.IDE />
            <ChallengeLayout.RightPart>
        <ChallengeLayout.Body />
    <ChallengeLayout.Root />
    
    */


    // TODO: We need to use a more advanced pattern for challenges components with a composed component
    return children
}

export default Layout
