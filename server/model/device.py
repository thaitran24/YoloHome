import config
from database import Device
from error import *

class DeviceModel():
    def __init__(self, database):
        self._database = database

    def update_device_data(self, device_id, data):
        try:
            device_list = self.get_device(device_id)
            device = device_list[0]
            update_data = {"curr_value": data}
            self._database.update_one_data(device, update_data)
        except:
            raise RecordUpdateError(device_id)
        return device

    def get_device(self, device_id=None):
        query = {}
        if device_id:
            query["_id"] = device_id
        try:
            device_list = self._database.fetch_data(config.database.DOC_DEVICE_LIST, query)
            if len(device_list) < 1:
                raise RecordFindError(device_id)
        except:
            raise RecordFindError(device_id)
        
        return device_list

    def add_device(self, record):
        home_id = record['home_id']
        room_id = record['room_id']
        device_type = record['type']
        device = Device(type=device_type, home_id=home_id, room_id=room_id)
        try:
            self._database.add_data(device)
        except:
            raise RecordInsertError(record)
        
        return device

    def delete_device(self, device_id):
        try:
            device_list = self.get_device(device_id)
            device = device_list[0]
            self._database.remove_data(device)
        except:
            raise RecordDeleteError(device_id)
        
        return device