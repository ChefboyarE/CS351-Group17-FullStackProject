"""
Used to initialize the Flask app and all the extensions, as well
as setting up the database connections
"""

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy


# Initialize the Flask extensions
db = SQLAlchemy()
login_manager = LoginManager()
bcrypt = Bcrypt()

"""Create out create_app function that sets up our app configuration, initialize our extensions with our app instance,
set up the Flask-Login configuration, import and register authentication routes, and create database tables 
if they don't exist.
"""
def create_app():
    # app config
    app = Flask(__name__, static_folder="../frontend/static", template_folder="../frontend/templates")
    app.config["SECRET_KEY"] = "your_secret_key_here"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///../users.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # initialize app instance
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # login config
    login_manager.login_view = "auth.login"
    login_manager.login_message_category = "info"

    # register authentication routes
    from backend.auth import auth
    app.register_blueprint(auth)

    from backend import models

    # testing for the search bar
    from backend.routes import main
    app.register_blueprint(main)

    # testing
    print("Database URI:", app.config["SQLALCHEMY_DATABASE_URI"])

    return app