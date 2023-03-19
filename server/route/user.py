from flask import Blueprint
from flask_restful import Api
from controller import LoginAPI, UserAPI, SignupAPI

login_api = Blueprint('login_api', __name__)
api = Api(login_api)

api.add_resource(LoginAPI, '/login')
api.add_resource(SignupAPI, '/signup')
api.add_resource(UserAPI, '/api/v1/user/<user_id>')