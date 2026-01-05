import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function BasicPage() {
  const [delayedButtonEnabled, setDelayedButtonEnabled] = useState(false)
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [formResult, setFormResult] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [dynamicContentVisible, setDynamicContentVisible] = useState(false)
  const [dynamicContentText, setDynamicContentText] = useState('')
  const [apiResultVisible, setApiResultVisible] = useState(false)

  useEffect(() => {
    // Enable button after 500ms delay (simulates slow-loading component)
    const timer = setTimeout(() => {
      setDelayedButtonEnabled(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleDelayedButtonClick = () => {
    setSuccessMessageVisible(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormResult(true)
  }

  const handleLoadContent = () => {
    setLoadingSpinner(true)
    setDynamicContentVisible(false)
    
    setTimeout(() => {
      setLoadingSpinner(false)
      setDynamicContentVisible(true)
      setDynamicContentText('Loaded successfully')
    }, 1500)
  }

  const handleFetchData = () => {
    // Simulates network request, wait 1 second, then complete
    setTimeout(() => {
      console.log('Data fetched')
    }, 1000)
  }

  const handleApiCall = () => {
    // Shows api-result after simulated API delay
    setTimeout(() => {
      setApiResultVisible(true)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Basic Elements</h1>
        <p className="text-muted-foreground mb-8">
          Demonstrates Latency (L) and Async (A) issues — tests that pass locally but fail in slower CI environments.
        </p>
        
        <div id="main-content" className="space-y-8">
          {/* 1.1 Delayed Button Demo */}
          <section className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Delayed Button Demo</h2>
            <button
              id="delayed-submit-btn"
              disabled={!delayedButtonEnabled}
              onClick={handleDelayedButtonClick}
              className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
            <div
              id="success-message"
              style={{ display: successMessageVisible ? 'block' : 'none' }}
              className="mt-4 text-green-600"
            >
              Success!
            </div>
          </section>

          {/* 1.2 Form Demo */}
          <section className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Form Demo</h2>
            <form id="contact-form" onSubmit={handleFormSubmit} className="space-y-4">
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
              />
              <button
                id="submit-btn"
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Submit
              </button>
            </form>
            <div
              id="form-result"
              style={{ display: formResult ? 'block' : 'none' }}
              className="mt-4 text-green-600"
            >
              Success
            </div>
          </section>

          {/* 1.3 Dynamic Content Loading Demo */}
          <section className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dynamic Content Loading Demo</h2>
            <button
              id="load-content-btn"
              onClick={handleLoadContent}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Load Content
            </button>
            <div
              id="loading-spinner"
              style={{ display: loadingSpinner ? 'block' : 'none' }}
              className="mt-4"
            >
              Loading...
            </div>
            <div
              id="dynamic-content"
              style={{ display: dynamicContentVisible ? 'block' : 'none' }}
              className="mt-4 text-green-600"
            >
              {dynamicContentText}
            </div>
          </section>

          {/* 1.4 API Call Demo */}
          <section className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Call Demo</h2>
            <div className="space-x-4">
              <button
                id="fetch-data-btn"
                onClick={handleFetchData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Fetch Data
              </button>
              <button
                id="api-call-btn"
                onClick={handleApiCall}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
              >
                Call API
              </button>
            </div>
            <div
              id="api-result"
              style={{ display: apiResultVisible ? 'block' : 'none' }}
              className="mt-4 text-green-600"
            >
              API Response
            </div>
          </section>

          {/* 1.5 Navigation Link */}
          <section className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <Link
              to="/intermediate"
              className="text-primary hover:underline"
            >
              Go to Intermediate
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
