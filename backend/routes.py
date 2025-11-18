from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from backend.trie import Trie
from backend.models import Event
from backend import db
from backend.models import Event # used to fetch Event data

# Create a Blueprint for the landing page
main = Blueprint('main', __name__)

# Initialize Trie (temporary; in a real app, you'd load data from the DB)
trie = Trie()
sample_words = ["tutoring", "therapy", "counseling", "writing", "career", "engineering", "library", "lounge"]
for word in sample_words:
    trie.insert(word)

@main.route("/resources")
def resources():
    return render_template("resourceList.html")

@main.route("/index")
def index():
    return render_template("index.html")

# Example search route for your search bar
@main.route("/search", methods=["POST"])
def search():
    query = request.form.get("query", "").strip().lower()

    if not query:
        return jsonify({"result": "No query provided", "matches": []})

    # Search events by title OR location
    matches = Event.query.filter(
        (Event.title.ilike(f"%{query}%")) |
        (Event.location.ilike(f"%{query}%"))
    ).all()

    results = [
        {
            "img": e.img,
            "title": e.title,
            "date": e.date,
            "location": e.location,
            "description": e.description
        }
        for e in matches
    ]

    # Message text for display
    if matches:
        result_text = f"Found {len(matches)} matching events."
    else:
        result_text = "No matching events found."

    return jsonify({
        "result": result_text,
        "matches": results
    })

# helper function to convert entry to dictionary
def entry_to_dict(entry):
    return {
        'img': entry.img,
        'title': entry.title,
        'date': entry.date,
        'location': entry.location,
        'description': entry.description,
    }

# route to fetch resources from database    
@main.route("/getResources", methods=["GET"])
def getResources():
    events = Event.query.all()
    resourceList = [entry_to_dict(entry) for entry in events]
    return jsonify(resourceList)

@main.route("/suggest", methods=["GET"])
def suggest():
    query = request.args.get("query", "").lower()
    suggestions = []

    if not query:
        return jsonify([])

    events = Event.query.all()

    # Collect unique suggestions from title + location
    seen = set()

    for e in events:
        fields = [e.title, e.location]
        for field in fields:
            field_low = field.lower()
            if query in field_low:
                if field not in seen:
                    suggestions.append(field)
                    seen.add(field)

            # Stop at 5 suggestions max
            if len(suggestions) >= 5:
                break
        if len(suggestions) >= 5:
            break

    return jsonify(suggestions)
