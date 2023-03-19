import uuid
import json
import jwt
import config
from functools import wraps
from datetime import datetime, timedelta
from flask_restful import Resource
from flask import Blueprint, request, make_response, jsonify
from middleware import token_require
from database import iot_database
from  werkzeug.security import generate_password_hash, check_password_hash

class LoginAPI(Resource):
    def get(self):
        pass

    @token_require
    def post(self):
        record = json.loads(request.data.decode('UTF-8'))
        print(record['username'], record['password'])
        if not record or not record.get('username') or not record.get('password'):
            return make_response(
                'Could not verify',
                401,
                {'WWW-Authenticate' : 'Basic realm ="Login required !!"'}
            )

        query = {"username": record['username']}
        user_list = iot_database.fetch_data(config.database.DOC_USER_LIST, query)

        if len(user_list) < 1:
            return make_response(
                'Could not verify',
                401,
                {'WWW-Authenticate' : 'Basic realm ="User does not exist !!"'}
            )
        
        user = user_list[0]

        if check_password_hash(user.password, record.get('password')):
            token = jwt.encode({
                'public_id': user.public_id,
                'exp' : datetime.utcnow() + timedelta(minutes = 30)
            }, config.server.SECRET_KEY)
    
            return make_response(jsonify({'token' : token.decode('UTF-8')}), 201)

        return make_response(
            'Could not verify',
            403,
            {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'}
        )

    def put(self):
        pass

    def delete(self):
        pass

