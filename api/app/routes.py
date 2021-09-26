import time
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

@app.route('/time')
def get_current_time():
    return "Hey from backend"
    #return {'time': time.time()}


