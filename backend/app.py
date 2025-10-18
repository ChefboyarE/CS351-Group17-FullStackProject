# Run the Flask application
from backend import create_app

# Create the Flask app using our create_app() function
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)