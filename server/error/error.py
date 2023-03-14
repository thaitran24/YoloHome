class RecordFindError(Exception):
    def __init__(self, record=None):
        self.type = "RecordFindError"
        self.record = record if record else ""
        self.message = "Cannot find record {} in database".format(record)
        super().__init__(self.message)

class RecordUpdateError(Exception):
    def __init__(self, record):
        self.type = "RecordUpdateError"
        self.record = record
        self.message = "Cannot update record {} in database".format(record)
        super().__init__(self.message)

class RecordDeleteError(Exception):
    def __init__(self, record):
        self.type = "RecordDeleteError"
        self.record = record
        self.message = "Cannot delete record {} in database".format(record)
        super().__init__(self.message)

class RecordInsertError(Exception):
    def __init__(self, record):
        self.type = "RecordInsertError"
        self.record = record
        self.message = "Cannot add record {} in database".format(record)
        super().__init__(self.message)

def make_response(data, error=None):
    if error:
        err = {
            "type": error.type,
            "message": error.message
        }
        status = 500
        message = "Internal Server Error"
    else:
        err = {}
        status = 200
        message = "OK"
    
    response = {
        "status": status,
        "message": message,
        "data": data,
        "errors": err
    }
    return response