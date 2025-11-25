# UIC Campus Events Platform — Group 17

A full-stack web application that allows UIC students to discover, create, and manage campus events.

**Live demo video (2 minutes):** link

## Features Implemented

- User authentication (signup / login / logout)
- Home page with app description and navigation
- Create new events with image upload, title, date, location, description
- Prevents submission of past dates and duplicate events
- Full-text search with real-time autocomplete suggestions
- Filter events using Bloom Filter (second data structure requirement)
- Responsive UI with character limits, counters, and clean layout
- Edit and delete own events (CRUD ownership logic ready on frontend)
- Events display "Submitted by" 
- Scrollbar fixed (no longer overlaps content)
- Redirect to home page after event submission

## Tech Stack

- **Frontend**: React 18, React Router v6, custom CSS
- **Backend**: Flask, Flask-Login, SQLAlchemy, bcrypt
- **Database**: SQLite (development)
- **Additional Data Structure**: Bloom Filter for efficient duplicate checking

## How to Run the Project (works on any machine)

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run