"use server"

import { cookies } from "next/headers"

const BASE_URL = "https://api.github.com/"

// #region getUserRepoInfo

export interface GitUserRepoResponse {
  owner: User
  open_issues_count: number
  name: string
}

interface RepoInfoData {
  data?: GitUserRepoResponse
  error?: string
}

interface RepoInfo {
  userRepo: string
  userName: string
}

async function getUserRepoInfo({ userRepo, userName }: RepoInfo): Promise<RepoInfoData> {
  if (!userRepo || !userName) {
    return { error: "Please fill both fields" }
  }

  // TeodorTodorovJP
  // git-issues-viewer
  const response = await fetch(`${BASE_URL}repos/${userName}/${userRepo}`, {
    next: { revalidate: 10 },
  })

  const responseData = await response.json()

  if (responseData.message) {
    return { error: `Getting Repo failed: ${responseData.message}` }
  }

  const data = responseData as any as GitUserRepoResponse

  return {
    data: {
      owner: {
        id: data?.owner.id,
        login: data?.owner.login,
        avatar_url: data?.owner?.avatar_url,
      },
      name: data.name,
      open_issues_count: data?.open_issues_count,
    },
  }
}

// #region getUserRepoIssuesData

interface RepoIssuesData {
  data?: GitUserRepoIssuesResponse[]
  error?: string
}

export interface RepoIssues {
  userRepo: string
  userName: string
}
async function getUserRepoIssuesData({ userRepo, userName }: RepoIssues): Promise<RepoIssuesData> {
  if (!userRepo || !userName) {
    return { error: "Please fill both fields" }
  }

  // TeodorTodorovJP
  // git-issues-viewer
  const response = await fetch(`${BASE_URL}repos/${userName}/${userRepo}/issues`, {
    next: { revalidate: 10 },
  })

  const responseData = await response.json()

  if (responseData.message) {
    return { error: responseData.message }
  }
  const data = responseData as any as GitUserRepoIssuesResponse[]

  const mappedData = data
    .filter((issue) => issue.state == "open")
    .map((issue) => {
      return {
        user: {
          id: issue.user.id,
          login: issue.user.login,
          avatar_url: issue.user.avatar_url,
        },
        id: issue.id,
        title: issue.title,
        state: issue.state,
        number: issue.number,
        assignee: issue.assignee,
      } as GitUserRepoIssuesResponse
    })

  return {
    data: mappedData,
  }
}

// #region getUserRepoIssues

export interface UserRepoData {
  repoData?: GitUserRepoResponse
  issues?: GitUserRepoIssuesResponse[]
  error?: string
}

export interface GitUserRepoIssuesResponse {
  user: User
  id: number
  number: number // It acts as the id of the issue, used to fetch data for specific issue
  title: string
  state: string
  assignee?: User
}

export interface UserRepo {
  userRepo: string
  userName: string
}

export async function getUserRepoIssues({ userRepo, userName }: UserRepo): Promise<UserRepoData> {
  "use server"
  if (!userRepo || !userName) {
    return { error: "Please fill both fields" }
  }

  // First we check if the user exists. The endpoint provides some data, but not all we need.
  const checkUser = await checkUserExistsOnGit({ userName })

  if (checkUser.error) return { error: `Getting user failed: ${checkUser.error}` }

  // Then we check attempt to get the repo for that user.
  const repoInfo = await getUserRepoInfo({ userRepo, userName })

  // If the user does not have repo named that way
  if (repoInfo.error) return { error: repoInfo.error }

  // If the user does have that repo, but there are no issues for it
  if (repoInfo.data && repoInfo.data.open_issues_count < 1) return { error: "No open issues to display!" }

  // If all the above pass successfully, then we can get the data we need
  const repoIssuesInfo = await getUserRepoIssuesData({ userRepo, userName })

  if (repoIssuesInfo.error) return { error: repoIssuesInfo.error }

  setCookies({ repo: userRepo, name: userName })

  return {
    repoData: repoInfo.data,
    issues: repoIssuesInfo.data,
  }
}

// #region getUserRepoIssueComments

interface User {
  id: number
  login: string
  avatar_url: string
}

interface RepoIssuesCommentsData {
  data?: GitUserRepoIssuesCommentsResponse[]
  error?: string
}

export interface GitUserRepoIssuesCommentsResponse {
  user: User
  id: number
  body: string
  author_association: string
  updated_at: string
}

export interface RepoComments {
  userRepo: string
  userName: string
  number: string
}

export async function getUserRepoIssueComments({ userRepo, userName, number }: RepoComments): Promise<RepoIssuesCommentsData> {
  if (!userRepo || !userName) {
    return { error: "Please fill both fields" }
  }

  // TeodorTodorovJP
  // git-issues-viewer
  const response = await fetch(`${BASE_URL}repos/${userName}/${userRepo}/issues/${number}/comments`, {
    next: { revalidate: 10 },
  })

  const responseData = await response.json()

  // https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api?apiVersion=2022-11-28#validation-failed
  // "errors" is expected if the fetch fails
  // The error is not used to prevent data leak in case the error returns sensitive data
  if (responseData.errors || responseData.message) {
    return { error: "Failed to load issues of repository" }
  }
  const data = responseData as any as GitUserRepoIssuesCommentsResponse[]

  const mappedData = data.map((comment) => {
    return {
      user: {
        id: comment.user.id,
        login: comment.user.login,
        avatar_url: comment.user.avatar_url,
      },
      id: comment.id,
      body: comment.body,
      author_association: comment.author_association,
      updated_at: comment.updated_at,
    } as GitUserRepoIssuesCommentsResponse
  })

  return {
    data: mappedData,
  }
}

// #region checkUserExistsOnGit
// https://api.github.com/users/TeodorTodorovJP
interface CheckUser {
  error?: string
}
async function checkUserExistsOnGit({ userName }: { userName: string }): Promise<CheckUser> {
  if (!userName) {
    return { error: "Please provide a git user name" }
  }

  // TeodorTodorovJP
  // git-issues-viewer
  const response = await fetch(`${BASE_URL}users/${userName}`, {
    next: { revalidate: 10 },
  })

  const responseData = await response.json()

  if (responseData.message) {
    return { error: responseData.message }
  } else {
    return {}
  }
}

// #region getCookies
interface Cookies {
  repo: string | null
  name: string | null
}
export async function getCookies(): Promise<Cookies> {
  const cookieStore = cookies()

  let name = null
  let repo = null

  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name == "userName") name = cookie.value
    if (cookie.name == "userRepo") repo = cookie.value
  })

  return {
    name,
    repo,
  }
}

// #region setCookies
interface Cookies {
  repo: string | null
  name: string | null
}
export async function setCookies({ repo, name }: Cookies): Promise<Cookies> {
  "use server"
  cookies().set("userRepo", repo ? repo : "", { maxAge: 3600 })
  cookies().set("userName", name ? name : "", { maxAge: 3600 })

  return {
    name,
    repo,
  }
}
