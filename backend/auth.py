"""
Handles all routes related to authentication and user sessions
Includes login, signup, logout, and a protected dashboard route
"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from backend import db, bcrypt
from backend.models import User, Event

# Create a Blueprint
auth = Blueprint('auth', __name__)

# -----------------------
# Signup route (JSON API)
# -----------------------
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


# -----------------------
# Login route (JSON API)
# -----------------------
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


# -----------------------
# Protected dashboard
# -----------------------
@auth.route("/dashboard")
@login_required
def dashboard():
    return jsonify({"success": True, "user": {"email": current_user.email}})


# -----------------------
# Logout route
# -----------------------
@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out"})

# -----------------------
# resourcesSubmission route
# -----------------------
@auth.route("/resourceSubmission", methods=["POST"])
def resourceSubmission():
    data = request.get_json() # get JSON data from React
    title = data.get("title")
    date = data.get("date")
    location = data.get("location")
    description = data.get("description")
    
    if not data or not title or not date or not location or not description:
        return jsonify({"success": False, "message": "One or more fields are missing"}), 400

    # add event to the databbase
    new_event = Event(title=title, date=date, location=location, description=description)
    db.session.add(new_event)
    db.session.commit()
    # redirect back to resources page
    return jsonify({"success": True, "message": "Event added successfully"})