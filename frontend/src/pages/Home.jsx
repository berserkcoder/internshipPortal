import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { Briefcase, Users, UserCheck, MapPin, Building, Search, DollarSign, Clock, PlusCircle, Activity } from 'lucide-react';
import '../styles/home.css';

export const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      let jobsData = [];
      
      // If recruiter, get their own jobs for the dashboard feed
      if (user && user.role === 'recruiter') {
         jobsData = await jobService.getRecruiterJobs();
      } else {
         jobsData = await jobService.getAllJobs({});
      }
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const renderRecruiterView = () => (
    <div className="home-container animate-fade-in">
      {/* Recruiter Hero Section */}
      <section className="hero recruiter-hero">
        <div className="hero-content">
          <h1>Discover Top Talent. Build Your Team.</h1>
          <p>Manage your internship postings and review applications seamlessly on InternHub.</p>
          <div className="flex-center mt-3">
             <Link to="/recruiter/post-job" className="btn btn-primary" style={{
                background: 'white', color: 'var(--primary-color)', padding: '0.85rem 2.5rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <PlusCircle size={20} style={{marginRight: '8px', verticalAlign: 'text-bottom'}} /> 
                Post a New Job
             </Link>
          </div>
        </div>
      </section>

      {/* Recruiter Dashboard Layout */}
      <div className="container layout-two-column mb-5">
        {/* Left Sidebar Menu */}
        <aside className="sidebar">
           <div className="glass-card p-3 mb-3 user-summary-card">
               <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                  {user.fullName.charAt(0).toUpperCase()}
               </div>
               <h3>{user.fullName}</h3>
               <p className="user-role-badge" style={{color: '#059669', backgroundColor: 'rgba(16, 185, 129, 0.1)'}}>{user.role}</p>
               <div className="user-quick-links mt-3" style={{textAlign: 'left'}}>
                 <Link to="/recruiter/jobs"><Briefcase size={16} /> My Postings</Link>
                 <Link to="/recruiter/post-job"><PlusCircle size={16} /> Post New Job</Link>
               </div>
           </div>
           <div className="glass-card p-3">
             <h4 style={{color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem'}}>Need Help?</h4>
             <p style={{fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem'}}>Check our employer guides to optimize your job posts.</p>
             <button className="btn btn-secondary btn-full" style={{padding: '0.5rem'}}>View Guides</button>
           </div>
        </aside>

        {/* Recruiter Main Feed */}
        <main className="main-feed">
           {/* Quick Stats */}
           <div className="recruiter-stats-grid mb-4">
              <div className="glass-card stat-card">
                 <div className="stat-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}>
                    <Briefcase size={24} />
                 </div>
                 <div className="stat-info">
                    <p>Active Postings</p>
                    <h3>{jobs.length}</h3>
                 </div>
              </div>
              <div className="glass-card stat-card">
                 <div className="stat-icon" style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)'}}>
                    <Users size={24} />
                 </div>
                 <div className="stat-info">
                    <p>Total Applicants</p>
                    <h3>--</h3>
                 </div>
              </div>
              <div className="glass-card stat-card">
                 <div className="stat-icon" style={{color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)'}}>
                    <Activity size={24} />
                 </div>
                 <div className="stat-info">
                    <p>Profile Views</p>
                    <h3>--</h3>
                 </div>
              </div>
           </div>

           <div className="feed-header flex-between mb-3">
             <h2 className="section-title" style={{fontSize: '1.5rem', margin: 0}}>Your Recent Postings</h2>
             <Link to="/recruiter/jobs" style={{color: 'var(--primary-color)', fontWeight: '600'}}>View All &rarr;</Link>
           </div>

           {loading ? (
            <div className="flex-center" style={{ minHeight: '200px' }}>
              <div className="loader-spinner"></div>
            </div>
           ) : jobs.length === 0 ? (
            <div className="glass-card flex-center flex-column p-5 text-center text-muted">
              <Search size={48} style={{ marginBottom: '15px', color: 'var(--border-color)' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't posted any jobs yet.</p>
              <Link to="/recruiter/post-job" className="btn btn-primary">Create Your First Post</Link>
            </div>
           ) : (
            <div className="jobs-list">
              {jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="job-list-card animate-fade-in" style={{borderLeft: '4px solid #10b981'}}>
                  <div className="job-logo-placeholder">
                    {job.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div className="job-main-info">
                    <Link to={`/recruiter/job-applicants/${job._id}`} className="job-title-link">
                      <h3 className="job-title">{job.title}</h3>
                    </Link>
                    <div className="job-meta-row mt-1">
                      <span className="meta-item"><MapPin size={14} /> {job.location}</span>
                      <span className="meta-item"><Clock size={14} /> {job.jobType}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                     <Link to={`/recruiter/job-applicants/${job._id}`} className="btn btn-secondary apply-btn" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderColor: 'transparent'}}>
                        Manage
                     </Link>
                  </div>
                </div>
              ))}
            </div>
           )}
        </main>
      </div>
    </div>
  );

  const renderCandidateView = () => (
    <div className="home-container animate-fade-in">
      {/* Search Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Next Opportunity</h1>
          <p>Discover top-tier internships and build your professional network.</p>
          
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="search-input-wrapper">
              <MapPin className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="City, state, or 'Remote'" 
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn">
              Search Jobs
            </button>
          </form>

          {!user && (
            <div className="flex-center mt-3" style={{ gap: '1rem', marginTop: '2rem' }}>
              <span style={{opacity: 0.8}}>New to InternHub?</span>
              <Link to="/signup" style={{color: 'white', fontWeight: 'bold', textDecoration: 'underline'}}>Create an Account</Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Layout (Two Column) */}
      <div className="container layout-two-column mb-5">
        
        {/* Sidebar Filters */}
        <aside className="sidebar">
          {user && (
             <div className="glass-card p-3 mb-3 user-summary-card">
               <div className="user-avatar">
                  {user.fullName.charAt(0).toUpperCase()}
               </div>
               <h3>{user.fullName}</h3>
               <p className="user-role-badge">{user.role}</p>
               <div className="user-quick-links mt-3" style={{textAlign: 'left'}}>
                 <Link to="/candidate/applications"><Briefcase size={16} /> My Applications</Link>
                 <Link to="/candidate/resumes"><Users size={16} /> My Resumes</Link>
               </div>
             </div>
          )}

          <div className="glass-card filter-card p-3">
            <h3 className="filter-title">Filters</h3>
            
            <div className="filter-group">
              <h4>Job Type</h4>
              <label className="checkbox-label"><input type="checkbox" /> Full-time</label>
              <label className="checkbox-label"><input type="checkbox" /> Part-time</label>
              <label className="checkbox-label"><input type="checkbox" /> Internship</label>
            </div>

            <div className="filter-group">
              <h4>Work Setup</h4>
              <label className="checkbox-label"><input type="checkbox" /> On-site</label>
              <label className="checkbox-label"><input type="checkbox" /> Remote</label>
              <label className="checkbox-label"><input type="checkbox" /> Hybrid</label>
            </div>
            
            <button className="btn btn-secondary btn-full mt-2" style={{padding: '0.5rem'}}>Clear Filters</button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="main-feed">
          <div className="feed-header flex-between mb-3">
            <h2 className="section-title" style={{fontSize: '1.5rem', margin: 0}}>Recommended Jobs</h2>
            <span style={{color: 'var(--text-muted)'}}>{jobs.length} results</span>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '200px', flexDirection: 'column' }}>
              <div className="loader-spinner"></div>
            </div>
          ) : error ? (
            <div className="glass-card p-4 text-center" style={{ color: 'var(--danger)' }}>
              <p>{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card flex-center flex-column p-5 text-center text-muted">
              <Search size={48} style={{ marginBottom: '15px', color: 'var(--border-color)' }} />
              <p style={{ fontSize: '1.1rem' }}>No jobs match your search.</p>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job._id} className="job-list-card animate-fade-in">
                  <div className="job-logo-placeholder">
                     {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  
                  <div className="job-main-info">
                    <Link to={user ? `/jobs/${job._id}` : '/login'} className="job-title-link">
                      <h3 className="job-title">{job.title}</h3>
                    </Link>
                    <div className="job-company-name">
                      {job.companyName}
                    </div>
                    
                    <div className="job-meta-row mt-1">
                      <span className="meta-item"><MapPin size={14} /> {job.location} {job.isRemote && '(Remote)'}</span>
                      {job.salaryRange && <span className="meta-item"><DollarSign size={14} /> {job.salaryRange}</span>}
                      <span className="meta-item"><Clock size={14} /> {job.jobType}</span>
                    </div>

                    <p className="job-desc-snippet mt-2">
                       {job.description && job.description.length > 150 
                          ? job.description.substring(0, 150) + '...' 
                          : job.description}
                    </p>
                  </div>

                  <div className="job-actions">
                     <Link to={user ? `/jobs/${job._id}` : '/login'} className="btn btn-primary apply-btn">
                        View Job
                     </Link>
                     <span className="posted-time">Posted recently</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return user && user.role === 'recruiter' ? renderRecruiterView() : renderCandidateView();
};
