import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function BusinessCheckoutPage() {
  const [orderConfirmation, setOrderConfirmation] = useState(false)
  const [mobileNavVisible, setMobileNavVisible] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderConfirmation(true)
  }

  const toggleMobileNav = () => {
    setMobileNavVisible(!mobileNavVisible)
  }

  const applyPromo = () => {
    setDiscountApplied(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive CSS - CRITICAL: This causes CI failures on narrow viewports */}
      <style>{`
        @media (max-width: 767px) {
          #complete-checkout-btn {
            display: none !important;
          }
          .desktop-nav {
            display: none;
          }
          .sidebar-form {
            display: none;
          }
        }
        
        @media (min-width: 768px) {
          .mobile-nav,
          #mobile-menu-toggle,
          #mobile-promo-code,
          #apply-promo-mobile {
            display: none;
          }
        }
      `}</style>

      {/* Desktop Navigation (hidden on mobile) */}
      <nav className="desktop-nav border-b p-4">
        <div className="container mx-auto flex gap-4">
          <Link to="/cart" className="text-primary hover:underline">Cart</Link>
          <Link id="checkout-link" to="/business/checkout" className="text-primary hover:underline">Checkout</Link>
        </div>
      </nav>

      {/* Mobile Navigation (hidden on desktop) */}
      <div className="p-4 border-b">
        <button
          id="mobile-menu-toggle"
          onClick={toggleMobileNav}
          className="px-4 py-2 border rounded"
        >
          ☰ Menu
        </button>
        <nav
          className="mobile-nav mt-4"
          style={{ display: mobileNavVisible ? 'block' : 'none' }}
        >
          <div className="flex flex-col gap-2">
            <Link id="checkout-link" to="/business/checkout" className="text-primary hover:underline">Checkout</Link>
            <Link to="/cart" className="text-primary hover:underline">Cart</Link>
          </div>
        </nav>
      </div>

      <div className="container mx-auto p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Business Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Demonstrates Environment (E) and Konfiguration (K) issues — viewport differences and config drift.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="md:col-span-2">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <input
                id="card-number"
                type="text"
                placeholder="Card Number"
                maxLength={16}
                className="w-full px-4 py-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  id="cvv"
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <button
                id="complete-checkout-btn"
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Complete Checkout
              </button>
            </form>

            <div
              id="order-confirmation"
              style={{ display: orderConfirmation ? 'block' : 'none' }}
              className="mt-6 p-4 bg-green-100 text-green-800 rounded"
            >
              Order Confirmed! Thank you for your purchase.
            </div>

            {/* Mobile promo (shown on mobile) */}
            <div className="mt-6">
              <input
                id="mobile-promo-code"
                type="text"
                placeholder="Promo Code"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              <button
                id="apply-promo-mobile"
                onClick={applyPromo}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Sidebar with Desktop Promo */}
          <div className="sidebar-form space-y-4">
            <h3 className="font-semibold">Promo Code</h3>
            <input
              id="promo-code"
              type="text"
              placeholder="Promo Code"
              className="w-full px-4 py-2 border rounded"
            />
            <button
              id="apply-promo"
              onClick={applyPromo}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded"
            >
              Apply
            </button>
          </div>
        </div>

        <div
          id="discount-applied"
          style={{ display: discountApplied ? 'block' : 'none' }}
          className="mt-6 p-4 bg-blue-100 text-blue-800 rounded"
        >
          Discount Applied!
        </div>

        {/* Cart Link */}
        <div className="mt-8">
          <Link to="/cart" className="text-primary hover:underline">View Cart</Link>
        </div>
      </div>
    </div>
  )
}
