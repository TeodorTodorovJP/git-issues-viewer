"use client"

import { FormEvent, useEffect, useState } from "react"
import { getCookies, getUserRepoIssues, setCookies, UserRepoData } from "./actions"
import IssueItems from "./_components/IssueItems"

// Handles the user input, getting the data through a server action and setting cookies
export default function IssuesForm() {
  const [userRepo, setUserRepo] = useState<null | string>(null)
  const [userName, setUserName] = useState<null | string>(null)

  const [errorState, setErrorState] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const [issuesElements, setIssuesElements] = useState<null | UserRepoData>(null)

  // Used for the form submission
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()
    handleSubmit(userRepo, userName)
  }

  // Handles the submit from the form and if the user reloads the browser/website and there cookies to use
  const handleSubmit = async (userRepoP: string | null, userNameP: string | null) => {
    setLoading(true)

    if (!userRepoP || !userNameP) {
      setErrorState("Fill all fields!")
      setLoading(false)
      return
    }

    const data = { userRepo: userRepoP, userName: userNameP }

    // Using the server action to get the data
    const { error, issues, repoData } = await getUserRepoIssues(data)
    setErrorState(() => (error ? error : null))
    if (error) {
      setLoading(false)
      return
    }

    setIssuesElements(() => {
      if (issues && repoData) {
        return { issues, repoData }
      } else {
        return null
      }
    })

    // At this point we know that userRepo and userName are valid
    // So we store them as the latest successful request
    setCookies({ repo: userRepoP, name: userNameP })

    setLoading(false)
  }

  // Load values from cookies when the component mounts
  useEffect(() => {
    getCookies().then(({ name, repo }) => {
      if (repo) setUserRepo(repo)
      if (name) setUserName(name)

      if (repo && name) {
        // If we have both fields, auto call it to display the result
        handleSubmit(repo, name)
      }
    })
    // Did not add dependencies on purpose.
    // If the array is removed, it will render on every rerender which is bad
    // If I add handleSubmit as dependency it will require useCallback which would require dependencies on it's own
    // This will make the logic a lot more complex. So I ignore this warning.
  }, [])

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
          <div className="sm:col-span-3">
            <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">
              Git User Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="userName"
                onChange={(e) => setUserName(e.target.value)}
                id="userName"
                value={userName ? userName : ""}
                autoComplete="TeodorTodorovJP"
                placeholder="TeodorTodorovJP"
                className=" px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="userRepo" className="block text-sm font-medium leading-6 text-gray-900">
              Repo Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="userRepo"
                onChange={(e) => setUserRepo(e.target.value)}
                id="userRepo"
                value={userRepo ? userRepo : ""}
                autoComplete="git-issues-viewer"
                placeholder="git-issues-viewer"
                className=" px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "disabled:bg-slate-500" : ""
            }  rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          >
            Get Repo Info
          </button>
        </div>

        {errorState ? <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 mt-4">{errorState}</div> : null}
      </form>

      <IssueItems userRepoData={issuesElements} />
    </>
  )
}
