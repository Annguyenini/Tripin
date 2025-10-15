from flask import Flask, render_template, jsonify, request, send_file, abort,Blueprint
from flask_cors import CORS
from server_side.auth_server_routes import AuthServer
from server_side.server_auth import ServerAuth
import getpass
import json
import io
import sys

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self._register_blueprints()
    def _register_blueprints(self):
        auth_server = AuthServer()
        self.app.register_blueprint(auth_server.bp,url_prefix="/auth")
    
        


server_auth_service = ServerAuth()
if not server_auth_service.verify_indentity():
    print("Wrong password!❌")
    sys.exit(1)
print("Successfully authenticated!✅")
server = Server()
app = server.app
if __name__ =="__main__":
    print(app.url_map)
    app.run( host ="0.0.0.0", port =8000)