import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const makeAdmin = async (username) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jay-dashboard')

    const user = await User.findOneAndUpdate(
      { username },
      { role: 'admin' },
      { new: true }
    )

    if (!user) {
      console.log(`❌ User "${username}" not found`)
      process.exit(1)
    }

    console.log(`✅ User "${username}" upgraded to admin successfully`)
    console.log(`Role: ${user.role}`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

const username = process.argv[2]
if (!username) {
  console.error('Usage: node make-admin.js <username>')
  process.exit(1)
}

makeAdmin(username)
