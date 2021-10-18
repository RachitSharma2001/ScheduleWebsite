from app import db
from datetime import datetime

MAXCHARS = 300

# Stores Users of website
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    # One to many relationship between User and Todos
    todolist = db.relationship('Todo', lazy='dynamic', backref='user')

    def getTodosOfUser(self):
        userTodolist = []
        for todo in self.todolist:
            userTodolist.append(todo)
        return userTodolist

    def __repr__(self):
        return 'User {}'.format(self.id)

# Stores a days todo
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dateOfTodo = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    entries = db.relationship('Entry', lazy='dynamic', backref='todo')
    userOfTodo = db.Column(db.Integer, db.ForeignKey('user.id'))

    def createEntriesList(self, entries):
        entryList = []
        for entry in entries:
            entryList.append([entry.entryContent, entry.getCrossedOut()])
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

    def getCrossedOut(self):
        return str(self.crossedOut)

    def setCrossedOut(self):
        self.crossedOut = True

    def __repr__(self):
        return 'Entry: {}'.format(self.id)