from flask import Blueprint
from flask_restful import Api
from controller import SingleDeviceAPI, MultiDeviceAPI

device_api = Blueprint('device_api', __name__)
api = Api(device_api)

api.add_resource(MultiDeviceAPI, '/api/device')
api.add_resource(SingleDeviceAPI, '/api/device/<device_id>')