import { useState } from 'react'

export default function BusinessPage() {
  const [premiumVisible, setPremiumVisible] = useState(false)

  const handleVerifyKey = () => {
    const key = (document.getElementById('api-key-input') as HTMLInputElement)?.value || ''
    // Accept any key that starts with "test" or has 10+ characters
    if (key && (key.startsWith('test') || key.length >= 10)) {
      setPremiumVisible(true)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div id="main-content" className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Business Features</h1>
        <p className="text-muted-foreground mb-8">
          Demonstrates Environment (E) issues — missing environment variables/API keys.
        </p>

        <div id="api-key-section" className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API Key Verification</h2>
          <div className="space-y-4">
            <input
              id="api-key-input"
              type="text"
              placeholder="Enter API Key"
              className="w-full px-4 py-2 border rounded"
            />
            <button
              id="verify-key-btn"
              onClick={handleVerifyKey}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Verify Key
            </button>
          </div>
        </div>

        <div
          id="premium-content"
          style={{ display: premiumVisible ? 'block' : 'none' }}
          className="mt-6 border rounded-lg p-6 bg-green-50"
        >
          <h2 className="text-xl font-semibold mb-2">Premium Features Unlocked!</h2>
          <p className="text-muted-foreground">Welcome to the premium section.</p>
        </div>
      </div>
    </div>
  )
}
