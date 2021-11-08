from config import Config
from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

api = Api(app)
cors = CORS(app, resources={"*":{"origins":"*"}})

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import routes