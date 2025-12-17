import { render, screen } from '@testing-library/react'
import Trainers from '@/components/Trainers'

const mock = [
  { id: 1, name: 'T1', specialty: 'Yoga', experience: '5 years', image: 'https://example.com/1.jpg', bio: 'b', social: { facebook: '#', twitter: '#', instagram: '#' } }
]

describe('Trainers responsive', () => {
  it('renders trainer cards and image container', () => {
    render(<Trainers trainersData={mock} />)
    expect(screen.getByText('T1')).toBeInTheDocument()
    const imageContainer = screen.getByAltText('T1')?.parentElement
    expect(imageContainer).toHaveClass('h-56')
  })
})
