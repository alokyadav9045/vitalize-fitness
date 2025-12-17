import { render, screen, waitFor } from '@testing-library/react'
import TrainersPage from '@/app/trainers/page'

describe('TrainersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders trainers from API', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        trainers: [
          { id: 10, name: 'Mock Trainer', specialty: 'Yoga', experience: '5 years', image: 'https://example.com/t.jpg', bio: 'bio' }
        ]
      })
    })

    render(<TrainersPage />)

    await waitFor(() => expect(screen.getByText(/our trainers/i)).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText('Mock Trainer')).toBeInTheDocument())
  })
})
