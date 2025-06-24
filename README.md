# Job Portal

This repository contains both the frontend and backend for the Job Portal application.

---

## Project Overview

A full-stack job portal web app where:

- Candidates can register, browse jobs, and apply.
- Employers can register (require admin verification), post jobs, and manage applicants.
- Admin can approve/verify employers through Django Admin Panel.

---

## Folder Structure

- `job-portal-backend/` — Django backend source code  
- `job-portal-frontend/` — React frontend source code

---

## Quick Start

### Backend

1. See [job-portal-backend/README.md](job-portal-backend/README.md) for detailed backend setup.

### Frontend

1. See [job-portal-frontend/README.md](job-portal-frontend/README.md) for detailed frontend setup.

---

## Technologies Used

- React, React Router, Bootstrap  
- Django REST Framework, PostgreSQL (SQLite for dev)  
- JWT Authentication  
- Fetch API for HTTP requests
- File upload (Resume handling)
---

Features
Candidate:
 - Register & login as candidate
 - View all jobs
 - Apply to jobs with resume and cover letter
 - View application status: pending, shortlisted, rejected

Employer:
 - Register & login as employer
 - Must be verified by admin before posting jobs
 - Post, edit, and delete jobs after verification
 - View all applicants for their jobs
 - Update status of applications (shortlist/reject)

Admin:
Can verify employers from Django admin panel

##  Deployment Instructions (Render)

This project is deployed using [Render](https://render.com/).

### Requirements
- Python 3.x
- Django
- Gunicorn
- Whitenoise
- dj-database-url

### Deployment Steps:
1. Push your code to GitHub.
2. Create a new Web Service on [Render](https://dashboard.render.com/).
3. Connect your GitHub repo.
4. Set the following:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.wsgi`
   - **Root Directory**: `job-portal-backend` (if applicable)
5. Set environment variables:
   - `DJANGO_SECRET_KEY`
   - `DEBUG=False`
   - `DATABASE_URL` (optional, if using PostgreSQL)
6. Click **Deploy Web Service**.

### Live Link
- [Live Project](https://your-render-url.com)


## Future Improvements

- Polish UI
- Resume file protection

---

## Author

Sumanth

---

