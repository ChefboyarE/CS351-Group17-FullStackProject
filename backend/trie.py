from backend.models import User
from backend import db


class Node:
    def __init__(self):
        self.children = {}
        self.is_word = False


class Trie:
    """ A class for the Trie """

    def __init__(self):
        self.root = Node()
        self.word_count = 0

    def insert(self, word: str) -> bool:
        if not word.isalpha():
            return False

        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = Node()
            node = node.children[char]

        if node.is_word:
            return False
        node.is_word = True
        self.word_count += 1
        return True

    def search(self, word):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_word

    def words(self) -> list[str]:
        result = []

        def allWords(node, path):
            if node.is_word:
                result.append(''.join(path))
            for char in sorted(node.children.keys()):
                allWords(node.children[char], path + [char])

        allWords(self.root, [])
        return result
