import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required. File uploads are only available for admin users.' })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token or insufficient permissions' })
  }
}

export { authMiddleware, adminMiddleware }
export default authMiddleware
