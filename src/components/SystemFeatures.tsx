import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  MapPin, 
  Bell, 
  Cookie, 
  Globe, 
  Database,
  Translate
} from '@phosphor-icons/react'

export default function SystemFeatures() {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useKV('selected-language', 'en')
  const [localStorage] = useState(() => {
    return {
      getItem: (key: string) => window.localStorage.getItem(key),
      setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
      removeItem: (key: string) => window.localStorage.removeItem(key),
      clear: () => window.localStorage.clear()
    }
  })
  const [sessionStorage] = useState(() => {
    return {
      getItem: (key: string) => window.sessionStorage.getItem(key),
      setItem: (key: string, value: string) => window.sessionStorage.setItem(key, value),
      removeItem: (key: string) => window.sessionStorage.removeItem(key),
      clear: () => window.sessionStorage.clear()
    }
  })
  const [storedData, setStoredData] = useState({
    local: '',
    session: '',
    cookie: ''
  })

  const languages = {
    en: { name: 'English', greeting: 'Hello, welcome to our platform!' },
    es: { name: 'Español', greeting: '¡Hola, bienvenido a nuestra plataforma!' },
    fr: { name: 'Français', greeting: 'Bonjour, bienvenue sur notre plateforme!' },
    de: { name: 'Deutsch', greeting: 'Hallo, willkommen auf unserer Plattform!' },
    zh: { name: '中文', greeting: '您好，欢迎来到我们的平台！' }
  }

  useEffect(() => {
    // Check if notifications are already granted
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    // Load existing storage data
    setStoredData({
      local: localStorage.getItem('test-data') || '',
      session: sessionStorage.getItem('test-data') || '',
      cookie: getCookie('test-data')
    })
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
        setLocationError('')
        toast.success('Location obtained successfully!')
      },
      (error) => {
        setLocationError(error.message)
        toast.error(`Location error: ${error.message}`)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }

  const mockLocation = () => {
    // Mock location for testing purposes
    const mockCoords = {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lon: -122.4194 + (Math.random() - 0.5) * 0.1
    }
    setLocation(mockCoords)
    setLocationError('')
    toast.success('Mock location set!')
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications')
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationsEnabled(permission === 'granted')
    
    if (permission === 'granted') {
      toast.success('Notifications enabled!')
    } else {
      toast.error('Notification permission denied')
    }
  }

  const sendTestNotification = () => {
    if (!notificationsEnabled) {
      toast.error('Notifications are not enabled')
      return
    }

    new Notification('Test Automation Notification', {
      body: 'This is a test notification for automation testing',
      icon: '/favicon.ico',
      tag: 'test-notification'
    })
  }

  const sendPushNotification = () => {
    // Simulate push notification
    if (notificationsEnabled) {
      setTimeout(() => {
        new Notification('Push Notification', {
          body: 'This simulates a push notification from the server',
          icon: '/favicon.ico',
          tag: 'push-notification'
        })
      }, 2000)
      toast.info('Push notification will arrive in 2 seconds...')
    } else {
      toast.error('Please enable notifications first')
    }
  }

  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const getCookie = (name: string): string => {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return ''
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  const setLocalStorageData = () => {
    const testData = `Local data set at ${new Date().toLocaleString()}`
    localStorage.setItem('test-data', testData)
    setStoredData(prev => ({ ...prev, local: testData }))
    toast.success('Local storage data set!')
  }

  const setSessionStorageData = () => {
    const testData = `Session data set at ${new Date().toLocaleString()}`
    sessionStorage.setItem('test-data', testData)
    setStoredData(prev => ({ ...prev, session: testData }))
    toast.success('Session storage data set!')
  }

  const setCookieData = () => {
    const testData = `Cookie data set at ${new Date().toLocaleString()}`
    setCookie('test-data', testData)
    setStoredData(prev => ({ ...prev, cookie: testData }))
    toast.success('Cookie data set!')
  }

  const clearAllStorage = () => {
    localStorage.removeItem('test-data')
    sessionStorage.removeItem('test-data')
    deleteCookie('test-data')
    setStoredData({ local: '', session: '', cookie: '' })
    toast.success('All storage data cleared!')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Geolocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Geolocation
            </CardTitle>
            <CardDescription>Browser location services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={requestLocation}
                variant="outline"
                className="w-full"
                data-testid="request-location"
              >
                Request Real Location
              </Button>
              
              <Button 
                onClick={mockLocation}
                variant="outline"
                className="w-full"
                data-testid="mock-location"
              >
                Use Mock Location
              </Button>
            </div>

            {location && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800" data-testid="location-display">
                  <strong>Latitude:</strong> {location.lat.toFixed(6)}<br />
                  <strong>Longitude:</strong> {location.lon.toFixed(6)}
                </p>
              </div>
            )}

            {locationError && (
              <Alert>
                <AlertDescription data-testid="location-error">
                  {locationError}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Browser Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Browser notification system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <Switch
                id="notifications-enabled"
                checked={notificationsEnabled}
                onCheckedChange={requestNotificationPermission}
                data-testid="notifications-toggle"
              />
            </div>

            <div className="space-y-2">
              <Button 
                onClick={sendTestNotification}
                disabled={!notificationsEnabled}
                variant="outline"
                className="w-full"
                data-testid="send-notification"
              >
                Send Test Notification
              </Button>
              
              <Button 
                onClick={sendPushNotification}
                disabled={!notificationsEnabled}
                variant="outline"
                className="w-full"
                data-testid="send-push-notification"
              >
                Send Push Notification
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Status: {notificationsEnabled ? (
                <Badge variant="default" data-testid="notification-status">Enabled</Badge>
              ) : (
                <Badge variant="secondary" data-testid="notification-status">Disabled</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Multi-language Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Translate className="w-5 h-5" />
              Multi-language
            </CardTitle>
            <CardDescription>Runtime language switching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Language</Label>
              <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                <SelectTrigger data-testid="language-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languages).map(([code, lang]) => (
                    <SelectItem key={code} value={code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm" data-testid="translated-greeting">
                {languages[currentLanguage as keyof typeof languages]?.greeting}
              </p>
            </div>

            <div className="text-xs text-muted-foreground" data-testid="current-language">
              Current: {languages[currentLanguage as keyof typeof languages]?.name} ({currentLanguage})
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5" />
            Storage Management
          </CardTitle>
          <CardDescription>Local storage, session storage, and cookies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Local Storage</h4>
              <Button 
                onClick={setLocalStorageData}
                variant="outline"
                className="w-full"
                data-testid="set-local-storage"
              >
                Set Local Data
              </Button>
              <div className="p-2 bg-muted rounded text-xs" data-testid="local-storage-data">
                {storedData.local || 'No data'}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Session Storage</h4>
              <Button 
                onClick={setSessionStorageData}
                variant="outline"
                className="w-full"
                data-testid="set-session-storage"
              >
                Set Session Data
              </Button>
              <div className="p-2 bg-muted rounded text-xs" data-testid="session-storage-data">
                {storedData.session || 'No data'}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Cookies</h4>
              <Button 
                onClick={setCookieData}
                variant="outline"
                className="w-full"
                data-testid="set-cookie"
              >
                Set Cookie Data
              </Button>
              <div className="p-2 bg-muted rounded text-xs" data-testid="cookie-data">
                {storedData.cookie || 'No data'}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={clearAllStorage}
              variant="destructive"
              className="w-full"
              data-testid="clear-all-storage"
            >
              Clear All Storage Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cookie className="w-5 h-5" />
            Cookie Management
          </CardTitle>
          <CardDescription>Advanced cookie operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Session Cookie</h4>
              <Button 
                onClick={() => {
                  setCookie('session-cookie', 'session-value', 0)
                  toast.success('Session cookie set!')
                }}
                variant="outline"
                className="w-full"
                data-testid="set-session-cookie"
              >
                Set Session Cookie
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Persistent Cookie</h4>
              <Button 
                onClick={() => {
                  setCookie('persistent-cookie', 'persistent-value', 30)
                  toast.success('Persistent cookie set (30 days)!')
                }}
                variant="outline"
                className="w-full"
                data-testid="set-persistent-cookie"
              >
                Set Persistent Cookie
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Secure Cookie</h4>
              <Button 
                onClick={() => {
                  document.cookie = `secure-cookie=secure-value; secure; samesite=strict; path=/`
                  toast.success('Secure cookie set!')
                }}
                variant="outline"
                className="w-full"
                data-testid="set-secure-cookie"
              >
                Set Secure Cookie
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">HttpOnly Simulation</h4>
              <Button 
                onClick={() => {
                  // Can't actually set HttpOnly from JS, but simulate the concept
                  setCookie('httponly-sim', 'httponly-value', 7)
                  toast.info('HttpOnly cookie simulated!')
                }}
                variant="outline"
                className="w-full"
                data-testid="set-httponly-cookie"
              >
                Simulate HttpOnly
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">All Cookies</h4>
            <div className="p-3 bg-muted rounded-md font-mono text-xs" data-testid="all-cookies">
              {document.cookie || 'No cookies set'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Browser Information
          </CardTitle>
          <CardDescription>Browser capabilities and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">User Agent</h4>
              <div className="p-2 bg-muted rounded text-xs font-mono" data-testid="user-agent">
                {navigator.userAgent}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Browser Features</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Geolocation:</span>
                  <Badge variant={navigator.geolocation ? 'default' : 'secondary'} data-testid="geolocation-support">
                    {navigator.geolocation ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Notifications:</span>
                  <Badge variant={'Notification' in window ? 'default' : 'secondary'} data-testid="notification-support">
                    {'Notification' in window ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Local Storage:</span>
                  <Badge variant={typeof Storage !== 'undefined' ? 'default' : 'secondary'} data-testid="storage-support">
                    {typeof Storage !== 'undefined' ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Workers:</span>
                  <Badge variant={'serviceWorker' in navigator ? 'default' : 'secondary'} data-testid="serviceworker-support">
                    {'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Screen Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Screen Resolution:</span>
                <div data-testid="screen-resolution">
                  {screen.width} × {screen.height}
                </div>
              </div>
              <div>
                <span className="font-medium">Available Screen:</span>
                <div data-testid="available-screen">
                  {screen.availWidth} × {screen.availHeight}
                </div>
              </div>
              <div>
                <span className="font-medium">Viewport Size:</span>
                <div data-testid="viewport-size">
                  {window.innerWidth} × {window.innerHeight}
                </div>
              </div>
              <div>
                <span className="font-medium">Color Depth:</span>
                <div data-testid="color-depth">
                  {screen.colorDepth} bits
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}