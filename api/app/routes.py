from flask import jsonify, request, make_response
from flask_restful import Resource, reqparse
import json
import pprint
from app import app, db, api
from app.models import User, Todo, Entry
from datetime import datetime

class EntryApi(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('entryTitle', required=True)
        parser.add_argument('todoId', required=True)
        argDict = parser.parse_args()
        newEntry = Entry(entryContent=argDict['entryTitle'], referenceTodo=argDict['todoId'])
        db.session.add(newEntry)
        db.session.commit()
        return {}, 204
    
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('todoId', required=True)
        parser.add_argument('entryId', required=True)
        argDict = parser.parse_args()
        entry = Todo.query.get(int(argDict['todoId'])).getEntry(int(argDict['entryId']))
        entry.setCrossedOut()
        db.session.commit()
        # Its good practice, on successful update, to return the updated object
        return {}, 204

class UserApi(Resource):
    
    def createNewUser(self, email, password):
        userId = len(User.query.all()) + 1
        newUser = User(id=userId, email=email, password=password)
        db.session.add(newUser)
        db.session.commit()
        return userId

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        argDict = parser.parse_args()
    
        userWithEmail = User.query.filter_by(email=argDict['email']).first()
        userWithPass = User.query.filter_by(email=argDict['email'], password=argDict['password']).first()

        if userWithEmail == None:
            return {"failure" : "email"}, 404
        elif userWithPass == None:
            return {"failure" : "password"}, 404
        else:
            return {"userId" : userWithPass.id}, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        argDict = parser.parse_args()
        newUserId = self.createNewUser(argDict['email'], argDict['password'])
        return {}, 200

class TodoApi(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        argDict = parser.parse_args()

        user = User.query.get(argDict['userId'])
        if user == None:
            return {'failure':'User does not exist'}, 404
        todoList = user.getTodosOfUser()
        if todoList == None:
            return {'failure':'Todolist does not exist'}, 404

        todoEntryList = []
        dateList = []
        idList = []
        crossedOutList = []
        for todo in todoList:
            todoEntryList.append(todo.getEntries())
            dateList.append(todo.getDate())
            idList.append(todo.id)
        return {"idList":idList, "todoList":todoEntryList, "dateList":dateList}, 200
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        argDict = parser.parse_args()

        if User.query.get(argDict['userId']) == None:
            return {'failure':'User does not exist'}, 404

        todoId = len(Todo.query.all()) + 1
        date = datetime.now()
        newTodo = Todo(id=todoId, dateOfTodo=date, userOfTodo=argDict['userId'])
        db.session.add(newTodo)
        db.session.commit()
        return {"todoId" : todoId}, 200

api.add_resource(EntryApi, '/v2/entries')
api.add_resource(UserApi, '/v2/users')
api.add_resource(TodoApi, '/v2/todos')