/* eslint-disable no-console */
const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']

function check() {
  const env = process.env.NODE_ENV || 'development'
  console.log(`Running environment checks (NODE_ENV=${env})`)

  if (env === 'production') {
    const missing = requiredInProduction.filter((v) => !process.env[v])
    if (missing.length > 0) {
      console.error('Missing required environment variables for production:')
      missing.forEach((m) => console.error(` - ${m}`))
      process.exit(1)
    }
    console.log('All required production environment variables are set.')
    process.exit(0)
  } else {
    console.log('Not in production; skipping strict env checks.')
    process.exit(0)
  }
}

check()
