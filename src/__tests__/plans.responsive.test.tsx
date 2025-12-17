import { render, screen } from '@testing-library/react'
import Plans from '@/components/Plans'

describe('Plans responsive', () => {
  it('renders plans and shows Choose Plan buttons', () => {
    render(<Plans />)
    expect(screen.getAllByText(/Choose Plan/i).length).toBeGreaterThan(0)
  })
})