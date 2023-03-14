from flask import request
from flask_restful import Resource
from database import iot_database
from model import DeviceModel, adafruit_server
from middleware import token_require
from error import *

class MultiDeviceAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()
        self._device_model = DeviceModel(iot_database)

    def get(self):
        try:
            device_list = self._device_model.get_device()
        except Exception as err:
            return make_response(data="", error=err)

        data = [device.data for device in device_list]
        return make_response(data=data)

    def post(self):
        record = request.form.to_dict()
        try:
            device = self._device_model.add_device(record)
        except Exception as err:
            return make_response(data="", error=err)
        
        name = device.data["type"]
        group_key = device.data["home_id"]
        feed_key = device.data["_id"]
        adafruit_server.add_feed(feed_name=name, feed_key=feed_key, group_key=group_key)
        return make_response(data=device.data)


class SingleDeviceAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()
        self._device_model = DeviceModel(iot_database)

    def get(self, device_id):
        try:
            device_list = self._device_model.get_device(device_id)
        except Exception as err:
            return make_response(data="", error=err)
        device = device_list[0]
        return make_response(data=device.data)

    def put(self, device_id):
        record = request.form.to_dict()
        data = record['data']
        try:
            device = self._device_model.update_device_data(device_id, data)
        except Exception as err:
            return make_response(data="", error=err)
        
        group_key = device.data["home_id"]
        feed_key = device.data["_id"]
        adafruit_server.send_data(feed_key="{}.{}".format(group_key, feed_key), data=data)
        return make_response(data=device.data)
    
    def delete(self, device_id):
        try:
            device = self._device_model.delete_device(device_id)
        except Exception as err:
            return make_response(data="", error=err)
        
        group_key = device.data["home_id"]
        feed_key = device.data["_id"]
        adafruit_server.delete_feed(feed_key="{}.{}".format(group_key, feed_key))
        return make_response(data=device.data)