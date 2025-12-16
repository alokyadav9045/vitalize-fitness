import mongoose from 'mongoose'

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = globalWithMongoose.mongoose

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // In production require an explicit MONGODB_URI; in development/tests a local default is allowed
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in production. Set the environment variable in your deployment (eg Vercel).')
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalize-fitness'

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect