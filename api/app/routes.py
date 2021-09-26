from app import app

@app.route('/')
def homepage():
    return "This is backend"


