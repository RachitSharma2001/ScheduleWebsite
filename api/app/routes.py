import time
from flask import jsonify, request, make_response
from app import app
'''
@app.route('/getmessage')
def homepage():
    print("We came to the backend!")
    return {"message": "From backend"
    
    }
    import time
from flask import Flask

app = Flask(__name__)'''

@app.route("/time", methods=["GET", "POST", "OPTIONS"])
def get_current_time():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST" or request.method == "GET":  # Actual Cors request from front end
        jsonTime = jsonify({'time': time.time()})
        print("We are in the backend, here is jsonTime: ", jsonTime)
        return _corsify_actual_response(jsonTime)
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

'''
@app.route('/time')
def get_current_time():
    print("We have been called!")
    #return "Hey from backend"
    return jsonify({'time': time.time()})
'''
