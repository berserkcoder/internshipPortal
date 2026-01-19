import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Candidate Pages
import { JobsList } from './pages/JobsList';
import { JobDetail } from './pages/JobDetail';
import { CandidateApplications } from './pages/CandidateApplications';
import { CandidateResumes } from './pages/CandidateResumes';

// Recruiter Pages
import { RecruiterJobs } from './pages/RecruiterJobs';
import { PostJob } from './pages/PostJob';
import { RecruiterJobApplicants } from './pages/RecruiterJobApplicants';

// Admin Pages
import { AdminUsers } from './pages/AdminUsers';
import { AdminJobs } from './pages/AdminJobs';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Candidate Routes */}
        <Route
          path="/jobs"
          element={
            <PrivateRoute allowedRoles={['candidate']}>
              <JobsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <PrivateRoute allowedRoles={['candidate']}>
              <JobDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate/applications"
          element={
            <PrivateRoute allowedRoles={['candidate']}>
              <CandidateApplications />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate/resumes"
          element={
            <PrivateRoute allowedRoles={['candidate']}>
              <CandidateResumes />
            </PrivateRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/jobs"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/post-job"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <PostJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/job-applicants/:jobId"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterJobApplicants />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminJobs />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
