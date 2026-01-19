# Frontend-Backend Connection Fixes

## Issues Found and Fixed

### 1. **API Response Structure Mismatch**
**Problem:** Backend returns data in nested structure `response.data.data`, but frontend was looking for `response.data.token`
- Backend response: `{ status: 200, data: { user, accessToken, refreshToken }, message: "..." }`
- Frontend expected: `{ token, user }`

**Fix:**
- Updated `authService.js` to extract from `response.data.data`
- Updated all service files to use `response.data.data` for accessing actual data

### 2. **Token Storage Naming**
**Problem:** Frontend was storing token as `token`, backend uses `accessToken` and `refreshToken`

**Fix:**
- Changed storage from `token` to `accessToken` and `refreshToken`
- Updated all API interceptors to use `accessToken`
- Updated logout to clear both tokens

### 3. **API URL Configuration**
**Problem:** Frontend .env was pointing to `http://localhost:4000` but should point to `/api/v1` endpoint

**Fix:**
- Updated `.env` to: `VITE_API_URL=http://localhost:4000/api/v1`
- Updated `.env.example` to match
- API calls now include base URL with version prefix

### 4. **CORS Configuration**
**Problem:** Backend CORS was configured for `http://localhost:8080` but frontend runs on `http://localhost:5173`

**Fix:**
- Updated backend `.env` CORS_ORIGIN from `http://localhost:8080` to `http://localhost:5173`
- Added `withCredentials: true` to axios instance for cookie support

### 5. **API Route Endpoints**
**Problem:** Frontend service files used incorrect route paths

**Fixes:**
- `jobService.js`: Changed from `/job/*` to `/jobs/*`
- `applicationService.js`: Changed from `/application/*` to `/applications/*`
- `resumeService.js`: Changed from `/resume/upload` to `/resume/uploadResume`
- `userService.js`: Updated all user endpoints to match backend routes

### 6. **Request Method Mismatches**
**Problem:** Some routes used PUT instead of PATCH

**Fixes:**
- Job update: Changed from `.put()` to `.patch()`
- Application status: Changed from `.put()` to `.patch()`
- User profile: Changed from `.put()` to `.patch()`

### 7. **Signup Form Parameters**
**Problem:** Frontend was sending `firstName` and `lastName` but backend expects `fullName`

**Fix:**
- Updated Signup.jsx to use `fullName` field
- Updated role format from `CANDIDATE`/`RECRUITER` to `candidate`/`recruiter` (lowercase)

### 8. **Axios Credentials**
**Problem:** Cookies were not being sent with requests

**Fix:**
- Added `withCredentials: true` to axios create configuration
- This allows cookies to be sent automatically with each request

## Testing the Connection

### Steps to test login:
1. Ensure backend is running: `npm start` in `/backend` folder (should be on port 4000)
2. Ensure frontend is running: `npm run dev` in `/frontend` folder (should be on port 5173)
3. Try logging in with test credentials:
   - Email: use a test email
   - Password: use a test password (minimum 6 characters)

### Debugging tips:
- Open browser DevTools → Network tab
- Monitor API calls and responses
- Check browser Console for errors
- Check browser Application → Storage → Local Storage for tokens

### Common issues:
- **401 Unauthorized**: Token might be expired or not sent properly. Check that `accessToken` is in localStorage
- **CORS Error**: Check that backend `.env` has correct `CORS_ORIGIN`
- **API Not Found (404)**: Check that API routes in services match backend routes
- **Connection Refused**: Ensure backend is running on correct port

## Backend Response Format
All backend endpoints follow this format:
```json
{
  "statusCode": 200,
  "data": {
    // actual response data
  },
  "message": "Success message",
  "success": true
}
```

Frontend services now correctly extract the `data` field using `response.data.data`.
