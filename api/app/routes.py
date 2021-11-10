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
        return {}, 204

api.add_resource(EntryApi, '/v2/entries')
api.add_resource(UserApi, '/v2/users')
api.add_resource(TodoApi, '/v2/todos')


# ''' Functions to create jsons given parameters '''
# def createJsonObject(title, body, secondTitle=None, secondBody=None, thirdTitle=None, thirdBody=None, fourthTitle=None, fourthBody=None):
#     if secondTitle == None and thirdTitle == None:
#         return jsonify({title:body})
#     if thirdTitle == None:
#         return jsonify({title:body, secondTitle:secondBody})
#     if fourthTitle == None:
#         return jsonify({title:body, secondTitle:secondBody, thirdTitle:thirdBody})
#     return jsonify({title:body, secondTitle:secondBody, thirdTitle:thirdBody, fourthTitle:fourthBody})

# def _build_cors_preflight_response():
#     response = make_response()
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add('Access-Control-Allow-Headers', "*")
#     response.headers.add('Access-Control-Allow-Methods', "*")
#     return response

# def _corsify_actual_response(response):
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

# # Handle requests based on entries
# @app.route('/api/entry/<entryTitle>/<todoId>', methods=["POST", "OPTIONS"])
# @app.route('/api/entry/<todoId>/<entryId>', methods=["PUT", "OPTIONS"])
# def entry(entryTitle=None, todoId=None, entryId=None):
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#     # If given a POST request, add the given todo
#     elif request.method == "POST":
#         if entryTitle == None or todoId == None:
#             raise RuntimeError("Given POST method yet didn't give entryTitle or todoId")
#         newEntry = Entry(entryContent=entryTitle, referenceTodo=todoId)
#         db.session.add(newEntry)
#         db.session.commit()
#         return _corsify_actual_response(createJsonObject("message", "Success"))
#     # If given a PUT request, cross out the todo
#     elif request.method == "PUT":
#         if todoId == None or entryId == None:
#             raise RuntimeError("Given PUT method yet didn't give entryId or todoId")
#         entry = Todo.query.get(int(todoId)).getEntry(int(entryId))
#         entry.setCrossedOut()
#         db.session.commit()
#         return _corsify_actual_response(createJsonObject("message", "Success"))
#     else:
#         raise RuntimeError("Don't know how to handle method {}".format(request.method))

# @app.route('/api/todo/<userId>', methods=["POST", "GET", "OPTIONS"])
# # Handles requests based on the todos
# def todo(userId=None):
#     if request.method == "OPTIONS": # CORS preflight
#         return _build_cors_preflight_response()
#     # If a GET request, return list of all todos associated to user
#     elif request.method == "GET":
#         todoList = User.query.get(userId).getTodosOfUser()
#         todoEntryList = []
#         dateList = []
#         idList = []
#         crossedOutList = []
#         for todo in todoList:
#             todoEntryList.append(todo.getEntries())
#             dateList.append(todo.getDate())
#             idList.append(todo.id)
#         return _corsify_actual_response(createJsonObject("idList", idList, "todoList", todoEntryList, "dateList", dateList))
#     # If a POST request, create a new todo
#     elif request.method == "POST":
#         todoId = len(Todo.query.all()) + 1
#         date = datetime.now()
#         newTodo = Todo(id=todoId, dateOfTodo=date, userOfTodo=userId)
#         db.session.add(newTodo)
#         db.session.commit()
#         return _corsify_actual_response(createJsonObject("todoId", todoId))
#     else:
#         raise RuntimeError("Don't know how to handle method {}".format(request.method))

# def createNewUser(email, password):
#     userId = len(User.query.all()) + 1
#     newUser = User(id=userId, email=email, password=password)
#     db.session.add(newUser)
#     db.session.commit()
#     return userId

# @app.route('/api/user/<email>/<password>', methods=["GET", "POST", "OPTIONS"])
# # Handles requests related to users
# def user(email=None, password=None):
#     # CORS preflight
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#     # If a GET request, return whether the user exists
#     elif request.method == "GET":
        
#         userWithEmail = User.query.filter_by(email=email).first()
#         userWithPass = User.query.filter_by(email=email, password=password).first()

#         if userWithEmail == None:
#             return _corsify_actual_response(createJsonObject("message", "fail", "reason", "email"))
#         elif userWithPass == None:
#             return _corsify_actual_response(createJsonObject("message", "fail", "reason", "password"))
#         else:
#             return _corsify_actual_response(createJsonObject("message", "success", "userId", userWithPass.id))
#     # If a POST request, create a new user with given credentials
#     elif request.method == "POST":
#         newUserId = createNewUser(email, password)
#         return _corsify_actual_response(createJsonObject("message", "Success"))
#     else:
#         raise RuntimeError("Don't know how to handle method {}".format(request.method))
