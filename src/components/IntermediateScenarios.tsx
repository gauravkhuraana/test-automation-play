import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Calendar as CalendarIcon, Upload, Download } from '@phosphor-icons/react'

export default function IntermediateScenarios() {
  const [dragItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4'])
  const [dropZoneItems, setDropZoneItems] = useState<string[]>([])
  const [sliderValue, setSliderValue] = useState([50])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [autoCompleteInput, setAutoCompleteInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const suggestions = [
    'Selenium WebDriver',
    'Playwright',
    'Cypress', 
    'TestCafe',
    'WebDriver.IO',
    'Puppeteer',
    'Nightwatch',
    'Protractor'
  ]

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(autoCompleteInput.toLowerCase())
  )

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const item = e.dataTransfer.getData('text/plain')
    if (!dropZoneItems.includes(item)) {
      setDropZoneItems(prev => [...prev, item])
      toast.success(`Dropped ${item} successfully!`)
    }
  }

  const removeFromDropZone = (item: string) => {
    setDropZoneItems(prev => prev.filter(i => i !== item))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            toast.success(`File ${file.name} uploaded successfully!`)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob(['This is a sample file for download testing.'], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'sample-download.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('File downloaded successfully!')
  }

  const handleContextMenu = (e: React.MouseEvent, item: string) => {
    e.preventDefault()
    toast.info(`Context menu for ${item}`)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setAutoCompleteInput(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Drag & Drop */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Drag & Drop</CardTitle>
            <CardDescription>Drag items from left to right zone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Source Items</Label>
              <div className="mt-2 space-y-2">
                {dragItems.map(item => (
                  <div
                    key={item}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="p-2 bg-primary/10 rounded cursor-move hover:bg-primary/20 transition-colors"
                    data-testid={`drag-item-${item.toLowerCase().replace(' ', '-')}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Drop Zone</Label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="mt-2 min-h-[100px] p-4 border-2 border-dashed border-muted-foreground/25 rounded-md bg-muted/50"
                data-testid="drop-zone"
              >
                {dropZoneItems.length === 0 ? (
                  <p className="text-muted-foreground text-center">Drop items here</p>
                ) : (
                  <div className="space-y-2">
                    {dropZoneItems.map(item => (
                      <div 
                        key={item} 
                        className="flex items-center justify-between p-2 bg-background rounded"
                        data-testid={`dropped-item-${item.toLowerCase().replace(' ', '-')}`}
                      >
                        <span>{item}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFromDropZone(item)}
                          data-testid={`remove-${item.toLowerCase().replace(' ', '-')}`}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sliders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sliders</CardTitle>
            <CardDescription>Range and value sliders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Value: {sliderValue[0]}%</Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
                data-testid="percentage-slider"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Volume Control</Label>
              <Slider
                defaultValue={[30]}
                max={100}
                step={5}
                className="w-full"
                data-testid="volume-slider"
              />
            </div>

            <div className="space-y-2">
              <Label>Range Slider (20-80)</Label>
              <Slider
                defaultValue={[20, 80]}
                max={100}
                step={1}
                className="w-full"
                data-testid="range-slider"
              />
            </div>

            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm" data-testid="slider-display">
                Current value: {sliderValue[0]}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File Upload & Download */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Operations</CardTitle>
            <CardDescription>Upload and download file handling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>File Upload</Label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="file-input"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
                data-testid="upload-button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} data-testid="upload-progress" />
                <p className="text-sm text-muted-foreground" data-testid="upload-status">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>File Download</Label>
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="w-full"
                data-testid="download-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Date Pickers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date Pickers</CardTitle>
            <CardDescription>Calendar and date selection components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                    data-testid="date-picker-trigger"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toDateString() : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" data-testid="date-picker-content">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date Input</Label>
              <Input 
                type="date" 
                data-testid="date-input"
              />
            </div>

            <div className="space-y-2">
              <Label>DateTime Input</Label>
              <Input 
                type="datetime-local" 
                data-testid="datetime-input"
              />
            </div>

            {selectedDate && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm" data-testid="selected-date-display">
                  Selected: {selectedDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mouse Hover & Context Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mouse Interactions</CardTitle>
            <CardDescription>Hover effects and context menus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hover Items</Label>
              {['Hover Item 1', 'Hover Item 2', 'Hover Item 3'].map(item => (
                <div
                  key={item}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="p-3 border rounded-md transition-all hover:shadow-md hover:bg-primary/5"
                  data-testid={`hover-item-${item.split(' ')[2]}`}
                >
                  <span>{item}</span>
                  {hoveredItem === item && (
                    <span className="ml-2 text-primary" data-testid={`hover-indicator-${item.split(' ')[2]}`}>
                      (Hovered!)
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Context Menu Items</Label>
              {['Right-click Item 1', 'Right-click Item 2'].map(item => (
                <div
                  key={item}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className="p-3 border rounded-md cursor-context-menu hover:bg-muted/50"
                  data-testid={`context-item-${item.split(' ')[2]}`}
                >
                  {item} (Right-click me)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auto-suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auto-suggestions</CardTitle>
            <CardDescription>Search with dynamic suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Framework</Label>
              <div className="relative">
                <Input
                  value={autoCompleteInput}
                  onChange={(e) => {
                    setAutoCompleteInput(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => autoCompleteInput && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Type to search..."
                  data-testid="autocomplete-input"
                />
                
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div 
                    className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
                    data-testid="suggestions-dropdown"
                  >
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={suggestion}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="p-2 hover:bg-muted cursor-pointer"
                        data-testid={`suggestion-${index}`}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {autoCompleteInput && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm" data-testid="autocomplete-result">
                  Selected: {autoCompleteInput}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress & Loading States */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress & Loading States</CardTitle>
          <CardDescription>Various progress indicators and loading states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Linear Progress</Label>
              <Progress value={75} data-testid="linear-progress" />
              <p className="text-sm text-muted-foreground">75% Complete</p>
            </div>
            
            <div className="space-y-2">
              <Label>Dynamic Progress</Label>
              <Progress value={sliderValue[0]} data-testid="dynamic-progress" />
              <p className="text-sm text-muted-foreground">{sliderValue[0]}% Complete</p>
            </div>

            <div className="space-y-2">
              <Label>Loading Button</Label>
              <Button disabled className="w-full" data-testid="loading-button">
                Loading... 
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy/Paste Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Copy/Paste Detection</CardTitle>
          <CardDescription>Detect copy and paste operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Copy Text Below</Label>
            <div 
              className="p-3 bg-muted rounded-md select-all cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText('Test automation sample text')
                toast.success('Text copied to clipboard!')
              }}
              data-testid="copy-text"
            >
              Test automation sample text (Click to copy)
            </div>
          </div>

          <div className="space-y-2">
            <Label>Paste Area</Label>
            <Input
              placeholder="Paste content here..."
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('text')
                toast.info(`Pasted: ${pastedText}`)
              }}
              data-testid="paste-input"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}