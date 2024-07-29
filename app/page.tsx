import IssuesForm from "./IssuesForm"

// This is the only server side component
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-center">Get detailed information about your repo</h1>

      <IssuesForm />
    </main>
  )
}
