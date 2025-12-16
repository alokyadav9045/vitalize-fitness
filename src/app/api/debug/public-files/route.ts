import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Temporary debug route to inspect the deployed `public/` folder
// Remove this after verification
export function GET() {
  const publicDir = path.join(process.cwd(), 'public')
  const exists = fs.existsSync(publicDir)
  let listing: string[] | null = null

  if (exists) {
    try {
      listing = fs.readdirSync(publicDir)
    } catch (err) {
      console.error('Error reading public directory:', err)
    }
  }

  return NextResponse.json({ exists, listing })
}
