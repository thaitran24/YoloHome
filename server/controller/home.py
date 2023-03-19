import json
from flask import request
from flask_restful import Resource
from database import iot_database
from model import HomeModel, adafruit_server
from middleware import token_require
from error import *

class MultiHomeAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()
        self._home_model = HomeModel(iot_database)

    def get(self):
        try:
            home_list = self._home_model.get_home()
        except Exception as err:
            return make_response(data="", error=err)
        data = [home.data for home in home_list]
        return make_response(data=data)

    def post(self):
        # record = request.form.to_dict()
        record = json.loads(request.data.decode('UTF-8'))['form']
        try:
            home = self._home_model.add_home(record)
        except Exception as err:
            return make_response(data="", error=err)
        group_key = home.data["_id"]
        group_name = home.data["name"]
        adafruit_server.add_group(group_name=group_name, group_key=group_key)

        return make_response(data=home.data)

class SingleHomeAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()
        self._home_model = HomeModel(iot_database)

    def get(self, home_id):
        try:
            home_list = self._home_model.get_home(home_id)
        except Exception as err:
            return make_response(data="", error=err)
        home = home_list[0]
        return make_response(data=home.data)

    def put(self, home_id):
        pass

    def delete(self, home_id):
        try:
            home = self._home_model.delete_home(home_id)
        except Exception as err:
            return make_response(data="", error=err)
        
        group_key = home.data["_id"]
        adafruit_server.delete_group(group_key=group_key)
        return make_response(data=home.data)
