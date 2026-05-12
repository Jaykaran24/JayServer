# Admin User Management Guide

## JWT Authentication & Role-Based Access

Your system uses **JWT tokens** with role-based access control. Users can be either:
- **`user`** - Regular users (read-only project view)
- **`admin`** - Admin users (file upload & management)

---

## Method 1: MongoDB Compass (Recommended for Production)

### Prerequisites
- MongoDB Compass installed: https://www.mongodb.com/try/download/compass
- MongoDB Atlas account with cluster access

### Steps to Make a User Admin

1. **Open MongoDB Compass**
   - Download and install from: https://www.mongodb.com/try/download/compass

2. **Connect to Your Cluster**
   - Click "Connect"
   - Use your connection string:
     ```
     mongodb+srv://jay24codes:Jay%402435@cluster0.bu5cgjc.mongodb.net/jay-dashboard
     ```
   - Or use "New Connection" and paste the URI

3. **Navigate to Users Collection**
   - Left sidebar → `jay-dashboard` database
   - Click `users` collection
   - Find the user you want to promote (filter by username if needed)

4. **Edit User Document**
   - Click on the user document to expand it
   - Click the pencil icon ✏️ to edit
   - Find the `role` field (currently set to `"user"`)
   - Change it to `"admin"`
   - Click "Update" to save

5. **User Gets Admin Access on Next Login**
   - User must log out and log back in
   - New JWT token will include `"role": "admin"`
   - Admin dashboard unlocks with file upload capability

---

## Method 2: Terminal Script (Quick Development)

Use the provided script for quick admin promotion during development:

```bash
node backend/scripts/make-admin.js <username>
```

Example:
```bash
node backend/scripts/make-admin.js testuser3
```

Output:
```
✅ User "testuser3" upgraded to admin successfully
Role: admin
```

---

## How JWT Roles Work

1. **Registration**: New users get role `"user"` by default
2. **Login**: Backend generates JWT token containing:
   ```json
   {
     "id": "...",
     "username": "...",
     "role": "admin" or "role": "user",
     "iat": ...,
     "exp": ...
   }
   ```
3. **Protected Routes**: File upload endpoint checks `adminMiddleware`:
   - Verifies JWT signature
   - Checks `role === "admin"`
   - Allows upload if admin, blocks with 403 if regular user

4. **Token Storage**: JWT stored in browser localStorage
   - Persists across page refreshes
   - Auto-clears on logout

---

## User Role Comparison

| Feature | Regular User | Admin |
|---------|-------------|-------|
| View Portfolio | ✅ | ✅ |
| Sign Up / Login | ✅ | ✅ |
| Upload Files | ❌ | ✅ |
| Manage Files | ❌ | ✅ |
| Delete Files | ❌ | ✅ |
| See Admin Dashboard | ❌ | ✅ |

---

## Current Test Users

| Username | Email | Role | Password |
|----------|-------|------|----------|
| testuser2 | testuser2@example.com | user | password123 |
| testuser3 | testuser3@example.com | **admin** | password123 |

---

## Next Steps

- ✅ JWT authentication working
- ✅ Role-based access control working
- ✅ File upload for admins working
- ⏭️ Deploy to Ubuntu server with docker-compose
- ⏭️ Set up Cloudflare Tunnel for jay24codes.me domain
