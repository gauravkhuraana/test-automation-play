import { useState } from 'react'

export default function BusinessBookingPage() {
  const [availableSlotsVisible, setAvailableSlotsVisible] = useState(false)
  const [slotsText, setSlotsText] = useState('')

  const handleCheckAvailability = () => {
    const dateInput = document.getElementById('booking-date') as HTMLInputElement
    const date = dateInput?.value
    
    if (date) {
      setAvailableSlotsVisible(true)
      setSlotsText('Available - 3 slots remaining')
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Business Booking</h1>
        <p className="text-muted-foreground mb-8">
          Demonstrates timezone and date format issues.
        </p>

        <div id="booking-section" className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
          <div className="space-y-4">
            <input
              id="booking-date"
              type="date"
              className="w-full px-4 py-2 border rounded"
            />
            <button
              id="check-availability-btn"
              onClick={handleCheckAvailability}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Check Availability
            </button>
          </div>
          
          <div
            id="available-slots"
            style={{ display: availableSlotsVisible ? 'block' : 'none' }}
            className="mt-4 p-4 bg-green-100 text-green-800 rounded"
          >
            {slotsText}
          </div>
        </div>
      </div>
    </div>
  )
}
