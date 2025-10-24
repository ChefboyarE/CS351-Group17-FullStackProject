from flask import Blueprint, request, jsonify
from backend.trie import Trie

main = Blueprint('main', __name__)

# Initialize Trie
trie = Trie()
sample_words = [
    "tutoring", "therapy", "counseling", "writing",
    "career", "engineering", "library", "lounge"
]
for word in sample_words:
    trie.insert(word)


@main.route("/api/search", methods=["POST"])
def search():
    query = request.form.get("query", "").lower()
    if trie.search(query):
        return jsonify({"found": True, "message": f"'{query}' exists in Trie!"})
    else:
        return jsonify({"found": False, "message": f"'{query}' NOT found in Trie."})

@main.route("/api/suggest", methods=["GET"])
def suggest():
    query = request.args.get("query", "").lower()
    suggestions = []

    def dfs(node, prefix):
        if len(suggestions) >= 5:  # Limit to top 5
            return
        if node.is_word:
            suggestions.append(prefix)
        for char in node.children:
            dfs(node.children[char], prefix + char)

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
