import { RecommendedChallengeSkeleton } from '../../(navigation)/challenges/components/recommended-challenge'
import { UserProfileCardSkeleton } from '../../(navigation)/challenges/components/user-profile'
import { HomeGrid, HomeLeftColumn, HomeRightColumn } from '../../(navigation)/home/page'

export const HomeLoading = () => {
  return (
    <HomeGrid>
      <HomeLeftColumn>
        <RecommendedChallengeSkeleton />
      </HomeLeftColumn>
      <HomeRightColumn>
        <UserProfileCardSkeleton />
      </HomeRightColumn>
    </HomeGrid>
  )
}

export default HomeLoading
