from flask import Flask, render_template, jsonify, request, send_file, abort
from flask_cors import CORS
from config import Config
from database import Database
from auth import Auth
from tokenservice import TokenService
import json
import io


class Server:
    def __init__(self):
        self.auth = Auth()
        self.tk = TokenService()
        self.app = Flask(__name__)
        CORS(self.app)
        self.AuthRoute()
        
    def AuthRoute(self):
        app = self.app
        self.app.add_url_rule("/login", view_func=self.login, methods=["POST"])
        self.app.add_url_rule("/signup", view_func=self.signup, methods=["POST"])
        self.app.add_url_rule("/login/token", view_func=self.login_via_token, methods=["POST"])
        self.app.add_url_rule("/auth/access", view_func=self.request_new_access_token, methods =["POST"])  
    def login_via_token(self):
        data = request.headers.get("Authorization")
        token=data.replace("Bearer ","")
        status, message = self.tk.jwt_verify(token)
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
        token = request.headers.get("Authorization")
        status , token = self.tokenService.request_new_access_token(token)
        if not satus:
            return jsonify({"Message":"Could not finish the request!"}),401
        return jsonify({"Massage":"Successfully","token":token}),200





server = Server()
app = server.app
app.run(debug=True)