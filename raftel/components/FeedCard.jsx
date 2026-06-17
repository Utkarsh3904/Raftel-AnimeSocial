"use client"

import React from "react"
import PollCard from "@/components/PollCard"
import DiscussionCard from "@/components/DiscussionCard"

function FeedCard({ post }) {
  if (post.type === "discussion") {
    return <DiscussionCard post={post} />
  }
  return <PollCard poll={post} />
}

export default React.memo(FeedCard)
