import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface User {
  email: string
  name: string
  password: string
}

export default function BuggyDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const storedSession = localStorage.getItem('buggy-session')
    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession))
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div
          id="dashboard-content"
          style={{ display: currentUser ? 'block' : 'none' }}
        >
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            Welcome back, <span id="user-name">{currentUser?.name}</span>!
          </p>
          <p className="text-muted-foreground">This is your personal dashboard.</p>
        </div>

        <div
          id="not-authenticated"
          style={{ display: !currentUser ? 'block' : 'none' }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">
            Please <Link to="/buggy" className="text-primary hover:underline">login</Link> to access the dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
