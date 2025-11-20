from flask import Blueprint, jsonify, request
from flask_cors import CORS
from server_side.config import Config
from server_side.database import Database
from server_side.auth import Auth
from server_side.tokenservice import TokenService
from server_side.encryption import Encryption
from server_side.server_auth import ServerAuth
class AuthServer:
    _instance = None 
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__(self):
        self.bp = Blueprint("auth", __name__)
        self.auth = Auth()
        self.token_service = TokenService()
        self.encryption_service = Encryption()
        self._register_routes()

    def _register_routes(self):
        # pass the bound method
        self.bp.route("/login_via_token", methods=["POST"])(self.login_via_token)
        self.bp.route("/login", methods=["POST"])(self.login)
        self.bp.route("/signup", methods=["POST"])(self.signup)
        self.bp.route("/request_access_token", methods=["POST"])(self.request_new_access_token)

    def login_via_token(self):
        print("login-via-token get called!")
        data = request.headers.get("Authorization")
        token = data.replace("Bearer ", "")
        status, message = self.token_service.jwt_verify(token)
        if not status:
            return jsonify({"Message": message}), 401
        userdatas = self.token_service.decode_jwt(token)
        return jsonify({"Message": message, "userdatas": userdatas}), 200

    def login(self):
        data = request.json
        username = data.get("username")
        password = data.get("password")
        status, message, userdatas = self.auth.login(username=username, password=password)
        if not status:
            return jsonify({"Message": message}), 401
        return jsonify({"successfully": message, "userdatas": userdatas}), 200

    def signup(self):
        data = request.json
        email = data.get("email")
        display_name = data.get("displayName")
        username = data.get("username")
        password = data.get("password")
        lower_case_email = email.lower()
        status, message = self.auth.signup(email=lower_case_email, display_name=display_name, username=username, password=password)
        if not status:
            return jsonify({"Message": message}), 401
        return jsonify({"Message": message}), 200

    def request_new_access_token(self):
        data = request.headers.get("Authorization")
        token = data.replace("Bearer ", "")
        status, new_token = self.token_service.request_new_access_token(token)
        if not status:
            return jsonify({"Message": "Could not finish the request!"}), 401
        return jsonify({"Message": "Successfully", "token": new_token}), 200