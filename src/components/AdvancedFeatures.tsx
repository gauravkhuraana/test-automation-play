import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Monitor, Warning, ChartBar, PaintBrush } from '@phosphor-icons/react'

export default function AdvancedFeatures() {
  const [dynamicId, setDynamicId] = useState(`element-${Date.now()}`)
  const [chartData] = useState([
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }
  ])
  const [canvasPoints, setCanvasPoints] = useState<{x: number, y: number}[]>([])
  const [scrollItems] = useState(Array.from({length: 50}, (_, i) => `Item ${i + 1}`))
  const [visibleItems, setVisibleItems] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Simulate infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const itemText = entry.target.textContent
            if (itemText && !visibleItems.includes(itemText)) {
              setVisibleItems(prev => [...prev, itemText])
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    const items = document.querySelectorAll('[data-scroll-item]')
    items.forEach(item => observer.observe(item))

    return () => observer.disconnect()
  }, [visibleItems])

  // Canvas drawing
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCanvasPoints(prev => [...prev, {x, y}])

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#2563eb'
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setCanvasPoints([])
      }
    }
  }

  const openNewWindow = () => {
    const newWindow = window.open('', '_blank', 'width=600,height=400')
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>New Window for Testing</title></head>
          <body>
            <h1>New Window</h1>
            <p>This is a new window for automation testing.</p>
            <button id="close-window" onclick="window.close()">Close Window</button>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const regenerateId = () => {
    setDynamicId(`element-${Date.now()}`)
  }

  const showAlert = () => {
    alert('This is a browser alert for testing')
  }

  const showConfirm = () => {
    const result = confirm('Do you want to continue?')
    toast.info(`Confirm result: ${result}`)
  }

  const showPrompt = () => {
    const result = prompt('Enter your name:')
    if (result) {
      toast.info(`Prompt result: ${result}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* iFrames */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">iFrames</CardTitle>
            <CardDescription>Embedded content and nested frames</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline">Single iFrame</Badge>
              <iframe
                src="data:text/html;charset=utf-8,%3Chtml%3E%3Cbody%3E%3Cp%3EThis%20is%20content%20inside%20an%20iframe%3C/p%3E%3Cbutton%20id%3D%22iframe-button%22%3EiFrame%20Button%3C/button%3E%3C/body%3E%3C/html%3E"
                className="w-full h-32 border rounded"
                title="Test iFrame"
                data-testid="single-iframe"
              />
            </div>

            <div className="space-y-2">
              <Badge variant="outline">Nested iFrame</Badge>
              <iframe
                src="data:text/html;charset=utf-8,%3Chtml%3E%3Cbody%3E%3Cp%3ENested%20iFrame%20Container%3C/p%3E%3Ciframe%20src%3D%22data%3Atext/html%3Bcharset%3Dutf-8%2C%253Chtml%253E%253Cbody%253E%253Cp%253ENested%2520Content%253C/p%253E%253C/body%253E%253C/html%253E%22%20style%3D%22width%3A100%25%3B%20height%3A50px%3B%22%3E%3C/iframe%3E%3C/body%3E%3C/html%3E"
                className="w-full h-32 border rounded"
                title="Nested iFrame"
                data-testid="nested-iframe"
              />
            </div>
          </CardContent>
        </Card>

        {/* Shadow DOM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shadow DOM</CardTitle>
            <CardDescription>Encapsulated DOM elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline">Shadow Root Element</Badge>
              <div id="shadow-host" data-testid="shadow-host" className="p-4 border rounded">
                <p>Shadow DOM Host Element</p>
              </div>
            </div>

            <Button 
              onClick={() => {
                const host = document.getElementById('shadow-host')
                if (host && !host.shadowRoot) {
                  const shadow = host.attachShadow({mode: 'open'})
                  shadow.innerHTML = `
                    <style>
                      .shadow-content { 
                        padding: 10px; 
                        background: #f0f0f0; 
                        border-radius: 4px;
                      }
                    </style>
                    <div class="shadow-content">
                      <p>This is inside Shadow DOM</p>
                      <button id="shadow-button">Shadow Button</button>
                    </div>
                  `
                }
              }}
              data-testid="create-shadow-dom"
            >
              Create Shadow DOM
            </Button>
          </CardContent>
        </Card>

        {/* Multiple Windows */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Multiple Windows</CardTitle>
            <CardDescription>New windows and tabs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={openNewWindow}
              variant="outline"
              className="w-full"
              data-testid="open-new-window"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Open New Window
            </Button>

            <Button 
              onClick={() => window.open('https://example.com', '_blank')}
              variant="outline"
              className="w-full"
              data-testid="open-new-tab"
            >
              Open New Tab
            </Button>

            <Button 
              onClick={() => {
                const newTab = window.open('', '_blank')
                if (newTab) {
                  newTab.document.write(`
                    <html>
                      <head><title>Tab ${Date.now()}</title></head>
                      <body>
                        <h1>Tab Content</h1>
                        <input id="tab-input" placeholder="Type in this tab" />
                        <button onclick="window.close()">Close Tab</button>
                      </body>
                    </html>
                  `)
                  newTab.document.close()
                }
              }}
              variant="outline"
              className="w-full"
              data-testid="open-tab-with-input"
            >
              Open Tab with Input
            </Button>
          </CardContent>
        </Card>

        {/* Pop-ups and Modals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pop-ups & Modals</CardTitle>
            <CardDescription>Alerts, confirms, and custom modals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={showAlert}
                variant="outline"
                data-testid="show-alert"
              >
                Show Alert
              </Button>

              <Button 
                onClick={showConfirm}
                variant="outline"
                data-testid="show-confirm"
              >
                Show Confirm
              </Button>

              <Button 
                onClick={showPrompt}
                variant="outline"
                data-testid="show-prompt"
              >
                Show Prompt
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="show-custom-modal">
                    Show Custom Modal
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="custom-modal">
                  <DialogHeader>
                    <DialogTitle>Custom Modal</DialogTitle>
                    <DialogDescription>
                      This is a custom modal for testing purposes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Modal content for automation testing.</p>
                    <Button data-testid="modal-action-button">
                      Modal Action
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic IDs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dynamic IDs</CardTitle>
            <CardDescription>Elements with changing identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline">Current ID: {dynamicId}</Badge>
              <div 
                id={dynamicId}
                className="p-3 border rounded bg-muted/50"
                data-testid="dynamic-id-element"
              >
                Element with Dynamic ID
              </div>
            </div>

            <Button 
              onClick={regenerateId}
              data-testid="regenerate-id"
            >
              Regenerate ID
            </Button>

            <div className="space-y-2">
              <Badge variant="outline">Dynamic Classes</Badge>
              <div 
                className={`p-2 border rounded transition-colors ${Math.random() > 0.5 ? 'bg-blue-50' : 'bg-green-50'}`}
                data-testid="dynamic-class-element"
              >
                Element with Dynamic Classes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Toast Notifications</CardTitle>
            <CardDescription>Various notification types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => toast.success('Success message')}
                variant="outline"
                data-testid="toast-success"
              >
                Success Toast
              </Button>

              <Button 
                onClick={() => toast.error('Error message')}
                variant="outline"
                data-testid="toast-error"
              >
                Error Toast
              </Button>

              <Button 
                onClick={() => toast.info('Info message')}
                variant="outline"
                data-testid="toast-info"
              >
                Info Toast
              </Button>

              <Button 
                onClick={() => toast.warning('Warning message')}
                variant="outline"
                data-testid="toast-warning"
              >
                Warning Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Graphs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Charts & Graphs</CardTitle>
          <CardDescription>Data visualization components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-2">Bar Chart</Badge>
              <div className="space-y-2" data-testid="bar-chart">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{item.name}</span>
                    <div className="flex-1 bg-muted rounded">
                      <div 
                        className="bg-primary h-6 rounded flex items-center justify-end pr-2 text-white text-xs transition-all"
                        style={{ width: `${(item.value / 800) * 100}%` }}
                        data-testid={`bar-${index}`}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Badge variant="outline" className="mb-2">Line Chart Simulation</Badge>
              <div className="space-y-2" data-testid="line-chart">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.name}</span>
                    <Badge variant={item.value > 500 ? 'default' : 'secondary'}>
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Drawing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Canvas Drawing</CardTitle>
          <CardDescription>Interactive drawing area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline">Click to draw</Badge>
              <Button 
                onClick={clearCanvas}
                size="sm"
                variant="outline"
                data-testid="clear-canvas"
              >
                Clear Canvas
              </Button>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              onClick={handleCanvasClick}
              className="border rounded cursor-crosshair w-full max-w-md"
              style={{ height: '200px' }}
              data-testid="drawing-canvas"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Points drawn: {canvasPoints.length}
          </div>
        </CardContent>
      </Card>

      {/* Infinite Scroll */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Infinite Scroll</CardTitle>
          <CardDescription>Lazy loading content</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            ref={scrollRef}
            className="h-64 overflow-y-auto border rounded p-4 space-y-2"
            data-testid="infinite-scroll-container"
          >
            {scrollItems.map((item, index) => (
              <div 
                key={item}
                data-scroll-item
                className="p-2 border rounded hover:bg-muted/50"
                data-testid={`scroll-item-${index}`}
              >
                {item}
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-muted-foreground">
            Visible items: {visibleItems.length}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hidden Elements</CardTitle>
          <CardDescription>Elements with various visibility states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Badge variant="outline">Hidden with display:none</Badge>
            <div style={{ display: 'none' }} data-testid="display-none-element">
              This element is hidden with display:none
            </div>
            <p className="text-sm text-muted-foreground">Element above is hidden</p>
          </div>

          <div className="space-y-2">
            <Badge variant="outline">Hidden with visibility:hidden</Badge>
            <div style={{ visibility: 'hidden' }} data-testid="visibility-hidden-element">
              This element is hidden with visibility:hidden
            </div>
            <p className="text-sm text-muted-foreground">Element above is invisible</p>
          </div>

          <div className="space-y-2">
            <Badge variant="outline">Hidden with opacity:0</Badge>
            <div style={{ opacity: 0 }} data-testid="opacity-hidden-element">
              This element is hidden with opacity:0
            </div>
            <p className="text-sm text-muted-foreground">Element above is transparent</p>
          </div>

          <div className="space-y-2">
            <Badge variant="outline">Off-screen element</Badge>
            <div 
              style={{ position: 'absolute', left: '-9999px' }} 
              data-testid="offscreen-element"
            >
              This element is positioned off-screen
            </div>
            <p className="text-sm text-muted-foreground">Element is positioned off-screen</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}