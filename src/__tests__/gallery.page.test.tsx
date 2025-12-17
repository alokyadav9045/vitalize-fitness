import { render, screen, waitFor } from '@testing-library/react'
import GalleryPage from '@/app/gallery/page'

describe('GalleryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders images from the API', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        galleryImages: [
          { _id: '1', title: 'Test Image', image: 'https://example.com/1.jpg', category: 'all', isActive: true, createdAt: new Date().toISOString() }
        ]
      })
    })

    render(<GalleryPage />)

    await waitFor(() => expect(screen.getByText('Test Image')).toBeInTheDocument())
  })
})
