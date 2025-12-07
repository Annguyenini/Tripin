##before pass into service fucntions, this help filter info and verify jwt token for unnesscary function call
##rate limit are set as 5 requests total per min


from flask import Blueprint, jsonify, request
from server_side.server_config.config import Config
from server_side.database.database import Database
from server_side.credential.credential import Auth
from server_side.token.tokenservice import TokenService
from server_side.server_config.encryption.encryption import Encryption
from server_side.server_auth.server_auth import ServerAuth
from server_side.server_config.service.rate_limiter import RateLimiterRedis
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
        self.rate_limiter_service = RateLimiterRedis()
        self._register_routes()

    def _register_routes(self):
        # pass the bound method
        @self.bp.before_request
        def rate_limit():
            user_ip = request.remote_addr
            count = self.rate_limiter_service.incr(user_ip)
            print(count)
            if count ==1:
                self.rate_limiter_service.exp(user_ip,60)
            elif count>5:
                return jsonify({"message":"Too many request!"}),429
        self.bp.route("/login_via_token", methods=["POST"])(self.login_via_token)
        self.bp.route("/login", methods=["POST"])(self.login)
        self.bp.route("/signup", methods=["POST"])(self.signup)
        self.bp.route("/request_access_token", methods=["POST"])(self.request_new_access_token)

    def login_via_token(self):       
        data = request.headers.get("Authorization")
        token = data.replace("Bearer ", "")
        status, message = self.token_service.jwt_verify(token)
        if not status:
            return jsonify({"message": message}), 401
        userdatas = self.token_service.decode_jwt(token)
        return jsonify({"message": message, "userDatas": userdatas}), 200

    def login(self):
        data = request.json
        username = data.get("username")
        password = data.get("password")
        status, message, userdatas = self.auth.login(username=username, password=password)
        if not status:
            return jsonify({"message": message}), 401
        return jsonify({"message": message, "userDatas": userdatas}), 200

    def signup(self):
        data = request.json
        email = data.get("email")
        display_name = data.get("displayName")
        username = data.get("username")
        password = data.get("password")
        lower_case_email = email.lower()
        status, message = self.auth.signup(email=lower_case_email, display_name=display_name, username=username, password=password)
        if not status:
            return jsonify({"message": message}), 401
        return jsonify({"message": message}), 200

    def request_new_access_token(self):
        data = request.headers.get("Authorization")
        token = data.replace("Bearer ", "")
        status, new_token = self.token_service.request_new_access_token(token)
        if not status:
            return jsonify({"message": "Could not finish the request!"}), 401
        return jsonify({"message": "Successfully", "token": new_token}), 200