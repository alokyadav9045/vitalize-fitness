import { render, screen, waitFor } from '@testing-library/react'
import Gallery from '@/components/Gallery'

describe('Gallery responsive', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders images and uses a mobile-first height on the carousel', async () => {
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        galleryImages: [
          { _id: '1', title: 'Test Image', image: 'https://example.com/1.jpg', category: 'all', isActive: true, createdAt: new Date().toISOString() }
        ]
      })
    })

    render(<Gallery />)

    await waitFor(() => expect(screen.getByText('Test Image')).toBeInTheDocument())

    const img = screen.getByAltText('Test Image')
    // Ensure the image exists and is inside a responsive container (check for a height class)
    const hasResponsiveAncestor = !!img.closest('[class*="h-56"], [class*="h-72"], [class*="h-96"], [class*="h-64"]')
    expect(hasResponsiveAncestor).toBe(true)
  })
})
