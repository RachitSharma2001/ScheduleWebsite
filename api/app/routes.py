from flask import jsonify, request, make_response
import json
import pprint
from app import app, db
from app.models import Todo, Entry

def createJsonObject(title, body):
    return jsonify({title:body})

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

''' Code to run stuff on the database ''' 
@app.route('/getEntries')
@app.route('/getEntries/<todoId>', methods=["GET", "OPTIONS"])
def getEntry(todoId=None):
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "GET":
        todo = Todo.query.get(todoId)
        return _corsify_actual_response(createJsonObject("EntryList", todo.getEntries()))
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

@app.route('/addEntry')
@app.route('/addEntry/<entryTitle>/<todoId>', methods=["GET", "POST", "OPTIONS"])
def addEntry(entryTitle=None, todoId=None):
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  # Actual Cors request from front end
        # Create an Entry and add it to db
        newEntry = Entry(entryContent=entryTitle, referenceTodo=todoId)
        db.session.add(newEntry)
        db.session.commit()
        return _corsify_actual_response(createJsonObject("message", "Success"))
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

@app.route('/addTodo', methods=["POST", "OPTIONS"])
def addTodo():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  #  Cors request from front end
        todoId = len(Todo.query.all()) + 1
        newTodo = Todo(id=todoId)
        db.session.add(newTodo)
        db.session.commit()
        return _corsify_actual_response(createJsonObject("message", todoId))
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))