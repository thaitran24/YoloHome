from flask import jsonify, request
from flask_restful import Resource
from database import iot_database
from model import RoomModel, adafruit_server
from middleware import token_require
from error import *

class MultiRoomAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()
        self._room_model = RoomModel(iot_database)

    def get(self):
        try:
            room_list = self._room_model.get_room()
        except Exception as err:
            return make_response(data="", error=err)
        data = [room.data for room in room_list]
        return make_response(data=data)

    def post(self):
        record = request.form.to_dict()
        try:
            room = self._room_model.add_room(record)
        except Exception as err:
            return make_response(data="", error=err)
        
        return make_response(data=room.data)

class SingleRoomAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()
        self._room_model = RoomModel(iot_database)

    def get(self, room_id):
        try:
            room_list = self._room_model.get_room(room_id)
        except Exception as err:
            return make_response(data="", error=err)
        room = room_list[0]
        return make_response(data=room.data)

    def put(self, room_id):
        pass

    def delete(self, room_id):
        try:
            room = self._room_model.delete_room(room_id)
        except Exception as err:
            return make_response(data="", error=err)
        
        return make_response(data=room.data)