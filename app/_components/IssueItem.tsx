import { GitUserRepoIssuesResponse, GitUserRepoResponse } from "../actions"
import Image from "next/image"
import defaultProfileImg from "../default-profile-image.jpg"
import Link from "next/link"

const IssueItem = ({ issueInfo, repoData }: { issueInfo: GitUserRepoIssuesResponse; repoData: GitUserRepoResponse }) => {
  const { title, assignee, number } = issueInfo

  const {
    owner: { login },
    name,
  } = repoData

  return (
    <div className="h-44 p-6 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out delay-150 hover:-translate-y-1">
      <Link
        className="mb-2 text-2xl font-medium text-blue-600 dark:text-blue-500 hover:underline"
        href={{ pathname: "/comments", query: { userRepo: name, userName: login, number, assigneeId: assignee?.id } }}
      >
        {title}
      </Link>

      <div className="flex min-w-0 gap-x-4 items-center">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{assignee ? `Assigned to:` : "Not assigned"}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{assignee ? `${assignee?.login}` : null}</p>
        </div>
        <Image
          src={assignee ? assignee?.avatar_url : defaultProfileImg}
          priority={assignee ? true : false}
          alt="Profile image of the git user that created the issue"
          className="rounded-full"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}

export default IssueItem
