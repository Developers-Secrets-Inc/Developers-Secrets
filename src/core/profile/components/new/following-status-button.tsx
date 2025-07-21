'use client'

import { useState } from 'react'
import { FollowButton } from './follow-button'
import { UnfollowButton } from './unfollow-button'

export const FollowingStatusButton = () => {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleClick = () => {
    setIsFollowing((prev) => !prev)
  }

  return <div onClick={handleClick}>{isFollowing ? <UnfollowButton /> : <FollowButton />}</div>
}
