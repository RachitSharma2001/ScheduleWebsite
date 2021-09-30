from app import db
from datetime import datetime

MAXCHARS = 300

# Stores a days todo
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dateOfTodo = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    entries = db.relationship('Entry', lazy='dynamic', backref='todo')

    def getEntries(self):
        return self.entries.all()

    def __repr__(self):
        return 'Todo {}'.format(self.id)

# Stores an entry for a todo
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entryContent = db.Column(db.String(MAXCHARS))
    # shows which todo this entry is apart of
    referenceTodo = db.Column(db.Integer, db.ForeignKey('todo.id'))

    def __repr__(self):
        return 'Entry {}'.format(self.entryContent)