import { render, screen, waitFor } from '@testing-library/react'
import TrainerDetail from '@/app/trainers/[id]/page'
import { jest } from '@jest/globals'

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '10' }),
}))

describe('TrainerDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows trainer detail when found', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        trainers: [
          { id: 10, name: 'Mock Trainer', specialty: 'Yoga', experience: '5 years', image: 'https://example.com/t.jpg', bio: 'bio' }
        ]
      })
    })

    render(<TrainerDetail />)

    await waitFor(() => expect(screen.getByText('Mock Trainer')).toBeInTheDocument())
    expect(screen.getByText(/experience/i)).toBeInTheDocument()
  })
})
