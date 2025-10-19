"""
Was having conflicts with the old users table. This fixes conflicts with the
old users table by creating a new schema. Preserves existing user data while
adding the email column so users can log in.

If we can get it to work without this that would be great but this workaround
is fine for now.
"""
import sqlite3

conn = sqlite3.connect("users.db")
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS user")

cursor.execute("""
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

conn.commit()
conn.close()
print("User table recreated!")
