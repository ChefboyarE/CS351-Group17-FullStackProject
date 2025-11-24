"""
Handles all routes related to authentication and user sessions
Includes login, signup, logout, and a protected dashboard route
"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from backend import db, bcrypt
from backend.models import User, Event
from datetime import datetime, date as dt_date
from backend.bloom_filters import add_event_to_filters

# Create a Blueprint
auth = Blueprint('auth', __name__)


# Signup route (JSON API)
@auth.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()  # get JSON data from React
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    # check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Account created successfully"})



# Login route (JSON API)
@auth.route("/login", methods=['POST'])
def login():
    data = request.get_json()  # get JSON data from React
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401


# Protected dashboard
@auth.route("/dashboard")
@login_required
def dashboard():
    return jsonify({"success": True, "user": {"email": current_user.email}})


# Logout route
@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out"})

# resourcesSubmission route
@auth.route("/resourceSubmission", methods=["POST"])
def resourceSubmission():
    data = request.get_json()
    img = data.get("img").strip()
    title = data.get("title").strip().lower()
    date = data.get("date").strip()
    location = data.get("location").strip().lower()
    description = data.get("description").strip()
    user_today = data.get("today")

    if not all([img, title, date, location, description, user_today]):
        return jsonify({"success": False, "message": "One or more fields are missing"}), 400

    # Use user's local date
    try:
        event_date = datetime.strptime(date, "%Y-%m-%d").date()
        today_date = datetime.strptime(user_today, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"success": False, "message": "Invalid date format"}), 400

    # Correct validation
    if event_date < today_date:
        return jsonify({"success": False, "message": "Event date cannot be in the past"}), 400

    # Duplicate check
    existing_event = Event.query.filter_by(title=title, date=date).first()
    if existing_event:
        return jsonify({"success": False, "message": "Event already exists"}), 400

    try:
        new_event = Event(img=img, title=title, date=date,
                          location=location, description=description)
        db.session.add(new_event)
        db.session.commit()

        add_event_to_filters(new_event)

        return jsonify({"success": True, "message": "Event added successfully"})

    except Exception:
        db.session.rollback()
        return jsonify({"success": False, "message": "Duplicate event not allowed"}), 400

# backend/auth.py
from flask_login import login_required, current_user
from backend.models import Event
from backend import db

# UPDATE event
@auth.route("/events/<int:event_id>", methods=["PUT"])
@login_required
def update_event(event_id):
    event = Event.query.get_or_404(event_id)

    # If you later add owner logic, check:
    # if event.user_id != current_user.id:
    #     return jsonify({"success": False, "message": "Not authorized"}), 403

    data = request.get_json()

    # Update fields if present
    title = data.get("title", "").strip()
    date = data.get("date", "").strip()
    location = data.get("location", "").strip()
    description = data.get("description", "").strip()
    img = data.get("img", "").strip()

    if title:
        event.title = title.lower()
    if date:
        event.date = date
    if location:
        event.location = location.lower()
    if description:
        event.description = description
    if img:
        event.img = img

    db.session.commit()

    return jsonify({"success": True, "message": "Event updated"})


# DELETE event
@auth.route("/events/<int:event_id>", methods=["DELETE"])
@login_required
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)

    # If you later add ownership:
    # if event.user_id != current_user.id:
    #     return jsonify({"success": False, "message": "Not authorized"}), 403

    db.session.delete(event)
    db.session.commit()

    return jsonify({"success": True, "message": "Event deleted"})