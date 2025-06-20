# Job Portal Backend

This is the backend REST API for a Job Portal application built with Django and Django REST Framework. It supports user registration with roles (Employer/Candidate), JWT authentication, job posting, job applications, filtering, pagination, and application status tracking.

---

## Features

- User registration with role (Employer or Candidate)
- JWT-based authentication
- Employers can post jobs
- Candidates can apply to jobs
- Candidates can view their applications
- Employers can view applicants for their jobs
- Job filtering, searching, sorting, and pagination
- Application statuses: Pending, Shortlisted, Rejected
- Signals to automatically create user profiles on registration
- Permissions to restrict actions by user role
- Email notifications on application status changes (optional)

---

## Setup Instructions

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Installation

1. Clone the repo:

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>

2. Create and activate a virtual environment:
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

3. Install dependencies:
pip install -r requirements.txt

4. Configure environment variables:
Create a .env file or set environment variables for sensitive data like:

DJANGO_SECRET_KEY

EMAIL_HOST_USER (if enabling email)

EMAIL_HOST_PASSWORD

5. Run migrations:
python manage.py migrate

6.Run the development server:
python manage.py runserver


-------API Endpoints Overview-----------------

POST /api/register/ - Register user with role

POST /api/token/ - Obtain JWT token (login)

GET /api/jobs/ - List jobs (with filters)

POST /api/jobs/ - Post a new job (Employer only)

POST /api/applications/ - Apply for a job (Candidate only)

GET /api/my-applications/ - View your job applications (Candidate)

GET /api/jobs/<job_id>/applicants/ - View applicants for your job (Employer)

PATCH /api/applications/<application_id>/update_status/ - Update application status (Employer)



---------NOTES----------
Email notifications on status change require SMTP credentials; can be skipped safely during development.

Permissions are enforced via DRF's permission classes.



