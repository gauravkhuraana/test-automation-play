import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface User {
  email: string
  name: string
  password: string
}

export default function BuggyPageNew() {
  const [searchParams] = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userCreatedMsg, setUserCreatedMsg] = useState(false)
  const [userDeletedMsg, setUserDeletedMsg] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [userDetailsVisible, setUserDetailsVisible] = useState(false)
  const [editingUserEmail, setEditingUserEmail] = useState('')

  const saveUsers = useCallback((newUsers: User[]) => {
    localStorage.setItem('buggy-users', JSON.stringify(newUsers))
  }, [])

  const init = useCallback(() => {
    // Handle ?reset=true URL parameter
    if (searchParams.get('reset') === 'true') {
      localStorage.removeItem('buggy-users')
      localStorage.removeItem('buggy-session')
      setUsers([])
      setCurrentUser(null)
      return
    }

    // Load from localStorage
    const storedUsers = localStorage.getItem('buggy-users')
    const storedSession = localStorage.getItem('buggy-session')
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession))
    }
  }, [searchParams])

  useEffect(() => {
    init()
  }, [init])

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    const emailInput = document.getElementById('email') as HTMLInputElement
    const nameInput = document.getElementById('name') as HTMLInputElement
    const passwordInput = document.getElementById('password') as HTMLInputElement
    
    const email = emailInput?.value
    const name = nameInput?.value
    const password = passwordInput?.value

    if (!email || !name || !password) return

    if (users.find(u => u.email === email)) {
      alert('User already exists')
      return
    }

    const newUsers = [...users, { email, name, password }]
    setUsers(newUsers)
    saveUsers(newUsers)

    // Show success message
    setUserCreatedMsg(true)
    setTimeout(() => setUserCreatedMsg(false), 3000)

    // Clear form
    emailInput.value = ''
    nameInput.value = ''
    passwordInput.value = ''
  }

  const handleClearForm = () => {
    const emailInput = document.getElementById('email') as HTMLInputElement
    const nameInput = document.getElementById('name') as HTMLInputElement
    const passwordInput = document.getElementById('password') as HTMLInputElement
    
    if (emailInput) emailInput.value = ''
    if (nameInput) nameInput.value = ''
    if (passwordInput) passwordInput.value = ''
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const emailInput = document.getElementById('login-email') as HTMLInputElement
    const passwordInput = document.getElementById('login-password') as HTMLInputElement
    
    const email = emailInput?.value
    const password = passwordInput?.value

    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('buggy-session', JSON.stringify(user))
    } else {
      alert('Invalid credentials')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('buggy-session')
  }

  const deleteUserByEmail = (email: string) => {
    const newUsers = users.filter(u => u.email !== email)
    setUsers(newUsers)
    saveUsers(newUsers)
    
    // If deleted user is logged in, log them out
    if (currentUser?.email === email) {
      handleLogout()
    }

    setUserDeletedMsg(true)
    setTimeout(() => setUserDeletedMsg(false), 3000)
  }

  const handleDeleteUser = () => {
    const searchInput = document.getElementById('search-email') as HTMLInputElement
    const email = searchInput?.value
    if (email) {
      deleteUserByEmail(email)
    }
  }

  const editUserByEmail = (email: string) => {
    const user = users.find(u => u.email === email)
    if (user) {
      const editNameInput = document.getElementById('edit-name') as HTMLInputElement
      if (editNameInput) editNameInput.value = user.name
      setEditingUserEmail(email)
      setUserDetailsVisible(true)
    }
  }

  const handleEditUser = () => {
    const searchInput = document.getElementById('search-email') as HTMLInputElement
    const email = searchInput?.value
    if (email) {
      editUserByEmail(email)
    }
  }

  const handleSaveUser = () => {
    const editNameInput = document.getElementById('edit-name') as HTMLInputElement
    const newName = editNameInput?.value
    
    if (newName && editingUserEmail) {
      const newUsers = users.map(u => 
        u.email === editingUserEmail ? { ...u, name: newName } : u
      )
      setUsers(newUsers)
      saveUsers(newUsers)
      
      // Update current user if editing themselves
      if (currentUser?.email === editingUserEmail) {
        const updatedUser = { ...currentUser, name: newName }
        setCurrentUser(updatedUser)
        localStorage.setItem('buggy-session', JSON.stringify(updatedUser))
      }
      
      setUpdateSuccess(true)
      setUserDetailsVisible(false)
      setTimeout(() => setUpdateSuccess(false), 3000)
    }
  }

  const handleCloseDetails = () => {
    setUserDetailsVisible(false)
    setEditingUserEmail('')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Buggy Page</h1>
        <p className="text-muted-foreground mb-8">
          Demonstrates State (S) and Filesystem (F) issues — shared state, parallel test pollution, race conditions.
        </p>

        {/* User Count Display */}
        <div id="user-count" className="text-xl font-semibold mb-6">
          {users.length} users
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create User Form */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form id="create-form" onSubmit={handleCreateUser} className="space-y-4">
              <input
                id="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                id="name"
                type="text"
                placeholder="Name"
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                id="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  id="create-user-btn"
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Create User
                </button>
                <button
                  id="clear-form-btn"
                  type="button"
                  onClick={handleClearForm}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
                >
                  Clear
                </button>
              </div>
            </form>
            <div
              id="user-created-msg"
              style={{ display: userCreatedMsg ? 'block' : 'none' }}
              className="mt-4 p-2 bg-green-100 text-green-800 rounded"
            >
              User created successfully!
            </div>
          </div>

          {/* Login Form */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            {!currentUser ? (
              <form id="login-form" onSubmit={handleLogin} className="space-y-4">
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded"
                />
                <button
                  id="login-btn"
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Login
                </button>
              </form>
            ) : (
              <div style={{ display: 'none' }}>
                <form id="login-form">
                  <input id="login-email" type="email" />
                  <input id="login-password" type="password" />
                  <button id="login-btn" type="submit">Login</button>
                </form>
              </div>
            )}

            <div
              id="welcome-message"
              style={{ display: currentUser ? 'block' : 'none' }}
              className="mt-4 p-4 bg-green-100 text-green-800 rounded"
            >
              Welcome, <span id="user-name">{currentUser?.name}</span>!
            </div>
            
            <button
              id="logout-btn"
              style={{ display: currentUser ? 'block' : 'none' }}
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 bg-secondary text-secondary-foreground rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search and Manage Users */}
        <div id="user-management" className="mt-8 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          <div className="flex gap-2">
            <input
              id="search-email"
              type="email"
              placeholder="Search by email"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              id="edit-user-btn"
              onClick={handleEditUser}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
            >
              Edit
            </button>
            <button
              id="delete-user-btn"
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
            >
              Delete
            </button>
          </div>
        </div>

        <div
          id="user-deleted-msg"
          style={{ display: userDeletedMsg ? 'block' : 'none' }}
          className="mt-4 p-2 bg-red-100 text-red-800 rounded"
        >
          User deleted successfully!
        </div>

        <div
          id="update-success"
          style={{ display: updateSuccess ? 'block' : 'none' }}
          className="mt-4 p-2 bg-green-100 text-green-800 rounded"
        >
          User updated successfully!
        </div>

        {/* User Details Modal */}
        <div
          id="user-details"
          style={{ display: userDetailsVisible ? 'block' : 'none' }}
          data-email={editingUserEmail}
          className="mt-8 border rounded-lg p-6 bg-muted"
        >
          <h3 className="text-lg font-semibold mb-4">User Details</h3>
          <input
            id="edit-name"
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <div className="flex gap-2">
            <button
              id="save-btn"
              onClick={handleSaveUser}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Save
            </button>
            <button
              id="close-details"
              onClick={handleCloseDetails}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
            >
              Close
            </button>
          </div>
        </div>

        {/* User List */}
        <div id="user-list" className="mt-8 space-y-2">
          {users.map(user => (
            <div
              key={user.email}
              className="user-row flex items-center justify-between p-4 border rounded"
              data-email={user.email}
            >
              <div>
                <span className="user-name font-medium">{user.name}</span>
                <span className="user-email text-muted-foreground ml-4">{user.email}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="delete-btn px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm"
                  aria-label={`Delete ${user.name}`}
                  onClick={() => deleteUserByEmail(user.email)}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                  aria-label={`Edit ${user.name}`}
                  onClick={() => editUserByEmail(user.email)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
