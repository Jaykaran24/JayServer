import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads')

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Allow any file type
    cb(null, true)
  },
})

// Get all files
router.get('/', authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).map((filename) => ({
      filename,
      url: `/uploads/${filename}`,
    }))
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve files', error: error.message })
  }
})

// Upload file (admin only)
router.post('/upload', adminMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message })
  }
})

// Delete file (admin only)
router.delete('/:filename', adminMiddleware, (req, res) => {
  try {
    const filename = req.params.filename
    const filepath = path.join(uploadsDir, filename)

    // Prevent directory traversal attacks
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      res.json({ message: 'File deleted successfully' })
    } else {
      res.status(404).json({ message: 'File not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message })
  }
})

export default router
