"use client"

import { useSearchParams } from "next/navigation"
import CommentsTable from "./CommentsTable"
import { ReactElement, useEffect, useMemo, useState } from "react"
import { getUserRepoIssueComments, GitUserRepoIssuesCommentsResponse, RepoComments } from "../actions"
import Comment from "./Comment"

const Comments = () => {
  const searchParams = useSearchParams()
  const userRepo = searchParams.get("userRepo")
  const userName = searchParams.get("userName")
  const number = searchParams.get("number")
  const assigneeId = searchParams.get("assigneeId")

  const [comments, setComments] = useState<GitUserRepoIssuesCommentsResponse[] | null>(null)
  const [commentsElements, setCommentsElements] = useState<ReactElement[] | null>(null)

  useEffect(() => {
    const data = { userRepo, userName, number } as RepoComments
    getUserRepoIssueComments(data).then((data) => {
      if (data.error) {
      } else if (data.data) {
        // array of comments
        setComments(data.data)
      }
    })
  }, [userRepo, userName, number])

  useMemo(() => {
    if (comments && comments.length > 1) {
      setCommentsElements(() => {
        return comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} assigneeId={assigneeId!} />
        })
      })
    }
  }, [comments, assigneeId])

  // Passing commentsElements, an array of Comment instances as children
  // That way they don't become client components and stay server components
  return <CommentsTable>{commentsElements}</CommentsTable>
}

export default Comments
