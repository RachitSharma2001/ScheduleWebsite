from flask import jsonify, request, make_response
from app import app, db
from app.models import Todo

''' Code that successfully communicates to backend ''' 
@app.route("/getmessage", methods=["GET", "POST", "OPTIONS"])
def get_current_time():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST" or request.method == "GET":  # Actual Cors request from front end
        jsonMessage = jsonify({'message': "Hi from backend"})
        return _corsify_actual_response(jsonMessage)
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

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
@app.route('/getEntry')
# This is what the front end will send us -> user will enter entry content and we need to pass it in 
# to the backend
@app.route('/getEntry/<todoId>', methods=["GET", "POST"])
def getEntry(todoId=None):
    print("This is the passed in todoId: ", todoId)
    todo = Todo.query.get(todoId)
    print("Todo entry content: ", todo.getEntries()[0].entryContent)
    return todo.getEntries()[0].entryContent

@app.route('/addEntry')
@app.route('/addEntry/<entryTitle>', methods=["GET", "POST", "OPTIONS"])
def addEntry(entryTitle=None):
    print("Entry title called: ", entryTitle)
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  # Actual Cors request from front end
        jsonMessage = jsonify({'message': "Success"})
        return _corsify_actual_response(jsonMessage)
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))
