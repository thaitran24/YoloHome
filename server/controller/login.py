import uuid
import jwt
from functools import wraps
from datetime import datetime, timedelta
from flask_restful import Resource
from flask import Blueprint, request
from middleware import token_require

login_api = Blueprint('login_api', __name__)

@login_api.route('/login', method=['POST'])
@token_require
def login():
    auth = request.form

# @token_require
class LoginAPI(Resource):
    def get(self):
        pass

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

