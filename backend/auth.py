"""
Handles all routes related to authentication and user sessions
Includes login, signup, logout, and a protected dashboard route
"""
from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required, current_user
from backend import db, bcrypt
from backend.models import User

# Create a Blueprint
auth = Blueprint('auth', __name__)

# Redirect root route to the login page
@auth.route("/")
def home():
    return redirect(url_for('auth.login'))

# Handle user login form submission and authentication
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # get the form data
        username = request.form['username']
        password = request.form['password']
        # look for user in database
        user = User.query.filter_by(username=username).first()
        # check to see if user and password match
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            # log in user and store their info
            return redirect(url_for("auth.dashboard"))
        else:
            flash("Login Unsuccessful. Please check username and password.")
    return render_template("login.html")

# Handle user registration for creating a new account
@auth.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        password = bcrypt.generate_password_hash(request.form.get("password")).decode("utf-8")
        # check if username already exists
        if User.query.filter_by(username=username).first():
            flash("Username already exists", "warning")
        else:
            new_user = User(username=username, password=password)
            # add the new user to the database
            db.session.add(new_user)
            db.session.commit()
            flash("Account created successfully", "success")
            # redirect to login page after successful signup
            return redirect(url_for("auth.login"))
    return render_template("signup.html")

# Protected page only visible to logged-in user, if they are not logging in they cannot see page
@auth.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", user=current_user)

# Log out the current user and end their session
@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth.login"))
