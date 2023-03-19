import os
import jwt
from database import iot_database
from functools import wraps
from flask import request, jsonify
from error import *
import config 

def token_require(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'access-token' in request.headers:
            token = request.headers['access-token']
        if not token:
            return make_response(data="", status=401, message="Token is missing")
        try:
            data = jwt.decode(token, os.getenv['SECRET_KEY'])
            query = {"public_id": data['public_id']}
            current_user = iot_database.fetch_data(config.database.DOC_USER_LIST, query)
            print(token)
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        
        return f(current_user, *args, **kwargs)
  
    return decorator