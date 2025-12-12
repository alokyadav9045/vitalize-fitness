import { verifyToken, createToken, isTokenExpired } from '@/lib/auth'

describe('Authentication utilities', () => {
  const testPayload = {
    username: 'admin',
    role: 'admin'
  }

  describe('createToken', () => {
    it('should create a valid JWT token', () => {
      const token = createToken(testPayload)
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = createToken(testPayload)
      const decoded = verifyToken(token)

      expect(decoded).toBeTruthy()
      expect(decoded?.username).toBe(testPayload.username)
      expect(decoded?.role).toBe(testPayload.role)
    })

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token')
      expect(decoded).toBeNull()
    })

    it('should return null for expired token', () => {
      // Create a token that expires immediately
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjg0NjQwMDAwLCJleHAiOjE2ODQ2NDAwMDB9.invalid'
      const decoded = verifyToken(expiredToken)
      expect(decoded).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const token = createToken(testPayload)
      expect(isTokenExpired(token)).toBe(false)
    })

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true)
    })
  })
})