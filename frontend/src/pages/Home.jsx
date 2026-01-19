import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { Briefcase, Users, UserCheck, MapPin } from 'lucide-react';
import '../styles/home.css';

export const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const jobsData = await jobService.getAllJobs({});
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Loading Animation */}
      {loading && (
        <section className="hero" style={{minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '30px'
          }}></div>
          <h2 style={{color: 'white', fontSize: '28px', fontWeight: '500'}}>Loading opportunities...</h2>
        </section>
      )}

      {/* Jobs Section - visible for all users */}
      {!loading && (
        <>
          <section style={{padding: '4rem 2rem', backgroundColor: '#f8f9fa', textAlign: 'center', borderBottom: '1px solid #e9ecef'}}>
            <div className="container">
              <h1 style={{fontSize: '32px', marginBottom: '10px', color: '#333'}}>Available Opportunities</h1>
              <p style={{color: '#666', fontSize: '16px', marginBottom: '10px'}}>Explore {jobs.length} exciting internship positions</p>
              {!user && (
                <p style={{color: '#666', fontSize: '14px', marginTop: '15px'}}>
                  <Link to="/login" style={{color: '#3498db', textDecoration: 'none', fontWeight: '600'}}>Login</Link>
                  {' / '}
                  <Link to="/signup" style={{color: '#3498db', textDecoration: 'none', fontWeight: '600'}}>SignUp</Link> to apply for jobs
                </p>
              )}
            </div>
          </section>

          {error ? (
            <div className="container" style={{textAlign: 'center', padding: '3rem 2rem', color: '#e74c3c'}}>
              <p>{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="container" style={{textAlign: 'center', padding: '4rem 2rem', color: '#666'}}>
              <Briefcase size={48} style={{marginBottom: '15px', opacity: 0.5}} />
              <p style={{fontSize: '16px'}}>No jobs available at the moment</p>
            </div>
          ) : (
            <section style={{padding: '1rem 2rem'}}>
              <div className="container">
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <Link 
                      to={user ? `/jobs/${job._id}` : '/login'} 
                      key={job._id} 
                      style={{textDecoration: 'none'}}
                    >
                      <div className="card" style={{height: '100%', cursor: 'pointer', transition: 'all 0.3s'}}>
                        <div style={{marginBottom: '15px'}}>
                          <h3 style={{fontSize: '18px', marginBottom: '5px', color: '#333'}}>{job.title}</h3>
                          <p style={{fontSize: '14px', color: '#666', fontWeight: '500'}}>{job.companyName}</p>
                        </div>
                        
                        <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', color: '#666', fontSize: '13px'}}>
                          <MapPin size={14} />
                          <span>{job.location} {job.isRemote && '(Remote)'}</span>
                        </div>

                        <p style={{fontSize: '13px', color: '#555', marginBottom: '15px', lineHeight: '1.4'}}>
                          {job.description.substring(0, 100)}...
                        </p>

                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px'}}>
                          <span style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {job.jobType}
                          </span>
                          {job.salaryRange && (
                            <span style={{
                              backgroundColor: '#f3e5f5',
                              color: '#7b1fa2',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {job.salaryRange}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* User Dashboard - only for logged-in users */}
      {user && !loading && (
        <section className="dashboard-guide" style={{backgroundColor: '#fff', borderTop: '1px solid #e9ecef', padding: '4rem 2rem'}}>
          <div className="container">
            <h2 style={{marginBottom: '2rem', textAlign: 'center'}}>Your Dashboard</h2>
            <div className="guide-cards">
              {user.role === 'candidate' && (
                <>
                  <Link to="/jobs" className="guide-card">
                    <Briefcase size={32} />
                    <h3>Browse Jobs</h3>
                    <p>Explore all available internship positions</p>
                  </Link>
                  <Link to="/candidate/applications" className="guide-card">
                    <UserCheck size={32} />
                    <h3>My Applications</h3>
                    <p>Track your job applications</p>
                  </Link>
                  <Link to="/candidate/resumes" className="guide-card">
                    <Users size={32} />
                    <h3>My Resumes</h3>
                    <p>Manage your resume uploads</p>
                  </Link>
                </>
              )}
              {user.role === 'recruiter' && (
                <>
                  <Link to="/recruiter/jobs" className="guide-card">
                    <Briefcase size={32} />
                    <h3>My Jobs</h3>
                    <p>Manage job postings</p>
                  </Link>
                  <Link to="/recruiter/post-job" className="guide-card">
                    <UserCheck size={32} />
                    <h3>Post Job</h3>
                    <p>Create a new job posting</p>
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/users" className="guide-card">
                    <Users size={32} />
                    <h3>Manage Users</h3>
                    <p>Review and approve users</p>
                  </Link>
                  <Link to="/admin/jobs" className="guide-card">
                    <Briefcase size={32} />
                    <h3>View Jobs</h3>
                    <p>Monitor all job postings</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
