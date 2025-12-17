import { render, screen, waitFor } from '@testing-library/react'
import GalleryDetail from '@/app/gallery/[id]/page'
import { jest } from '@jest/globals'

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}))

describe('GalleryDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows image detail when found', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        galleryImages: [
          { _id: '1', title: 'Detailed Image', image: 'https://example.com/1.jpg', category: 'equipment', isActive: true, description: 'desc', createdAt: new Date().toISOString() }
        ]
      })
    })

    render(<GalleryDetail />)

    await waitFor(() => expect(screen.getByText('Detailed Image')).toBeInTheDocument())
    expect(screen.getByText(/category/i)).toBeInTheDocument()
    expect(screen.getByText(/equipment/i)).toBeInTheDocument()
  })
})
