import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bug, Warning, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function BuggyPage() {
  const [disappearingText, setDisappearingText] = useState('Click me!')
  const [randomId, setRandomId] = useState('')
  const [slowLoadVisible, setSlowLoadVisible] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [detachedElement, setDetachedElement] = useState(false)

  useEffect(() => {
    setRandomId(`input-${Math.random().toString(36).substr(2, 9)}`)
    
    setTimeout(() => {
      setSlowLoadVisible(true)
    }, 3000)
  }, [])

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
