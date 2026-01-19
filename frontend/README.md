# InternHub Frontend

A modern React-based frontend for the role-based internship portal. This application provides a seamless experience for candidates, recruiters, and admins to manage internship applications.

## Features

### For Candidates
- Browse available jobs with search and filtering
- View detailed job information
- Upload and manage resumes
- Apply for jobs with selected resume
- Track all applications with status updates
- View application status (Applied, Shortlisted, Rejected, Selected)

### For Recruiters
- Post new job opportunities
- Manage job postings (view, edit, delete)
- View all applicants for each job
- Update applicant status (Shortlisted, Rejected, Selected)
- Track application metrics

### For Admins
- View all users in the system
- Approve/reject pending recruiters and admins
- Monitor all job postings
- View application statistics

## Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS3** - Styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Alert.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   └── PrivateRoute.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Home.jsx
│   ├── JobsList.jsx
│   ├── JobDetail.jsx
│   ├── CandidateApplications.jsx
│   ├── CandidateResumes.jsx
│   ├── RecruiterJobs.jsx
│   ├── PostJob.jsx
│   ├── RecruiterJobApplicants.jsx
│   ├── AdminUsers.jsx
│   └── AdminJobs.jsx
├── services/           # API service functions
│   ├── api.js
│   ├── authService.js
│   ├── jobService.js
│   ├── applicationService.js
│   ├── resumeService.js
│   └── userService.js
├── styles/             # CSS files
│   ├── index.css
│   ├── auth.css
│   ├── home.css
│   ├── jobs.css
│   ├── job-detail.css
│   ├── applications.css
│   ├── resumes.css
│   ├── recruiter-jobs.css
│   ├── post-job.css
│   ├── job-applicants.css
│   ├── admin-users.css
│   ├── admin-jobs.css
│   ├── navbar.css
│   ├── button.css
│   ├── input.css
│   ├── modal.css
│   ├── card.css
│   └── alert.css
├── App.jsx            # Main app component with routing
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`. All requests automatically include the JWT token from localStorage.

### Authentication
- JWT tokens are stored in localStorage after login
- Tokens are automatically included in all API requests
- Expired tokens trigger automatic logout and redirect to login

### Key API Endpoints

**Auth**
- `POST /user/login` - User login
- `POST /user/register` - User registration

**Jobs**
- `GET /job/all` - Get all jobs
- `POST /job/post` - Post new job (Recruiter)
- `GET /job/recruiter-jobs` - Get recruiter's jobs
- `GET /job/:id` - Get job details
- `PUT /job/:id` - Update job (Recruiter)
- `DELETE /job/:id` - Delete job (Recruiter)

**Applications**
- `POST /application/apply/:jobId` - Apply for job
- `GET /application/candidate-applications` - Get candidate's applications
- `GET /application/job-applications/:jobId` - Get job's applications (Recruiter)
- `PUT /application/:id` - Update application status

**Resumes**
- `POST /resume/upload` - Upload resume
- `GET /resume/my-resumes` - Get candidate's resumes
- `DELETE /resume/:id` - Delete resume

**Users (Admin)**
- `GET /user/all-users` - Get all users
- `GET /user/pending-users` - Get pending approvals
- `POST /user/approve-user/:id` - Approve user
- `POST /user/reject-user/:id` - Reject user

## Component Usage Examples

### Using PrivateRoute
```jsx
<PrivateRoute allowedRoles={['CANDIDATE']}>
  <JobsList />
</PrivateRoute>
```

### Using useAuth Hook
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  // Use auth context
}
```

### Using Button Component
```jsx
<Button variant="primary" loading={isLoading} onClick={handleClick}>
  Click Me
</Button>
```

## Styling

The application uses CSS files organized by feature. CSS variables can be customized in `index.css` for theming.

### Color Scheme
- Primary: `#3498db` (Blue)
- Danger: `#e74c3c` (Red)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Orange)
- Text: `#2c3e50` (Dark Gray)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. **Hot Module Replacement** - Changes are reflected instantly during development
2. **API Proxy** - The dev server proxies `/api` requests to the backend
3. **DevTools** - React DevTools browser extension recommended

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check VITE_API_URL environment variable
- Clear browser cache and localStorage if token issues persist

### Login/Auth Issues
- Clear localStorage: `localStorage.clear()`
- Check browser console for error messages
- Verify backend is returning valid JWT tokens

### File Upload Issues
- Check file size limits (Max 5MB for resumes)
- Ensure file format is correct (.pdf, .doc, .docx)
- Verify backend file upload configuration

## Contributing

When adding new features:
1. Create feature branch
2. Add component/page in appropriate folder
3. Update App.jsx routes if needed
4. Add corresponding CSS file
5. Test with all user roles

## License

This project is part of the InternshipPortal ecosystem.
