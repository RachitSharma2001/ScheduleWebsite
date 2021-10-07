from app import db
from datetime import datetime

MAXCHARS = 300

# Stores a days todo
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dateOfTodo = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    entries = db.relationship('Entry', lazy='dynamic', backref='todo')

    def createEntriesList(self, entries):
        entryList = []
        for entry in entries:
            entryList.append([entry.entryContent, entry.crossedOut])
        return entryList

    def getDate(self):
        return self.dateOfTodo.strftime("%D")

    def getEntries(self):
        return self.createEntriesList(self.entries.all())

    def getEntry(self, entryId):
        return self.entries.__getitem__(entryId)
    
    def __repr__(self):
        return 'Todo {}'.format(self.id)

# Stores an entry for a todo
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entryContent = db.Column(db.String(MAXCHARS))
    crossedOut = db.Column(db.Boolean)
    # shows which todo this entry is apart of
    referenceTodo = db.Column(db.Integer, db.ForeignKey('todo.id'))

    def setCrossedOut(self):
        self.crossedOut = not self.crossedOut

    def __repr__(self):
        return 'Entry: {}'.format(self.entryContent)