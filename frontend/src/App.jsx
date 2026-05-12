import { useState, useEffect } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [authToken, setAuthToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('userRole')
    const name = localStorage.getItem('userName')

    if (token && role) {
      setAuthToken(token)
      setUserRole(role)
      setUserName(name)
      setCurrentPage(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    setAuthToken(null)
    setUserRole(null)
    setUserName('')
    setCurrentPage('landing')
  }

  const handleLoginSuccess = (token, role, username) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', username)
    setAuthToken(token)
    setUserRole(role)
    setUserName(username)
    setCurrentPage(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')
  }

  return (
    <div className="app-shell">
      {currentPage === 'landing' && <LandingPage onSignUp={() => setCurrentPage('signup')} onSignIn={() => setCurrentPage('signin')} />}
      {currentPage === 'signup' && <SignUpPage onSuccess={handleLoginSuccess} onBackToLanding={() => setCurrentPage('landing')} />}
      {currentPage === 'signin' && <SignInPage onSuccess={handleLoginSuccess} onBackToLanding={() => setCurrentPage('landing')} />}
      {currentPage === 'admin-dashboard' && <AdminDashboard userName={userName} onLogout={handleLogout} />}
      {currentPage === 'user-dashboard' && <UserDashboard userName={userName} onLogout={handleLogout} />}
    </div>
  )
}

function LandingPage({ onSignUp, onSignIn }) {
  return (
    <div>
      {/* Navigation */}
      <nav className="nav-shell">
        <div className="page-container nav-inner">
          <div className="brand">
            <h1 className="brand-title">Jay24codes</h1>
            <span className="brand-subtitle">Admin and portfolio hub</span>
          </div>
          <div className="nav-actions">
            <button onClick={onSignIn} className="btn btn-ghost">
              Sign In
            </button>
            <button onClick={onSignUp} className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="page-container hero">
        <div className="hero-content reveal">
          <span className="kicker">Full-Stack Developer</span>
          <h2 className="display-title">Jay Karan Chaturvedi</h2>
          <p className="lead">Full-stack and backend developer focused on cloud-native products.</p>
          <p className="lead muted">Building scalable systems, intelligent applications, and seamless user experiences.</p>
          <div className="hero-actions">
            <button onClick={onSignUp} className="btn btn-primary">
              Create account
            </button>
            <button onClick={onSignIn} className="btn btn-ghost">
              Sign in
            </button>
          </div>
        </div>
        <div className="hero-card card reveal" style={{ animationDelay: '120ms' }}>
          <div className="hero-card-header">
            <span className="pill">Admin console</span>
            <span className="pill pill-warm">Live systems</span>
          </div>
          <h3 className="card-title">Control center for assets and deployments</h3>
          <ul className="hero-list">
            <li>Secure access for admin workflows</li>
            <li>Fast uploads with direct downloads</li>
            <li>Quick links to production services</li>
          </ul>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section page-container" id="projects">
        <div className="section-heading">
          <h3 className="section-title">Featured Projects</h3>
          <p className="section-subtitle">Selected work shipping today.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://cogniprep.jay24codes.me"
            target="_blank"
            rel="noopener noreferrer"
            className="card link-card"
          >
            <div className="card-top">
              <h4 className="card-title">CogniPrep</h4>
              <span className="pill pill-accent">Live</span>
            </div>
            <p className="muted">
              An AI-powered interview preparation platform that simulates real-world technical interviews.
            </p>
            <span className="link-action">Open site</span>
          </a>

          <div className="card link-card">
            <div className="card-top">
              <h4 className="card-title">Annual Sports 2026</h4>
              <span className="pill">Live ops</span>
            </div>
            <p className="muted">Coordination and management platform for sports events.</p>
            <span className="muted">Live event coordinator</span>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section page-container">
        <div className="section-heading">
          <h3 className="section-title">Tech Stack</h3>
          <p className="section-subtitle">Tools used across the platform.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Node.js', 'Express', 'MongoDB', 'React', 'Vite', 'Tailwind CSS', 'Docker', 'AWS'].map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-shell">
        <div className="page-container footer-inner">
          <p>(c) 2026 Jay24codes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function SignUpPage({ onSuccess, onBackToLanding }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting...')
        setTimeout(() => {
          onSuccess(data.token, data.user.role, data.user.username)
        }, 1500)
      } else {
        setError(data.message || 'Sign up failed')
      }
    } catch (err) {
      setError('Connection error. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle muted">Join the community and explore my projects.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="muted text-sm mb-2">Already have an account?</p>
          <button
            onClick={onBackToLanding}
            className="text-link text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function SignInPage({ onSuccess, onBackToLanding }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess(data.token, data.user.role, data.user.username)
      } else {
        setError(data.message || 'Sign in failed')
      }
    } catch (err) {
      setError('Connection error. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle muted">Sign in to your account.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="muted text-sm mb-2">Don't have an account?</p>
          <button
            onClick={onBackToLanding}
            className="text-link text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function UserDashboard({ userName, onLogout }) {
  return (
    <div>
      {/* Navigation */}
      <nav className="nav-shell">
        <div className="page-container nav-inner">
          <div className="brand">
            <h1 className="brand-title">Jay24codes</h1>
            <p className="brand-subtitle">Welcome, {userName}</p>
          </div>
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </nav>

      <div className="page-container">
        {/* Featured Projects */}
        <section className="section">
          <div className="section-heading">
            <h2 className="section-title">My Projects</h2>
            <p className="section-subtitle">Focus areas and active builds.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://cogniprep.jay24codes.me"
              target="_blank"
              rel="noopener noreferrer"
              className="card link-card"
            >
              <div className="card-top">
                <h3 className="card-title">CogniPrep</h3>
                <span className="pill pill-accent">Live</span>
              </div>
              <p className="muted">
                An AI-powered interview preparation platform that simulates real-world technical interviews.
              </p>
              <span className="link-action">Open site</span>
            </a>

            <div className="card link-card">
              <div className="card-top">
                <h3 className="card-title">Annual Sports 2026</h3>
                <span className="pill">Live ops</span>
              </div>
              <p className="muted">Coordination and management platform for sports events.</p>
              <span className="muted">Live event coordinator</span>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="section">
          <div className="section-heading">
            <h2 className="section-title">Tech Stack</h2>
            <p className="section-subtitle">Core tools behind this platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Node.js', 'Express', 'MongoDB', 'React', 'Vite', 'Tailwind CSS', 'Docker', 'AWS'].map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Info Box */}
        <div className="callout mt-8">
          <h3 className="callout-title">Want to upload files?</h3>
          <p className="muted">
            Currently, only admin users can upload and manage files. If you want admin access, please contact Jay.
          </p>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({ userName, onLogout }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/files', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setFiles(data)
    } catch (err) {
      setError('Failed to fetch files')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setSuccess('File uploaded successfully!')
        fetchFiles()
        e.target.value = ''
      } else {
        const data = await response.json()
        setError(data.message || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/files/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setSuccess('File deleted successfully!')
        fetchFiles()
      } else {
        const data = await response.json()
        setError(data.message || 'Delete failed')
      }
    } catch (err) {
      setError('Delete failed: ' + err.message)
    }
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="nav-shell">
        <div className="page-container nav-inner">
          <div className="brand">
            <h1 className="brand-title">Admin Dashboard</h1>
            <p className="brand-subtitle">Admin | {userName}</p>
          </div>
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </nav>

      <div className="page-container">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Quick Links */}
        <section className="section">
          <div className="section-heading">
            <h2 className="section-title">Quick Links</h2>
            <p className="section-subtitle">Jump to key systems.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://cogniprep.jay24codes.me"
              target="_blank"
              rel="noopener noreferrer"
              className="card link-card"
            >
              <div className="card-top">
                <h3 className="card-title">CogniPrep</h3>
                <span className="pill pill-accent">Live</span>
              </div>
              <p className="muted">AI interview platform</p>
              <span className="link-action">Open site</span>
            </a>
            <a
              href="https://api.jay24codes.me"
              target="_blank"
              rel="noopener noreferrer"
              className="card link-card"
            >
              <div className="card-top">
                <h3 className="card-title">API Docs</h3>
                <span className="pill">Docs</span>
              </div>
              <p className="muted">Backend API reference</p>
              <span className="link-action">Open docs</span>
            </a>
            <a
              href="https://jay24codes.me"
              target="_blank"
              rel="noopener noreferrer"
              className="card link-card"
            >
              <div className="card-top">
                <h3 className="card-title">Portfolio</h3>
                <span className="pill pill-warm">Main</span>
              </div>
              <p className="muted">Personal website</p>
              <span className="link-action">Open site</span>
            </a>
          </div>
        </section>

        {/* File Manager */}
        <section className="section">
          <div className="section-heading">
            <h2 className="section-title">File Manager</h2>
            <p className="section-subtitle">Upload, organize, and share assets.</p>
          </div>
          <div className="panel">
            <div className="mb-8">
              <label className="label">Upload new file</label>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="file-input"
              />
              {uploading && <p className="status">Uploading...</p>}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Uploaded files ({files.length})</h3>
              {files.length === 0 ? (
                <p className="muted">No files uploaded yet.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {files.map((file, idx) => (
                    <div key={idx} className="file-row">
                      <span className="file-name truncate flex-1">{file.filename}</span>
                      <div className="file-actions">
                        <a
                          href={`http://localhost:5000${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-mini btn-secondary"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file.filename)}
                          className="btn btn-mini btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
