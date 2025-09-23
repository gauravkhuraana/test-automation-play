import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestTube, Mouse, Lightning, Building, Globe, Cpu } from '@phosphor-icons/react'
import BasicElements from './components/BasicElements'
import IntermediateScenarios from './components/IntermediateScenarios'
import AdvancedFeatures from './components/AdvancedFeatures'
import BusinessFlows from './components/BusinessFlows'
import SystemFeatures from './components/SystemFeatures'
import ComplexScenarios from './components/ComplexScenarios'

function App() {
  const [activeTab, setActiveTab] = useState("overview")

  const categories = [
    {
      id: "basic",
      title: "Basic Elements", 
      icon: TestTube,
      description: "Fundamental form controls and basic interactions",
      scenarios: ["Text inputs", "Dropdowns", "Radio buttons", "Checkboxes", "Buttons", "Links"],
      difficulty: "Beginner"
    },
    {
      id: "intermediate", 
      title: "Intermediate UI",
      icon: Mouse,
      description: "Complex user interactions and dynamic behaviors",
      scenarios: ["Drag & drop", "File upload", "Date pickers", "Sliders", "Hover menus", "Auto-suggestions"],
      difficulty: "Intermediate"
    },
    {
      id: "advanced",
      title: "Advanced Features",
      icon: Lightning,
      description: "Challenging scenarios that break many automation scripts",
      scenarios: ["iFrames", "Shadow DOM", "Multiple windows", "Dynamic IDs", "Canvas", "Charts"],
      difficulty: "Advanced"
    },
    {
      id: "business",
      title: "Business Flows", 
      icon: Building,
      description: "End-to-end user journeys and complete workflows",
      scenarios: ["User registration", "E-commerce checkout", "Search & filters", "Profile management"],
      difficulty: "Intermediate"
    },
    {
      id: "system",
      title: "System Features",
      icon: Globe,
      description: "Browser APIs and system-level functionality",
      scenarios: ["Geolocation", "Notifications", "Storage", "Multi-language", "Cookies"],
      difficulty: "Advanced"
    },
    {
      id: "complex",
      title: "Complex Scenarios",
      icon: Cpu,
      description: "Real-time updates and challenging edge cases",
      scenarios: ["Delayed loading", "WebSocket updates", "Retry logic", "Hidden elements", "API-driven content"],
      difficulty: "Expert"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-orange-100 text-orange-800"
      case "Expert": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <TestTube size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Test Automation Practice Hub</h1>
              <p className="text-muted-foreground">Master Selenium, Playwright, Cypress & more</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="complex">Complex</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => setActiveTab(category.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon size={24} className="text-primary" />
                        <Badge className={getDifficultyColor(category.difficulty)}>
                          {category.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {category.scenarios.slice(0, 4).map((scenario, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {scenario}
                          </Badge>
                        ))}
                        {category.scenarios.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.scenarios.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>About This Practice Hub</CardTitle>
                <CardDescription>
                  A comprehensive training ground for test automation engineers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This website contains every common scenario you'll encounter in real-world test automation projects. 
                  Each section is designed to challenge different aspects of your automation framework, from basic element 
                  interactions to complex business workflows.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">🎯 Perfect for:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Learning automation frameworks</li>
                      <li>• Testing framework capabilities</li>
                      <li>• Interview preparation</li>
                      <li>• Debugging automation issues</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🔧 Supported Tools:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Selenium WebDriver</li>
                      <li>• Playwright</li>
                      <li>• Cypress</li>
                      <li>• TestCafe & others</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="basic">
            <BasicElements />
          </TabsContent>

          <TabsContent value="intermediate">
            <IntermediateScenarios />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedFeatures />
          </TabsContent>

          <TabsContent value="business">
            <BusinessFlows />
          </TabsContent>

          <TabsContent value="system">
            <SystemFeatures />
          </TabsContent>

          <TabsContent value="complex">
            <ComplexScenarios />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App