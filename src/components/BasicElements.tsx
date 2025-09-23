import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  bio: string
  country: string
  gender: string
  newsletter: boolean
  terms: boolean
  notifications: boolean
}

export default function BasicElements() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    country: '',
    gender: '',
    newsletter: false,
    terms: false,
    notifications: false
  })

  const [buttonStates, setButtonStates] = useState({
    enabled: true,
    disabled: false,
    loading: false
  })

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDynamicButton = () => {
    setButtonStates(prev => ({ ...prev, loading: true }))
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, loading: false, disabled: !prev.disabled }))
    }, 2000)
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      bio: '',
      country: '',
      gender: '',
      newsletter: false,
      terms: false,
      notifications: false
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Text Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Inputs</CardTitle>
            <CardDescription>Single-line and multi-line text fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                data-testid="first-name-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                data-testid="last-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-field">Email</Label>
              <Input
                id="email-field"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-textarea">Bio (Multi-line)</Label>
              <Textarea
                id="bio-textarea"
                placeholder="Tell us about yourself..."
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                data-testid="bio-textarea"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Field */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Password Fields</CardTitle>
            <CardDescription>Secure input fields with masking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password-field">Password</Label>
              <Input
                id="password-field"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                data-testid="password-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                data-testid="confirm-password-input"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Password strength: {formData.password.length > 8 ? '🟢 Strong' : formData.password.length > 4 ? '🟡 Medium' : '🔴 Weak'}
            </div>
          </CardContent>
        </Card>

        {/* Dropdowns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dropdown Selects</CardTitle>
            <CardDescription>Single and multi-select dropdowns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country-select">Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger id="country-select" data-testid="country-select">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Searchable Select</Label>
              <Select>
                <SelectTrigger data-testid="searchable-select">
                  <SelectValue placeholder="Search for a framework..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selenium">Selenium WebDriver</SelectItem>
                  <SelectItem value="playwright">Playwright</SelectItem>
                  <SelectItem value="cypress">Cypress</SelectItem>
                  <SelectItem value="testcafe">TestCafe</SelectItem>
                  <SelectItem value="webdriver-io">WebDriver.IO</SelectItem>
                  <SelectItem value="puppeteer">Puppeteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.country && (
              <Badge variant="outline" data-testid="selected-country">
                Selected: {formData.country.toUpperCase()}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Radio Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Radio Buttons</CardTitle>
            <CardDescription>Single selection from multiple options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label>Gender</Label>
              <RadioGroup 
                value={formData.gender} 
                onValueChange={(value) => handleInputChange('gender', value)}
                data-testid="gender-radio-group"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" data-testid="radio-male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" data-testid="radio-female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" data-testid="radio-other" />
                  <Label htmlFor="other">Other</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" data-testid="radio-no-answer" />
                  <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Checkboxes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Checkboxes</CardTitle>
            <CardDescription>Multiple independent selections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter-checkbox"
                checked={formData.newsletter}
                onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                data-testid="newsletter-checkbox"
              />
              <Label htmlFor="newsletter-checkbox">Subscribe to newsletter</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms-checkbox"
                checked={formData.terms}
                onCheckedChange={(checked) => handleInputChange('terms', checked)}
                data-testid="terms-checkbox"
              />
              <Label htmlFor="terms-checkbox">I agree to Terms & Conditions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notifications-switch"
                checked={formData.notifications}
                onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                data-testid="notifications-switch"
              />
              <Label htmlFor="notifications-switch">Enable notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Buttons</CardTitle>
            <CardDescription>Various button states and interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="default" 
                data-testid="enabled-button"
                onClick={() => console.log('Primary button clicked')}
              >
                Enabled Button
              </Button>
              
              <Button 
                variant="secondary" 
                data-testid="secondary-button"
              >
                Secondary Button
              </Button>
              
              <Button 
                variant="outline" 
                data-testid="outline-button"
              >
                Outline Button
              </Button>
              
              <Button 
                variant="destructive" 
                data-testid="destructive-button"
              >
                Destructive Button
              </Button>
              
              <Button 
                disabled 
                data-testid="disabled-button"
              >
                Disabled Button
              </Button>
              
              <Button 
                variant="ghost" 
                data-testid="ghost-button"
              >
                Ghost Button
              </Button>
              
              <Button 
                onClick={handleDynamicButton}
                disabled={buttonStates.loading}
                data-testid="dynamic-button"
              >
                {buttonStates.loading ? 'Loading...' : 'Dynamic Enable/Disable'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Links</CardTitle>
          <CardDescription>Internal and external navigation links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Internal Links</h4>
              <div className="space-y-2">
                <a href="#basic-elements" className="block text-primary hover:underline" data-testid="internal-link-1">
                  Go to Basic Elements
                </a>
                <a href="#advanced-features" className="block text-primary hover:underline" data-testid="internal-link-2">
                  Jump to Advanced Features
                </a>
                <button 
                  className="block text-primary hover:underline text-left" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  data-testid="scroll-to-top"
                >
                  Scroll to Top
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">External Links</h4>
              <div className="space-y-2">
                <a 
                  href="https://selenium.dev" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-primary hover:underline"
                  data-testid="external-link-selenium"
                >
                  Selenium Documentation ↗
                </a>
                <a 
                  href="https://playwright.dev" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-primary hover:underline"
                  data-testid="external-link-playwright"
                >
                  Playwright Documentation ↗
                </a>
                <a 
                  href="https://cypress.io" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-primary hover:underline"
                  data-testid="external-link-cypress"
                >
                  Cypress Documentation ↗
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Dynamic Links</h4>
              <div className="space-y-2">
                <a 
                  href={formData.country ? `#country-${formData.country}` : '#'} 
                  className={`block hover:underline ${formData.country ? 'text-primary' : 'text-muted-foreground cursor-not-allowed'}`}
                  data-testid="dynamic-country-link"
                >
                  {formData.country ? `${formData.country.toUpperCase()} Info` : 'Select country first'}
                </a>
                <a 
                  href={formData.email ? `mailto:${formData.email}` : '#'} 
                  className={`block hover:underline ${formData.email ? 'text-primary' : 'text-muted-foreground cursor-not-allowed'}`}
                  data-testid="dynamic-email-link"
                >
                  {formData.email ? `Email ${formData.email}` : 'Enter email first'}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Form Actions</CardTitle>
          <CardDescription>Form submission and reset functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={() => console.log('Form submitted:', formData)}
              disabled={!formData.firstName || !formData.email || !formData.terms}
              data-testid="submit-form"
            >
              Submit Form
            </Button>
            <Button 
              variant="outline" 
              onClick={resetForm}
              data-testid="reset-form"
            >
              Reset Form
            </Button>
          </div>
          
          {formData.firstName && formData.email && formData.terms && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800" data-testid="form-valid-message">
                ✅ Form is valid and ready to submit!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}