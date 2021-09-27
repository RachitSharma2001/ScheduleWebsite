from flask import jsonify, request, make_response
from app import app, db
from models import Entry

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
@app.route('/addEntry')
# This is what the front end will send us -> user will enter entry content and we need to pass it in 
# to the backend
@app.route('/addEntry/<entryContent>', methods=["GET", "POST"])
def addEntry():
    newEntry = Entry(entryContent="Do HW")
    db.session.add(newEntry)
    db.session.commit(newEntry)