from model import Adafruit

ada_io = Adafruit('thaitran24', 'aio_FVzu80WbuoXalD3c6WEf05szvgHs')

ada_io.add_feed('Fan1', 'smarthome')
ada_io.send_data('smarthome.fan1', 0)
ada_io.delete_feed('smarthome.fan1')