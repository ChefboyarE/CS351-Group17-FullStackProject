from flask import Blueprint, render_template, request, jsonify
from backend.trie import Trie

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
    query = request.form.get("query", "")
    if trie.search(query):
        return jsonify({"result": f"'{query}' exists in Trie!"})
    else:
        return jsonify({"result": f"'{query}' NOT found in Trie."})

@main.route("/suggest", methods=["GET"])
def suggest():
    query = request.args.get("query", "").lower()
    suggestions = []

    # Simple Trie traversal to get suggestions
    def dfs(node, prefix):
        if len(suggestions) >= 5:  # limit to top 5 suggestions
            return
        if node.is_word:
            suggestions.append(prefix)
        for char in node.children:
            dfs(node.children[char], prefix + char)

    # Traverse Trie from query prefix
    node = trie.root
    for char in query:
        if char in node.children:
            node = node.children[char]
        else:
            node = None
            break

    if node:
        dfs(node, query)

    return jsonify(suggestions)
