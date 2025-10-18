"""
Define our database for the app
"""
from sqlalchemy.testing.pickleable import User

from backend import db, login_manager
from flask_login import UserMixin

# Flask-Login requires a user loader function that retrieves a user by ID
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# User model for storing login credentials
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)