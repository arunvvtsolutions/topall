import React, { Suspense } from 'react'
import SingleInfluencer from '@/components/admin/influencer/single-influencer'
import FallbackLoader from '@/components/ui/fallback-loader'

const SingleInfluencerPage = () => {
  return (
      <Suspense fallback={<FallbackLoader />}>
        <SingleInfluencer />
      </Suspense>
  )
}

export default SingleInfluencerPage
