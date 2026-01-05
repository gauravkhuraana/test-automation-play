import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bug, Warning, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface FlakesUser {
  email: string
  name: string
  password: string
}

export default function BuggyPage() {
  const [searchParams] = useSearchParams()
  const [disappearingText, setDisappearingText] = useState('Click me!')
  const [randomId, setRandomId] = useState('')
  const [slowLoadVisible, setSlowLoadVisible] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [detachedElement, setDetachedElement] = useState(false)

  // FLAKES Demo state
  const [users, setUsers] = useState<FlakesUser[]>([])
  const [currentFlakesUser, setCurrentFlakesUser] = useState<FlakesUser | null>(null)
  const [userCreatedMsg, setUserCreatedMsg] = useState(false)
  const [userDeletedMsg, setUserDeletedMsg] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [userDetailsVisible, setUserDetailsVisible] = useState(false)
  const [editingUserEmail, setEditingUserEmail] = useState('')

  const saveUsers = useCallback((newUsers: FlakesUser[]) => {
    localStorage.setItem('buggy-users', JSON.stringify(newUsers))
  }, [])

  const init = useCallback(() => {
    // Handle ?reset=true URL parameter
    if (searchParams.get('reset') === 'true') {
      localStorage.removeItem('buggy-users')
      localStorage.removeItem('buggy-session')
      setUsers([])
      setCurrentFlakesUser(null)
      return
    }

    // Load from localStorage
    const storedUsers = localStorage.getItem('buggy-users')
    const storedSession = localStorage.getItem('buggy-session')
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
    if (storedSession) {
      setCurrentFlakesUser(JSON.parse(storedSession))
    }
  }, [searchParams])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    setRandomId(`input-${Math.random().toString(36).substr(2, 9)}`)
    
    setTimeout(() => {
      setSlowLoadVisible(true)
    }, 3000)
  }, [])

  // FLAKES Demo handlers
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

  const handleFlakesLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const emailInput = document.getElementById('login-email') as HTMLInputElement
    const passwordInput = document.getElementById('login-password') as HTMLInputElement
    
    const email = emailInput?.value
    const password = passwordInput?.value

    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setCurrentFlakesUser(user)
      localStorage.setItem('buggy-session', JSON.stringify(user))
    } else {
      alert('Invalid credentials')
    }
  }

  const handleFlakesLogout = () => {
    setCurrentFlakesUser(null)
    localStorage.removeItem('buggy-session')
  }

  const deleteUserByEmail = (email: string) => {
    const newUsers = users.filter(u => u.email !== email)
    setUsers(newUsers)
    saveUsers(newUsers)
    
    // If deleted user is logged in, log them out
    if (currentFlakesUser?.email === email) {
      handleFlakesLogout()
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
      if (currentFlakesUser?.email === editingUserEmail) {
        const updatedUser = { ...currentFlakesUser, name: newName }
        setCurrentFlakesUser(updatedUser)
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

  const handleDisappearingClick = () => {
    setDisappearingText('I disappeared!')
    setTimeout(() => {
      setDisappearingText('Click me!')
    }, 500)
  }

  const handleDoubleClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount + 1 >= 2) {
      toast.success('Double click detected!')
      setClickCount(0)
    }
  }

  const handleDetachedSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDetachedElement(true)
    setTimeout(() => {
      setDetachedElement(false)
      toast.error('Element was detached and re-attached!')
    }, 100)
  }

  const handleOverlayButton = () => {
    setOverlayVisible(true)
    setTimeout(() => {
      setOverlayVisible(false)
      toast.success('You clicked through the overlay!')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Buggy Page</h2>
        <p className="text-muted-foreground">
          Practice handling common automation bugs and challenges
        </p>
      </div>

      {/* FLAKES Demo Section - State (S) and Filesystem (F) issues */}
      <Card className="border-2 border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-lg">🎯 FLAKES Demo - State & Filesystem Issues</CardTitle>
          <CardDescription>Shared state, parallel test pollution, race conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* User Count Display */}
            <div id="user-count" className="text-xl font-semibold">
              {users.length} users
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Create User Form */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Create User</h4>
                <form id="create-form" onSubmit={handleCreateUser} className="space-y-3">
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
                  className="mt-3 p-2 bg-green-100 text-green-800 rounded"
                >
                  User created successfully!
                </div>
              </div>

              {/* Login Form */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Login</h4>
                {!currentFlakesUser ? (
                  <form id="login-form" onSubmit={handleFlakesLogin} className="space-y-3">
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
                  style={{ display: currentFlakesUser ? 'block' : 'none' }}
                  className="mt-3 p-3 bg-green-100 text-green-800 rounded"
                >
                  Welcome, <span id="user-name">{currentFlakesUser?.name}</span>!
                </div>
                
                <button
                  id="logout-btn"
                  style={{ display: currentFlakesUser ? 'block' : 'none' }}
                  onClick={handleFlakesLogout}
                  className="mt-3 w-full px-4 py-2 bg-secondary text-secondary-foreground rounded"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Search and Manage Users */}
            <div id="user-management" className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Manage Users</h4>
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
              className="p-2 bg-red-100 text-red-800 rounded"
            >
              User deleted successfully!
            </div>

            <div
              id="update-success"
              style={{ display: updateSuccess ? 'block' : 'none' }}
              className="p-2 bg-green-100 text-green-800 rounded"
            >
              User updated successfully!
            </div>

            {/* User Details Modal */}
            <div
              id="user-details"
              style={{ display: userDetailsVisible ? 'block' : 'none' }}
              data-email={editingUserEmail}
              className="border rounded-lg p-4 bg-muted"
            >
              <h4 className="font-medium mb-3">User Details</h4>
              <input
                id="edit-name"
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border rounded mb-3"
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
            <div id="user-list" className="space-y-2">
              {users.map(user => (
                <div
                  key={user.email}
                  className="user-row flex items-center justify-between p-3 border rounded"
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

            {/* Dashboard Section (shown when logged in) */}
            <div
              id="dashboard-content"
              style={{ display: currentFlakesUser ? 'block' : 'none' }}
              className="border rounded-lg p-4 bg-muted"
            >
              <h4 className="font-medium mb-2">Dashboard</h4>
              <p className="text-muted-foreground">
                Welcome back, <span id="dashboard-user-name">{currentFlakesUser?.name}</span>!
              </p>
              <p className="text-sm text-muted-foreground">This is your personal dashboard.</p>
            </div>

            <div
              id="not-authenticated"
              style={{ display: !currentFlakesUser ? 'block' : 'none' }}
              className="text-center py-4"
            >
              <p className="text-muted-foreground">
                Please <Link to="/buggy" className="text-primary hover:underline">login</Link> to access the dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Dynamic IDs</CardTitle>
            </div>
            <CardDescription>
              Element ID changes on every page load
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={randomId}>Username (ID changes each load)</Label>
              <Input 
                id={randomId}
                placeholder="Try selecting by ID..."
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Current ID: <code className="bg-muted px-1 rounded">{randomId}</code>
              </p>
            </div>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Use data-testid, aria-label, or other stable selectors instead
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Stale Element Reference</CardTitle>
            </div>
            <CardDescription>
              Element gets removed and re-added to DOM
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!detachedElement ? (
              <form onSubmit={handleDetachedSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="detached-input">Type something</Label>
                  <Input 
                    id="detached-input"
                    data-testid="detached-input"
                    placeholder="This element will detach on submit"
                    className="mt-2"
                  />
                </div>
                <Button type="submit" data-testid="detach-submit">
                  Submit (Causes Detachment)
                </Button>
              </form>
            ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground">Re-rendering...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Race Condition</CardTitle>
            </div>
            <CardDescription>
              Button text changes faster than you can click
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDisappearingClick}
              variant="outline"
              className="w-full"
              data-testid="disappearing-button"
            >
              {disappearingText}
            </Button>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Text changes quickly - automation needs proper waits
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Delayed Loading</CardTitle>
            </div>
            <CardDescription>
              Element appears after 3 seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!slowLoadVisible ? (
              <div className="h-20 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded">
                <p className="text-muted-foreground text-sm">Loading...</p>
              </div>
            ) : (
              <div 
                className="h-20 flex items-center justify-center bg-primary/10 rounded"
                data-testid="delayed-element"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-primary" />
                  <p className="text-primary font-medium">Element Loaded!</p>
                </div>
              </div>
            )}
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Wait for element visibility before interacting
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Overlapping Elements</CardTitle>
            </div>
            <CardDescription>
              Element covered by overlay temporarily
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button 
              onClick={handleOverlayButton}
              className="w-full"
              data-testid="overlay-button"
              disabled={overlayVisible}
            >
              Click Me (Shows Overlay)
            </Button>
            {overlayVisible && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded z-10">
                <p className="text-sm text-muted-foreground">Overlay blocking element...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Double Click Required</CardTitle>
            </div>
            <CardDescription>
              Must be clicked twice quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDoubleClick}
              variant="secondary"
              className="w-full"
              data-testid="double-click-button"
            >
              Click Twice (Count: {clickCount})
            </Button>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Some actions require double-click or rapid succession clicks
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Hidden Input Field</CardTitle>
            </div>
            <CardDescription>
              Input is in DOM but not visible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                className="absolute opacity-0 pointer-events-none"
                data-testid="hidden-input"
                id="hidden-input"
                value="I'm hidden but in the DOM"
                readOnly
              />
              <div className="p-4 border-2 border-dashed border-muted rounded">
                <p className="text-sm text-muted-foreground">
                  Hidden input exists in DOM but opacity: 0
                </p>
              </div>
            </div>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Check element visibility before asserting element doesn't exist
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Disabled Button</CardTitle>
            </div>
            <CardDescription>
              Button appears clickable but is disabled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              disabled
              className="w-full"
              data-testid="disabled-button"
            >
              I Look Normal But I'm Disabled
            </Button>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Always check if elements are enabled before clicking
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Duplicate IDs</CardTitle>
            </div>
            <CardDescription>
              Multiple elements with the same ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input id="duplicate-id" placeholder="First input with duplicate ID" />
              <Input id="duplicate-id" placeholder="Second input with duplicate ID" />
            </div>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                IDs should be unique - use data-testid or other selectors
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Element Outside Viewport</CardTitle>
            </div>
            <CardDescription>
              Element requires scrolling to interact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 overflow-y-auto border rounded p-4 space-y-4">
              <p className="text-sm text-muted-foreground">Scroll down to find the button...</p>
              <div className="h-48"></div>
              <Button 
                className="w-full"
                data-testid="scroll-to-button"
                onClick={() => toast.success('You scrolled and clicked!')}
              >
                Hidden Button at Bottom
              </Button>
            </div>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Element must be scrolled into view before interaction
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Whitespace in Text</CardTitle>
            </div>
            <CardDescription>
              Text contains extra spaces and line breaks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded">
              <p data-testid="whitespace-text">
                    This text has    
                extra   whitespace   
                and line breaks
              </p>
            </div>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Use trim() and normalize whitespace when comparing text
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="text-destructive" size={20} />
              <CardTitle className="text-lg">Case Sensitivity</CardTitle>
            </div>
            <CardDescription>
              Attribute values have inconsistent casing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                data-action="Submit"
                className="w-full"
                variant="outline"
              >
                Action: Submit
              </Button>
              <Button 
                data-action="CANCEL"
                className="w-full"
                variant="outline"
              >
                Action: CANCEL
              </Button>
              <Button 
                data-action="delete"
                className="w-full"
                variant="outline"
              >
                Action: delete
              </Button>
            </div>
            <Alert>
              <Warning className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Use case-insensitive selectors or normalize before comparing
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Common Automation Pitfalls</CardTitle>
          <CardDescription>
            Best practices to avoid these issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Badge variant="destructive">Don't</Badge>
                Bad Practices
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Relying on dynamic IDs</li>
                <li>• Using fixed sleep/waits</li>
                <li>• Not checking element state</li>
                <li>• Ignoring stale element errors</li>
                <li>• Assuming instant page loads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Badge className="bg-green-500">Do</Badge>
                Best Practices
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use data-testid attributes</li>
                <li>• Implement smart waits</li>
                <li>• Verify element state before action</li>
                <li>• Handle stale elements gracefully</li>
                <li>• Wait for element visibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
