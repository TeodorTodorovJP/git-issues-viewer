import React from "react"
import { UserRepoData } from "../actions"
import IssueItem from "./IssueItem"

const IssueItems = ({ userRepoData }: { userRepoData: UserRepoData | null }) => {
  if (!userRepoData || !userRepoData.issues || !userRepoData.repoData) {
    return <p>No issues to display</p>
  }

  if (userRepoData.issues.length < 1) {
    return <p>No issues to display</p>
  }

  const { issues, repoData } = userRepoData

  return (
    <ul role="list" className="divide-y divide-gray-100 mt-4 sm:w-full md:w-96 flex flex-col gap-5 ">
      {issues.map((issue) => {
        return <IssueItem key={issue.id} issueInfo={issue} repoData={repoData} />
      })}
    </ul>
  )
}

export default IssueItems
