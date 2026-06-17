"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

function CommentSection({ pollId, currentUser }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState("")

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?pollId=${pollId}`)
        const data = await res.json()
        setComments(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching comments:", err)
      }
    }
    fetchComments()
  }, [pollId])

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, text }),
      })
      const data = await res.json()
      if (res.ok) {
        setComments(prev => [...prev, data])
        setText("")
        toast.success("Comment added")
      } else {
        toast.error(data.error || "Failed to add comment")
      }
    } catch (err) {
      console.error("Error adding comment:", err)
      toast.error("An error occurred while adding your comment")
    }
  }

  const handleLike = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser?.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setComments(prev => prev.map(c => c._id === commentId ? data.comment : c))
        toast.success("Comment liked")
      } else {
        toast.error(data.error || "Failed to like comment")
      }
    } catch (err) {
      console.log("error liking the comment", err)
      toast.error("An error occurred while liking the comment")
    }
  }

  return (
    <div>
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <div>
        {comments.map((c) => (
          <div key={c._id || c.id}>
            <Image
              src={c.user?.avatar}
              alt={c.user?.username || "user"}
              width={40}
              height={40}
              loading="lazy"
            />
            <strong>{c.user?.username}</strong>
            <div>
              <p>{c.text}</p>
              <Button onClick={() => handleLike(c._id)}>Like</Button>
              <span>{c.likes}</span>
            </div>
          </div>
        ))}
        {comments.length === 0 && <div>Be the first to comment!</div>}
      </div>
    </div>
  )
}

export default React.memo(CommentSection)