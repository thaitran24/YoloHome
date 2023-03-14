from flask import Blueprint
from flask_restful import Api
from controller import MultiRoomAPI, SingleRoomAPI

room_api = Blueprint('room_api', __name__)
api = Api(room_api)

api.add_resource(MultiRoomAPI, '/api/room')
api.add_resource(SingleRoomAPI, '/api/room/<room_id>')