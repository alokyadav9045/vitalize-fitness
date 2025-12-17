import { render, screen, waitFor } from '@testing-library/react'
import TestimonialsPage from '@/app/testimonials/page'

describe('Testimonials responsive', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders active testimonials in a responsive grid', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        testimonials: [
          { _id: 't1', name: 'User One', message: 'Great!', isActive: true, role: 'Member' },
          { _id: 't2', name: 'User Two', message: 'Good', isActive: false },
          { _id: 't3', name: 'User Three', message: 'Awesome', isActive: true, role: 'Athlete' }
        ]
      })
    })

    render(<TestimonialsPage />)

    await waitFor(() => expect(screen.getByText('Great!')).toBeInTheDocument())
    expect(screen.getByText('Awesome')).toBeInTheDocument()
    // Only active testimonials should be shown
    expect(screen.queryByText('Good')).not.toBeInTheDocument()
  })
})