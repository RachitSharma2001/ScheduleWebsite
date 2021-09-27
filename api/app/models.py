from app import db
from datetime import datetime

MAXCHARS = 300

# Stores a days todo
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dateOfTodo = db.Column(db.DateTime, index=True, default=datetime.utcnow)

# Stores an entry for a todo
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entryContent = db.Column(db.String(MAXCHARS))
    # shows which todo this entry is apart of
    referenceTodo = db.relationship(db.Integer, db.ForeignKey('todo.id'))