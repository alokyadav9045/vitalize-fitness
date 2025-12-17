import { render, screen, waitFor } from '@testing-library/react'
import TestimonialsPage from '@/app/testimonials/page'

describe('TestimonialsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders active testimonials', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        testimonials: [
          { _id: 't1', name: 'User One', message: 'Great!', isActive: true },
          { _id: 't2', name: 'User Two', message: 'Good', isActive: false }
        ]
      })
    })

    render(<TestimonialsPage />)

    await waitFor(() => expect(screen.getByText(/testimonials/i)).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText('Great!')).toBeInTheDocument())
    expect(screen.queryByText('Good')).not.toBeInTheDocument()
  })
})
