# Run the Flask application
from flask import Flask
from backend import create_app
from flask_cors import CORS

# Create the Flask app using our create_app() function
app = create_app()
CORS(app, supports_credentials=True)

if __name__ == '__main__':
    app.run(debug=True)