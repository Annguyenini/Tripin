
from flask import Blueprint, request, jsonify
from server_side.tokenservice import TokenService
class TripRoute:
    _instance = None
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.bp = Blueprint('mail',__name__)
        self.token_service = TokenService()        
        self._register_route()
    
    def _register_route(self):
        self.bp.route("/request_new_trip", methods=["POST"])()

    def confirm_code(self):
        data = request.json
        token = request.headers.get("Authorization")
        token.replace("Bearer ","")
        valid_token,message = self.token_service.jwt_verify(token)
        if not valid_token:
            return False, message
        
        user_data = self.token_service.decode_jwt(token)
        user_id = user_data.get("user_id")
        user_name = user_data.get("user_name")
        trip_name = data.get("trip_name")
        # respond = self.mail_service.verify_code(email,code)
        if not respond:
            return jsonify({"status":"Failed"}),500

        return jsonify({"status":"Successfully"}),200
        