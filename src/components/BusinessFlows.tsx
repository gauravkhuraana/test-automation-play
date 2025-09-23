import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  User, 
  ShoppingCart, 
  CreditCard, 
  MagnifyingGlass, 
  Star,
  Heart,
  UserPlus,
  Envelope
} from '@phosphor-icons/react'

interface User {
  id: string
  username: string
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
    phone: string
    address: string
  }
}

interface Product {
  id: string
  name: string
  price: number
  category: string
  rating: number
  inStock: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

export default function BusinessFlows() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', [])
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  })
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')

  const products: Product[] = [
    { id: '1', name: 'Selenium Grid Setup', price: 299, category: 'automation', rating: 4.5, inStock: true },
    { id: '2', name: 'Playwright Course', price: 199, category: 'training', rating: 4.8, inStock: true },
    { id: '3', name: 'Cypress Testing Kit', price: 149, category: 'automation', rating: 4.2, inStock: false },
    { id: '4', name: 'TestCafe License', price: 99, category: 'tools', rating: 4.0, inStock: true },
    { id: '5', name: 'API Testing Guide', price: 79, category: 'training', rating: 4.6, inStock: true }
  ]

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price
        case 'rating': return b.rating - a.rating
        default: return a.name.localeCompare(b.name)
      }
    })

  const handleLogin = () => {
    if (loginData.username === 'admin' && loginData.password === 'password') {
      const user: User = {
        id: '1',
        username: loginData.username,
        email: 'admin@example.com',
        password: '',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '123-456-7890',
          address: '123 Main St'
        }
      }
      setCurrentUser(user)
      toast.success('Login successful!')
    } else {
      toast.error('Invalid credentials. Try admin/password')
    }
  }

  const handleRegister = () => {
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username: registerData.username,
      email: registerData.email,
      password: '',
      profile: {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        address: registerData.address
      }
    }
    setCurrentUser(newUser)
    toast.success('Registration successful!')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCartItems([])
    toast.info('Logged out successfully')
  }

  const addToCart = (product: Product) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart')
      return
    }

    setCartItems((prev: CartItem[]) => {
      const existing = prev?.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...(prev || []), { product, quantity: 1 }]
    })
    toast.success(`Added ${product.name} to cart`)
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev: CartItem[]) => (prev || []).filter(item => item.product.id !== productId))
  }

  const getTotalPrice = () => {
    return (cartItems || []).reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const processPayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate
      if (success) {
        toast.success('Payment successful! Order placed.')
        setCartItems([])
        setCheckoutStep(1)
      } else {
        toast.error('Payment failed. Please try again.')
      }
    }, 2000)
  }

  const submitContactForm = () => {
    toast.success('Contact form submitted successfully!')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* User Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              User Authentication
            </CardTitle>
            <CardDescription>Login and registration flows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!currentUser ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Login</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Username (try: admin)"
                      value={loginData.username}
                      onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                      data-testid="login-username"
                    />
                    <Input
                      type="password"
                      placeholder="Password (try: password)"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      data-testid="login-password"
                    />
                    <Button 
                      onClick={handleLogin}
                      className="w-full"
                      data-testid="login-button"
                    >
                      Login
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Register New Account</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="First Name"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                      data-testid="register-firstname"
                    />
                    <Input
                      placeholder="Last Name"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                      data-testid="register-lastname"
                    />
                  </div>
                  <Input
                    placeholder="Username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    data-testid="register-username"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="register-email"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    data-testid="register-password"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    data-testid="register-confirm-password"
                  />
                  <Button 
                    onClick={handleRegister}
                    className="w-full"
                    disabled={!registerData.username || !registerData.email || !registerData.password}
                    data-testid="register-button"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800" data-testid="user-welcome">
                    Welcome, {currentUser.profile.firstName} {currentUser.profile.lastName}!
                  </p>
                  <p className="text-xs text-green-600">Email: {currentUser.email}</p>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                  data-testid="logout-button"
                >
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shopping Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart
              {(cartItems || []).length > 0 && (
                <Badge variant="secondary" data-testid="cart-count">
                  {(cartItems || []).length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Add items and manage cart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(cartItems || []).length === 0 ? (
              <p className="text-muted-foreground text-center py-4" data-testid="empty-cart">
                Your cart is empty
              </p>
            ) : (
              <div className="space-y-2">
                {(cartItems || []).map(item => (
                  <div 
                    key={item.product.id} 
                    className="flex items-center justify-between p-2 border rounded"
                    data-testid={`cart-item-${item.product.id}`}
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      data-testid={`remove-item-${item.product.id}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <p className="font-medium" data-testid="total-price">
                    Total: ${getTotalPrice()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Listing with Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MagnifyingGlass className="w-5 h-5" />
            Product Search & Filters
          </CardTitle>
          <CardDescription>Search, filter, and sort products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="product-search"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="category-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 space-y-2"
                data-testid={`product-${product.id}`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{product.name}</h4>
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
                <p className="text-lg font-medium">${product.price}</p>
                <Button 
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock || !currentUser}
                  className="w-full"
                  data-testid={`add-to-cart-${product.id}`}
                >
                  {!currentUser ? 'Login to Purchase' : 'Add to Cart'}
                </Button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8" data-testid="no-products">
              No products found matching your criteria
            </p>
          )}
        </CardContent>
      </Card>

      {/* Checkout Process */}
      {(cartItems || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Checkout Process
            </CardTitle>
            <CardDescription>Multi-step checkout flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= checkoutStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                    data-testid={`checkout-step-${step}`}
                  >
                    {step}
                  </div>
                  {step < 3 && <div className="w-8 h-px bg-muted mx-2" />}
                </div>
              ))}
            </div>

            {checkoutStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-medium">Step 1: Review Order</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(cartItems || []).map(item => (
                      <TableRow key={item.product.id} data-testid={`checkout-item-${item.product.id}`}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.product.price * item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right font-medium">
                  Total: ${getTotalPrice()}
                </div>
                <Button 
                  onClick={() => setCheckoutStep(2)}
                  className="w-full"
                  data-testid="proceed-to-shipping"
                >
                  Proceed to Shipping
                </Button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-medium">Step 2: Shipping Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" data-testid="shipping-firstname" />
                  <Input placeholder="Last Name" data-testid="shipping-lastname" />
                </div>
                <Input placeholder="Address" data-testid="shipping-address" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" data-testid="shipping-city" />
                  <Input placeholder="ZIP Code" data-testid="shipping-zip" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep(1)}
                    data-testid="back-to-review"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCheckoutStep(3)}
                    className="flex-1"
                    data-testid="proceed-to-payment"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-medium">Step 3: Payment Method</h4>
                <div className="space-y-2">
                  {['credit-card', 'paypal', 'bank-transfer'].map(method => (
                    <label key={method} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-method"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        data-testid={`payment-${method}`}
                      />
                      <span className="capitalize">{method.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
                
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-2">
                    <Input placeholder="Card Number" data-testid="card-number" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="MM/YY" data-testid="card-expiry" />
                      <Input placeholder="CVV" data-testid="card-cvv" />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep(2)}
                    data-testid="back-to-shipping"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={processPayment}
                    className="flex-1"
                    disabled={!paymentMethod}
                    data-testid="process-payment"
                  >
                    Process Payment (${getTotalPrice()})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Envelope className="w-5 h-5" />
            Contact Form
          </CardTitle>
          <CardDescription>Customer support and inquiry form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                data-testid="contact-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                data-testid="contact-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Select 
              value={contactForm.subject} 
              onValueChange={(value) => setContactForm(prev => ({ ...prev, subject: value }))}
            >
              <SelectTrigger data-testid="contact-subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              rows={4}
              placeholder="Describe your inquiry..."
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              data-testid="contact-message"
            />
          </div>

          <Button 
            onClick={submitContactForm}
            disabled={!contactForm.name || !contactForm.email || !contactForm.message}
            data-testid="submit-contact"
          >
            Submit Inquiry
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}