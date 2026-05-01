from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            due_date TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = get_db()
    tasks = conn.execute("SELECT * FROM tasks ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify([dict(t) for t in tasks])

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    conn = get_db()
    conn.execute("INSERT INTO tasks (title, due_date) VALUES (?, ?)",
                 (data['title'], data['due_date']))
    conn.commit()
    conn.close()
    return jsonify({"status": "created"})

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.json
    conn = get_db()
    conn.execute("UPDATE tasks SET title=?, completed=?, due_date=? WHERE id=?",
                 (data['title'], data['completed'], data['due_date'], id))
    conn.commit()
    conn.close()
    return jsonify({"status": "updated"})

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    conn = get_db()
    conn.execute("DELETE FROM tasks WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)