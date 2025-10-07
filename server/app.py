from flask import Flask, render_template, jsonify, request, send_file, abort
from flask_cors import CORS
from server_side.config import Config
from server_side.database import Database
from server_side.auth import Auth
from server_side.tokenservice import TokenService
from server_side.encryption import Encryption
from server_side.server_auth import ServerAuth
import getpass
import json
import io
import sys

class Server:
    def __init__(self):
        self.auth = Auth()
        self.token_service = TokenService()
        self.encryption_service = Encryption()
        self.app = Flask(__name__)
        CORS(self.app)
        self.AuthRoute()
    
  
    
    def AuthRoute(self):
        app = self.app
        self.app.add_url_rule("/login", view_func=self.login, methods=["POST"])
        self.app.add_url_rule("/signup", view_func=self.signup, methods=["POST"])
        self.app.add_url_rule("/login/token", view_func=self.login_via_token, methods=["POST"])
        self.app.add_url_rule("/auth/requestAT", view_func=self.request_new_access_token, methods =["POST"])  
    def login_via_token(self):
        data = request.headers.get("Authorization")
        print (data)
        token=data.replace("Bearer ","")
        status, message = self.token_service.jwt_verify(token)
        if not status:
            return jsonify({"Message":message}), 401
        return jsonify({"Message":message}), 200

    def login(self):
        data = request.json
        username = data.get("username")
        password = data.get("password")
        status, message,userdatas = self.auth.login(username=username,password=password)
        if not status:
            return jsonify({"Message":message}),401
        
        return jsonify({"successfully":message,"userdatas":userdatas}),200

    def signup(self):
        data = request.json
        email = data.get("email")
        display_name = data.get("displayName")
        username = data.get("username")
        password = data.get("password")
        status,message = self.auth.signup(email=email,display_name=display_name,username=username,password=password)
        if not status:
            return jsonify({"Message":message}),401
        return jsonify({"Message":message}),200

    def request_new_access_token(self):
        data = request.headers.get("Authorization")
        token = data.replace ("Bearer ","")
        status , new_token = self.token_service.request_new_access_token(token)
        print(new_token)
        if not status:
            return jsonify({"Message":"Could not finish the request!"}),401
        return jsonify({"Massage":"Successfully","token":new_token}),200




server_auth_service = ServerAuth()
if not server_auth_service.verify_indentity():
    print("Wrong password!❌")
    sys.exit(1)
print("Successfully authenticated!✅")
server = Server()
app = server.app
if __name__ =="__main__":
    app.run(debug=True, host ="0.0.0.0", port =8000)