import React from "react"
import { GitUserRepoIssuesCommentsResponse } from "../actions"
import Image from "next/image"

const Comment = ({ comment, assigneeId }: { comment: GitUserRepoIssuesCommentsResponse; assigneeId: string }) => {
  const byAssignee = comment.user.id === Number(assigneeId)
  const timeStamp = new Date(comment.updated_at).toLocaleDateString()

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <Image className="w-full h-full rounded-full" src={comment.user.avatar_url} alt="" width={100} height={100} />
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">{comment.user.login}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{byAssignee ? "Assignee" : "Contributor"}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{timeStamp}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{comment.body}</p>
      </td>
    </tr>
  )
}

export default Comment
