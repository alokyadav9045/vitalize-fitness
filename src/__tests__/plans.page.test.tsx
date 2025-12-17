import { render, screen } from '@testing-library/react'
import PlansPage from '@/app/plans/page'

describe('PlansPage', () => {
  it('renders plan names', () => {
    render(<PlansPage />)
    expect(screen.getAllByText(/Basic/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Premium/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Elite/i).length).toBeGreaterThan(0)
  })
})
