import config
from database import Home
from error import *

class HomeModel():
    def __init__(self, database) -> None:
        self._database = database

    def get_home(self, home_id=None):
        query = {}
        if home_id:
            query["_id"] = home_id
        try:
            home_list = self._database.fetch_data(config.database.DOC_HOME_LIST, query)
            if len(home_list) < 1:
                raise RecordFindError(home_id)
        except:
            raise RecordFindError(home_id)
        
        return home_list

    def add_home(self, record):
        home = Home(record['name'])
        try:
            self._database.add_data(home)
        except:
            raise RecordInsertError(record)

        return home

    def delete_home(self, home_id):
        try:
            home_list = self.get_home(home_id)
            home = home_list[0]
            self._database.remove_data(home)
        except:
            raise RecordDeleteError(home_id)
        return home
    