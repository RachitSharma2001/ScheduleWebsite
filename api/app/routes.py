from flask import jsonify, request, make_response
import json
import pprint
from app import app, db
from app.models import Todo, Entry
from datetime import datetime

''' Functions to create jsons given parameters '''
def createJsonObject(title, body, secondTitle=None, secondBody=None, thirdTitle=None, thirdBody=None, fourthTitle=None, fourthBody=None):
    if secondTitle == None and thirdTitle == None:
        return jsonify({title:body})
    if thirdTitle == None:
        return jsonify({title:body, secondTitle:secondBody})
    if fourthTitle == None:
        return jsonify({title:body, secondTitle:secondBody, thirdTitle:thirdBody})
    return jsonify({title:body, secondTitle:secondBody, thirdTitle:thirdBody, fourthTitle:fourthBody})

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# Handle requests based on entries
@app.route('/api/entry/<entryTitle>/<todoId>', methods=["POST", "OPTIONS"])
@app.route('/api/entry/<todoId>/<entryId>', methods=["PUT", "OPTIONS"])
def entry(entryTitle=None, todoId=None, entryId=None):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # If given a POST request, add the given todo
    elif request.method == "POST":
        if entryTitle == None or todoId == None:
            raise RuntimeError("Given POST method yet didn't give entryTitle or todoId")
        newEntry = Entry(entryContent=entryTitle, referenceTodo=todoId)
        db.session.add(newEntry)
        db.session.commit()
        return _corsify_actual_response(createJsonObject("message", "Success"))
    # If given a PUT request, cross out the todo
    elif request.method == "PUT":
        if todoId == None or entryId == None:
            raise RuntimeError("Given PUT method yet didn't give entryId or todoId")
        entry = Todo.query.get(int(todoId)).getEntry(int(entryId))
        entry.setCrossedOut()
        db.session.commit()
        return _corsify_actual_response(createJsonObject("message", "Success"))
    else:
        raise RuntimeError("Don't know how to handle method {}".format(request.method))

@app.route('/api/todo', methods=["POST", "GET", "OPTIONS"])
# Handles requests based on the todos
def todo():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    # If a GET request, return list of all todos
    elif request.method == "GET":
        todoList = Todo.query.all()
        todoEntryList = []
        dateList = []
        idList = []
        crossedOutList = []
        for todo in todoList:
            todoEntryList.append(todo.getEntries())
            dateList.append(todo.getDate())
            idList.append(todo.id)
        return _corsify_actual_response(createJsonObject("idList", idList, "todoList", todoEntryList, "dateList", dateList))
    # If a POST request, create a new todo
    elif request.method == "POST":
        todoId = len(Todo.query.all()) + 1
        date = datetime.now()
        newTodo = Todo(id=todoId, dateOfTodo=date)
        db.session.add(newTodo)
        db.session.commit()
        return _corsify_actual_response(createJsonObject("todoId", todoId))
    else:
        raise RuntimeError("Don't know how to handle method {}".format(request.method))
