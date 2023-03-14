import os
import jwt
from database import iot_database
from functools import wraps
from flask import request, jsonify

def token_require(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'access-token' in request.headers:
            token = request.headers['access-token']
        if not token:
            return jsonify({'message' : 'Token is missing'}), 401
        try:
            data = jwt.decode(token, os.getenv['SECRET_KEY'])
            current_user = iot_database._find_data('', '')
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        
        return f(current_user, *args, **kwargs)
  
    return decorator