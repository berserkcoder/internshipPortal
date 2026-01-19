# Frontend-Backend Connection Testing Guide

## Prerequisites
- Node.js and npm installed
- MongoDB connected and running
- Backend and Frontend dependencies installed

## Step 1: Start the Backend

```bash
cd c:\Users\HP\OneDrive\Desktop\InternshipPortal\backend
npm start
```

Expected output:
```
Server is running at port : 4000
```

## Step 2: Start the Frontend

Open a new terminal:
```bash
cd c:\Users\HP\OneDrive\Desktop\InternshipPortal\frontend
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 3: Test Login Connection

### Method 1: Using the Frontend UI

1. Open browser to `http://localhost:5173`
2. Navigate to Login page
3. Use test credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Check browser DevTools:
   - **Network tab**: Should see POST request to `/users/login` returning 200
   - **Storage/LocalStorage**: Should see `accessToken`, `refreshToken`, and `user` stored
   - **Console**: Should not show any errors

### Method 2: Using Postman (for comparison)

1. **Sign Up first (if needed)**:
   - Method: POST
   - URL: `http://localhost:4000/api/v1/users/register`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "fullName": "Test User",
     "role": "candidate"
   }
   ```

2. **Login**:
   - Method: POST
   - URL: `http://localhost:4000/api/v1/users/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Expected Response:
   ```json
   {
     "statusCode": 200,
     "data": {
       "user": {
         "_id": "...",
         "fullName": "Test User",
         "email": "test@example.com",
         "role": "candidate",
         "accountStatus": "active"
       },
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc..."
     },
     "message": "User logged in successfully",
     "success": true
   }
   ```

## Step 4: Troubleshooting

### Issue: "Cannot POST /users/login"
- ✅ Check backend is running on port 4000
- ✅ Verify CORS_ORIGIN in backend `.env` is `http://localhost:5173`
- ✅ Check that frontend API_URL in `.env` is `http://localhost:4000/api/v1`

### Issue: CORS Error in Console
```
Access to XMLHttpRequest at 'http://localhost:4000/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```
**Solution:**
- Update backend `.env`: `CORS_ORIGIN=http://localhost:5173`
- Restart backend server

### Issue: "Login failed" but Postman works
- ✅ Open DevTools → Network tab → Check the login request/response
- ✅ Check Console for JavaScript errors
- ✅ Verify localStorage is saving tokens: DevTools → Storage → Local Storage
- ✅ Compare request headers between Postman and Frontend

### Issue: Token not being sent in subsequent requests
- ✅ Check `accessToken` exists in localStorage
- ✅ Verify API interceptor is adding Authorization header
- ✅ Open DevTools → Network → Click API request → Headers tab
  Should see: `Authorization: Bearer <token>`

### Issue: "Invalid password" or "User not found"
- ✅ Verify credentials are correct in frontend
- ✅ Create a new test account using Postman signup first
- ✅ Check database has the user record

## Step 5: Verify Frontend Components are Using Services Correctly

Check these files are using updated services:

1. **Login.jsx** ✅ - Uses `login()` from AuthContext
2. **Signup.jsx** ✅ - Uses `signup()` from AuthContext with correct parameters
3. **AuthContext.jsx** ✅ - Calls authService with correct response structure
4. **authService.js** ✅ - Extracts `response.data.data`
5. **api.js** ✅ - Has `withCredentials: true` and correct baseURL

## Connection Flow Diagram

```
Frontend (http://localhost:5173)
    ↓
1. User clicks Login
2. Calls authService.login(email, password)
    ↓
3. authService calls api.post('/users/login', credentials)
    ↓
4. Axios interceptor adds Authorization header if token exists
    ↓
5. Request sent to http://localhost:4000/api/v1/users/login
    ↓
Backend (http://localhost:4000)
6. Routes through loginUser controller
7. Validates credentials
8. Generates accessToken and refreshToken
9. Returns response with tokens in response.data.data
    ↓
10. Frontend receives response
11. authService extracts tokens and stores in localStorage
12. AuthContext updates user state
13. Frontend redirects to home page
```

## Quick Verification Checklist

- [ ] Backend running on port 4000
- [ ] Frontend running on port 5173
- [ ] Backend `.env` has `CORS_ORIGIN=http://localhost:5173`
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:4000/api/v1`
- [ ] Can see POST request in Network tab when logging in
- [ ] Response status is 200 or 201
- [ ] Tokens appear in localStorage after login
- [ ] User is redirected to home page after successful login
- [ ] Network requests after login include `Authorization` header

## Next Steps After Fixing Login

Once login works, test these in order:

1. **Signup flow** - Test creating a new account
2. **Jobs endpoints** - Test creating/viewing jobs (if recruiter)
3. **Resume upload** - Test uploading resume (if candidate)
4. **Applications** - Test applying for jobs (if candidate)
5. **Admin features** - Test user approval/rejection (if admin)
