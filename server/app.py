import config
from flask import Flask
from route import device_api, home_api, login_api, room_api

app = Flask(__name__)
app.register_blueprint(device_api)
app.register_blueprint(home_api)
app.register_blueprint(login_api)
app.register_blueprint(room_api)

if __name__=='__main__':
    # from waitress import serve
    # serve(app=app, host=os.getenv(SERVER_HOST), port=os.getenv(SERVER_PORT))
    app.run(config.server.SERVER_HOST, config.server.SERVER_PORT)