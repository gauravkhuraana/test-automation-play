import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { 
  Clock, 
  ArrowsClockwise, 
  Eye, 
  SortAscending,
  Pencil,
  WifiHigh,
  Database
} from '@phosphor-icons/react'

interface TableRow {
  id: string
  name: string
  value: number
  status: 'active' | 'inactive' | 'pending'
  lastUpdated: string
}

interface ApiData {
  id: string
  title: string
  description: string
  timestamp: string
}

export default function ComplexScenarios() {
  const [delayedElements, setDelayedElements] = useState<{visible: boolean, content: string}[]>([])
  const [retryCount, setRetryCount] = useState(0)
  const [retryStatus, setRetryStatus] = useState<'idle' | 'retrying' | 'success' | 'failed'>('idle')
  const [hiddenElementsVisible, setHiddenElementsVisible] = useState(false)
  const [tableData, setTableData] = useState<TableRow[]>([
    { id: '1', name: 'Element A', value: 100, status: 'active', lastUpdated: new Date().toISOString() },
    { id: '2', name: 'Element B', value: 250, status: 'inactive', lastUpdated: new Date().toISOString() },
    { id: '3', name: 'Element C', value: 150, status: 'pending', lastUpdated: new Date().toISOString() },
    { id: '4', name: 'Element D', value: 300, status: 'active', lastUpdated: new Date().toISOString() }
  ])
  const [sortField, setSortField] = useState<keyof TableRow>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingCell, setEditingCell] = useState<{rowId: string, field: keyof TableRow} | null>(null)
  const [editValue, setEditValue] = useState('')
  const [apiData, setApiData] = useState<ApiData[]>([])
  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const [wsMessages, setWsMessages] = useState<string[]>([])
  const [pollingData, setPollingData] = useState<{count: number, lastUpdate: string}>({
    count: 0,
    lastUpdate: new Date().toISOString()
  })
  const [isPolling, setIsPolling] = useState(false)
  const pollingInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  // Simulate delayed element loading
  useEffect(() => {
    const timeouts = [
      setTimeout(() => {
        setDelayedElements(prev => [...prev, { visible: true, content: 'Element loaded after 2s' }])
      }, 2000),
      setTimeout(() => {
        setDelayedElements(prev => [...prev, { visible: true, content: 'Element loaded after 4s' }])
      }, 4000),
      setTimeout(() => {
        setDelayedElements(prev => [...prev, { visible: true, content: 'Element loaded after 6s' }])
      }, 6000)
    ]

    return () => timeouts.forEach(timeout => clearTimeout(timeout))
  }, [])

  // Simulate WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setWsConnected(true)
      toast.success('WebSocket connected (simulated)')
      
      // Simulate receiving messages
      const messageInterval = setInterval(() => {
        const messages = [
          'Real-time update: User joined',
          'Real-time update: Data synced',
          'Real-time update: Status changed',
          'Real-time update: New notification'
        ]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        setWsMessages(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${randomMessage}`])
      }, 5000)

      return () => {
        clearInterval(messageInterval)
        setWsConnected(false)
      }
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [])

  const handleRetryOperation = async () => {
    setRetryStatus('retrying')
    setRetryCount(prev => prev + 1)
    
    // Simulate API call with failure rate
    const success = Math.random() > 0.4 // 60% success rate
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (success) {
      setRetryStatus('success')
      toast.success(`Operation succeeded on attempt ${retryCount + 1}`)
    } else {
      setRetryStatus('failed')
      toast.error(`Operation failed on attempt ${retryCount + 1}`)
    }
  }

  const toggleHiddenElements = () => {
    setHiddenElementsVisible(!hiddenElementsVisible)
  }

  const sortTable = (field: keyof TableRow) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(direction)
    
    setTableData(prev => [...prev].sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
      }
    }))
  }

  const startEdit = (rowId: string, field: keyof TableRow) => {
    const row = tableData.find(r => r.id === rowId)
    if (row) {
      setEditingCell({ rowId, field })
      setEditValue(String(row[field]))
    }
  }

  const saveEdit = () => {
    if (!editingCell) return
    
    setTableData(prev => prev.map(row => {
      if (row.id === editingCell.rowId) {
        const updatedRow = { ...row, [editingCell.field]: editValue }
        if (editingCell.field !== 'lastUpdated') {
          updatedRow.lastUpdated = new Date().toISOString()
        }
        return updatedRow
      }
      return row
    }))
    
    setEditingCell(null)
    setEditValue('')
    toast.success('Cell updated successfully')
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const loadApiData = async () => {
    setIsLoadingApi(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newData: ApiData[] = Array.from({ length: 5 }, (_, i) => ({
      id: `api-${Date.now()}-${i}`,
      title: `API Item ${i + 1}`,
      description: `This is dynamically loaded content from API call`,
      timestamp: new Date().toISOString()
    }))
    
    setApiData(newData)
    setIsLoadingApi(false)
    toast.success('API data loaded successfully')
  }

  const startPolling = () => {
    if (isPolling) return
    
    setIsPolling(true)
    pollingInterval.current = setInterval(() => {
      setPollingData(prev => ({
        count: prev.count + 1,
        lastUpdate: new Date().toISOString()
      }))
    }, 3000)
    
    toast.info('Polling started (every 3 seconds)')
  }

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
    }
    setIsPolling(false)
    toast.info('Polling stopped')
  }

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Delayed Loading Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Delayed Loading
            </CardTitle>
            <CardDescription>Elements that load with different delays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {delayedElements.length === 0 && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" data-testid="skeleton-1" />
                  <Skeleton className="h-4 w-3/4" data-testid="skeleton-2" />
                  <Skeleton className="h-4 w-1/2" data-testid="skeleton-3" />
                </div>
              )}
              
              {delayedElements.map((element, index) => (
                <div 
                  key={index}
                  className="p-2 bg-green-50 border border-green-200 rounded animate-in fade-in duration-500"
                  data-testid={`delayed-element-${index + 1}`}
                >
                  {element.content}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Loaded: {delayedElements.length}/3 elements
            </div>
          </CardContent>
        </Card>

        {/* Retry/Failover Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowsClockwise className="w-5 h-5" />
              Retry Logic
            </CardTitle>
            <CardDescription>Simulate failures and retry mechanisms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={handleRetryOperation}
                disabled={retryStatus === 'retrying'}
                className="w-full"
                data-testid="retry-button"
              >
                {retryStatus === 'retrying' ? 'Retrying...' : 'Try Operation'}
              </Button>
              
              <div className="text-center">
                <Badge 
                  variant={
                    retryStatus === 'success' ? 'default' : 
                    retryStatus === 'failed' ? 'destructive' : 
                    retryStatus === 'retrying' ? 'secondary' : 'outline'
                  }
                  data-testid="retry-status"
                >
                  {retryStatus === 'idle' ? 'Ready' : retryStatus}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground text-center" data-testid="retry-count">
                Attempts: {retryCount}
              </div>
              
              {retryStatus === 'retrying' && (
                <Progress value={50} className="w-full" data-testid="retry-progress" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hidden Elements & Overlays */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Hidden Elements
            </CardTitle>
            <CardDescription>Elements that can be shown/hidden dynamically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={toggleHiddenElements}
              variant="outline"
              className="w-full"
              data-testid="toggle-hidden-elements"
            >
              {hiddenElementsVisible ? 'Hide Elements' : 'Show Hidden Elements'}
            </Button>
            
            {hiddenElementsVisible && (
              <div className="space-y-2">
                <div 
                  className="p-3 bg-blue-50 border border-blue-200 rounded animate-in slide-in-from-top duration-300"
                  data-testid="hidden-element-1"
                >
                  Hidden Element 1 (Now Visible)
                </div>
                <div 
                  className="p-3 bg-purple-50 border border-purple-200 rounded animate-in slide-in-from-left duration-500"
                  data-testid="hidden-element-2"
                >
                  Hidden Element 2 (Animated)
                </div>
                <div 
                  className="relative p-3 bg-yellow-50 border border-yellow-200 rounded"
                  data-testid="overlay-container"
                >
                  Element with Overlay
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded">
                    <Badge variant="secondary" data-testid="overlay-badge">Overlay Active</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sortable Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SortAscending className="w-5 h-5" />
            Dynamic Sortable Table
          </CardTitle>
          <CardDescription>Click headers to sort, click cells to edit</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => sortTable('name')}
                  data-testid="sort-name"
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => sortTable('value')}
                  data-testid="sort-value"
                >
                  Value {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => sortTable('status')}
                  data-testid="sort-status"
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map(row => (
                <TableRow key={row.id} data-testid={`table-row-${row.id}`}>
                  <TableCell 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => startEdit(row.id, 'name')}
                    data-testid={`cell-name-${row.id}`}
                  >
                    {editingCell?.rowId === row.id && editingCell?.field === 'name' ? (
                      <div className="flex gap-1">
                        <Input 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8"
                          data-testid={`edit-input-${row.id}`}
                        />
                        <Button size="sm" onClick={saveEdit} data-testid={`save-${row.id}`}>✓</Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit} data-testid={`cancel-${row.id}`}>✗</Button>
                      </div>
                    ) : (
                      <>
                        {row.name}
                        <Pencil className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                      </>
                    )}
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => startEdit(row.id, 'value')}
                    data-testid={`cell-value-${row.id}`}
                  >
                    {editingCell?.rowId === row.id && editingCell?.field === 'value' ? (
                      <div className="flex gap-1">
                        <Input 
                          type="number"
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8"
                        />
                        <Button size="sm" onClick={saveEdit}>✓</Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>✗</Button>
                      </div>
                    ) : (
                      row.value
                    )}
                  </TableCell>
                  <TableCell data-testid={`cell-status-${row.id}`}>
                    <Badge 
                      variant={
                        row.status === 'active' ? 'default' : 
                        row.status === 'inactive' ? 'secondary' : 'outline'
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(row.lastUpdated).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setTableData(prev => prev.filter(r => r.id !== row.id))
                        toast.success('Row deleted')
                      }}
                      data-testid={`delete-row-${row.id}`}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API-Driven Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5" />
            API-Driven Dynamic Content
          </CardTitle>
          <CardDescription>Content loaded from simulated API calls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={loadApiData}
            disabled={isLoadingApi}
            data-testid="load-api-data"
          >
            {isLoadingApi ? 'Loading...' : 'Load API Data'}
          </Button>
          
          {isLoadingApi && (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}
          
          {apiData.length > 0 && !isLoadingApi && (
            <div className="space-y-2">
              {apiData.map(item => (
                <div 
                  key={item.id}
                  className="p-3 border rounded-md"
                  data-testid={`api-item-${item.id}`}
                >
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Loaded: {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <WifiHigh className="w-5 h-5" />
            Real-time Updates
          </CardTitle>
          <CardDescription>WebSocket simulation and polling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                WebSocket Messages
                <Badge variant={wsConnected ? 'default' : 'secondary'} data-testid="ws-status">
                  {wsConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto" data-testid="ws-messages">
                {wsMessages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Waiting for messages...</p>
                ) : (
                  wsMessages.map((message, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      {message}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Polling Data</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    onClick={startPolling}
                    disabled={isPolling}
                    size="sm"
                    data-testid="start-polling"
                  >
                    Start Polling
                  </Button>
                  <Button 
                    onClick={stopPolling}
                    disabled={!isPolling}
                    size="sm"
                    variant="outline"
                    data-testid="stop-polling"
                  >
                    Stop Polling
                  </Button>
                </div>
                
                <div className="p-2 bg-muted rounded">
                  <div className="text-sm" data-testid="polling-count">
                    Count: {pollingData.count}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid="polling-time">
                    Last Update: {new Date(pollingData.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
                
                {isPolling && (
                  <Badge variant="secondary" data-testid="polling-status">
                    Polling Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}