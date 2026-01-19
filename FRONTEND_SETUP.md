# InternHub Frontend - Quick Start Guide

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env` file in the `frontend` directory:
```
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Accessing Different Roles

### Candidate Account
- **URL**: http://localhost:3000
- **Access**: 
  - Browse jobs
  - Upload resumes
  - Apply for jobs
  - Track applications
- **Navigation**: Jobs → Applications → Resumes

### Recruiter Account
- **Access**:
  - Post new jobs
  - View job applicants
  - Update applicant status
- **Navigation**: My Jobs → Post Job → View Applicants

### Admin Account
- **Access**:
  - View all users
  - Approve/reject pending recruiters/admins
  - Monitor all jobs
- **Navigation**: Users (with tabs) → Jobs

## File Structure Overview

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth)
│   ├── pages/           # Page components by role
│   ├── services/        # API service functions
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app with routes
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # Full documentation
```

## Key Features Implementation

### Authentication Flow
1. User signs up/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token attached to all API requests
5. Automatic logout on token expiration

### Role-Based Access
- **PrivateRoute** component checks user role
- Routes protected based on user.role
- Unauthorized access redirected to home

### Job Application Flow
1. Candidate uploads resume
2. Candidate browses jobs with filters
3. Candidate selects resume and applies
4. Recruiter views applicants
5. Recruiter updates application status
6. Candidate sees status updates

## API Base URL

The frontend expects the backend API at:
```
http://localhost:5000
```

If your backend runs on a different port, update `.env`:
```
VITE_API_URL=http://localhost:YOUR_PORT
```

## Building for Production

```bash
npm run build
```

Output files will be in the `dist/` folder.

## Common Issues & Solutions

### Cannot connect to backend
- Check if backend is running on port 5000
- Update VITE_API_URL in .env
- Clear browser cache

### Login not working
- Verify backend credentials are correct
- Check backend user exists
- Look at browser console for errors

### File upload failing
- File must be PDF or document
- File size must be < 5MB
- Check backend Cloudinary setup

### Routes not loading
- Ensure backend is running
- Clear localhost cache
- Check browser console for errors

## Development Workflow

1. **Start backend** (in backend folder):
   ```bash
   npm start
   ```

2. **Start frontend** (in frontend folder):
   ```bash
   npm run dev
   ```

3. **Make changes** - Hot reload enabled
4. **Test** - Browser automatically refreshes
5. **Commit** - When ready

## Testing Different Roles

### Create Test Accounts

**Candidate Account**
- Email: candidate@test.com
- Password: test123
- Role: Candidate

**Recruiter Account**
- Email: recruiter@test.com
- Password: test123
- Role: Recruiter
- (Needs admin approval in real scenario)

**Admin Account**
- Email: admin@test.com
- Password: test123
- Role: Admin
- (Needs admin approval in real scenario)

## Features by Role

### Candidate Features
- ✅ Register/Login
- ✅ Browse all jobs
- ✅ Search jobs by title/location
- ✅ View job details
- ✅ Upload multiple resumes
- ✅ Apply for jobs
- ✅ Track application status
- ✅ View applications filtered by status

### Recruiter Features
- ✅ Post new jobs
- ✅ View own job postings
- ✅ Edit/delete jobs
- ✅ View all applicants for a job
- ✅ Update applicant status
- ✅ Track applicant count

### Admin Features
- ✅ View all users
- ✅ View pending approvals
- ✅ Approve/reject users
- ✅ View all jobs
- ✅ Monitor system

## Component Overview

### Common Components
- `Navbar` - Top navigation with role-specific menu
- `Button` - Reusable button with variants
- `Input` - Form input with validation
- `Card` - Container component
- `Modal` - Dialog component
- `Alert` - Notification component
- `PrivateRoute` - Protected route wrapper

### Page Components
- `Home` - Landing page with features
- `Login/Signup` - Authentication
- `JobsList` - All jobs with filters
- `JobDetail` - Single job with apply form
- `CandidateApplications` - My applications
- `CandidateResumes` - Resume management
- `RecruiterJobs` - My job postings
- `PostJob` - Create new job
- `RecruiterJobApplicants` - Job applicants
- `AdminUsers` - User management
- `AdminJobs` - All jobs monitoring

## Styling System

All styles are in `/src/styles/`:
- Colors: Blue (#3498db), Red (#e74c3c), Green (#27ae60)
- Responsive design: Mobile-first approach
- Accessible: WCAG 2.1 compliant

## Next Steps

1. Ensure backend is running and configured
2. Run `npm install` in frontend folder
3. Create `.env` file with API URL
4. Run `npm run dev` to start frontend
5. Create test accounts to verify each role
6. Test the complete workflow

## Support

For issues with:
- **Backend API**: Check backend repository
- **Frontend UI**: Check browser console
- **Authentication**: Verify JWT configuration
- **File Upload**: Check Cloudinary setup

## License

Part of the InternshipPortal project.
