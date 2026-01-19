# Quick Start Guide - InternshipPortal Frontend

## 🚀 Starting the Application

### Step 1: Verify Backend Configuration
```bash
cd backend

# Check .env file has:
PORT=4000
CORS_ORIGIN=http://localhost:5173
# (other settings...)

# Start backend
npm start
```
Expected output: `Server is running at port : 4000`

### Step 2: Start Frontend
```bash
cd frontend

# Check .env file has:
VITE_API_URL=http://localhost:4000/api/v1

# Start frontend
npm run dev
```
Expected output: `➜ Local: http://localhost:5173/`

---

## 📱 Testing User Flows

### Create Test Accounts

#### 1️⃣ Create Candidate Account
```
Navigate to: http://localhost:5173/signup

Full Name: John Candidate
Email: candidate@test.com
Password: password123
Role: Candidate
→ Click Sign Up
→ Auto redirects to home (candidates are auto-approved)
```

#### 2️⃣ Create Recruiter Account
```
Navigate to: http://localhost:5173/signup

Full Name: Jane Recruiter
Email: recruiter@test.com
Password: password123
Role: Recruiter
→ Click Sign Up
→ Account status: PENDING (needs admin approval)
→ For testing, manually update in MongoDB or skip admin approval
```

---

## 👤 Test as Candidate

### Journey 1: Browse & Apply for Job

1. **Login as Candidate**
   ```
   Email: candidate@test.com
   Password: password123
   ```

2. **Upload Resume**
   - Click "My Resumes" in dashboard
   - Click "Upload Resume"
   - Select PDF/Word file (max 5MB)
   - Click "Upload Resume"
   - ✅ Resume appears in your list

3. **Browse Jobs**
   - Click "Browse Jobs" in dashboard
   - OR Navigate to `/jobs`
   - See all available jobs
   - Try filtering by title or location

4. **View Job Details**
   - Click on any job card
   - See full description, required skills, salary, etc.

5. **Apply for Job**
   - Click "Apply for this Job"
   - Select your resume from dropdown
   - Click "Apply Now"
   - ✅ Success message appears

6. **Check Applications**
   - Click "My Applications" in dashboard
   - See your application
   - See current status (initially "applied")
   - Check "Applied On" date

---

## 👔 Test as Recruiter

### Journey 2: Post Job & Review Applicants

1. **Login as Recruiter**
   ```
   Email: recruiter@test.com
   Password: password123
   ```

2. **Post a Job**
   - Click "Post Job" in dashboard
   - Fill in all fields:
     ```
     Job Title: Frontend Developer
     Company Name: Tech Corp
     Description: Looking for a passionate frontend developer...
     Location: San Francisco, CA
     Job Type: Full-time
     Experience Level: Entry-level
     Remote: Check if yes
     Salary Range: $50,000 - $80,000 per year
     Required Skills: React, JavaScript, HTML, CSS
     Expiration Date: Pick a future date
     ```
   - Click "Post Job"
   - ✅ Redirects to "My Jobs"

3. **View Your Jobs**
   - Click "My Jobs" in dashboard
   - See your posted job
   - Shows status (draft/open), application count
   - Actions available: View Applicants, Edit, Delete

4. **View Job Applicants**
   - Click "View Applicants" on your job
   - See all candidates who applied
   - See their name, email, application date
   - Download their resume

5. **Update Application Status**
   - For each applicant, use dropdown to change status:
     - Applied → Shortlisted → Hired
     - Applied → Rejected
   - ✅ Status updates immediately
   - ✅ Candidate will see status change in their applications

---

## 📊 Database Testing Tips

### Check MongoDB Data

```javascript
// View jobs in database
db.jobs.find()

// View applications
db.applications.find()

// View resumes
db.resumes.find()

// View users
db.users.find()
```

---

## ✅ Complete Test Checklist

- [ ] Backend starts on port 4000
- [ ] Frontend starts on port 5173
- [ ] Can login with candidate account
- [ ] Can login with recruiter account
- [ ] Candidate can upload resume
- [ ] Candidate can see list of jobs
- [ ] Candidate can see job details
- [ ] Candidate can apply for job
- [ ] Candidate can view their applications
- [ ] Recruiter can post a job
- [ ] Recruiter can see their jobs
- [ ] Recruiter can view applicants for job
- [ ] Recruiter can update application status
- [ ] Candidate sees updated application status
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 🐛 Troubleshooting

### Issue: "Cannot read property 'data' of undefined"
**Cause:** API endpoint not found or incorrect path
**Solution:** Check backend console, verify endpoint in service file

### Issue: CORS Error
**Cause:** Backend CORS_ORIGIN doesn't match frontend URL
**Solution:** 
```bash
# Backend .env
CORS_ORIGIN=http://localhost:5173
# Restart backend
```

### Issue: Login fails but works in Postman
**Solution:** Check that:
- Role in database is lowercase: `candidate`, `recruiter`
- Token is being stored as `accessToken` (check localStorage)
- API URL in frontend .env includes `/api/v1`

### Issue: Resume upload fails
**Solution:** Check that:
- File is PDF or Word (.pdf, .doc, .docx)
- File size is less than 5MB
- Cloudinary credentials are correct in backend .env

### Issue: Application not appearing in recruiter view
**Solution:**
- Wait a moment for data to sync
- Refresh the page
- Check backend console for errors
- Verify resume exists before applying

---

## 📝 Example API Testing with Curl

```bash
# Login
curl -X POST http://localhost:4000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@test.com","password":"password123"}'

# Get all jobs
curl http://localhost:4000/api/v1/jobs

# Post a job (needs JWT token)
curl -X POST http://localhost:4000/api/v1/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"DevOps Engineer",
    "description":"Join our devops team",
    "location":"New York",
    "companyName":"TechCorp",
    "jobType":"full-time",
    "isRemote":true,
    "requiredSkills":["Docker","Kubernetes"],
    "expiresAt":"2026-02-28"
  }'
```

---

## 🎯 Key Points to Remember

1. **Roles are lowercase**: `candidate`, `recruiter`, `admin` (not uppercase)
2. **Resume is required**: Candidates must upload before applying
3. **Job expiration**: Must be a future date
4. **Status values**: Use lowercase: `applied`, `shortlisted`, `rejected`, `hired`
5. **API prefix**: All requests go to `/api/v1`
6. **Token storage**: Stored as `accessToken` and `refreshToken`

---

## 🎉 You're Ready!

All features are working. Start testing and using your internship portal!

For any issues, check:
1. Browser DevTools (Network & Console tabs)
2. Backend console for logs
3. Database for actual stored data
4. This guide's troubleshooting section
