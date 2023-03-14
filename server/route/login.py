from flask import Blueprint
from flask_restful import Api
from controller import LoginAPI

login_api = Blueprint('login_api', __name__)
api = Api(login_api)

api.add_resource(LoginAPI, '/login')