from flask  import Blueprint, request, jsonify
from flask_mail import Mail, Message
from server_side.mail_service import MailService
mail = Mail()
class MailServer:
    _instance = None
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.bp = Blueprint('mail',__name__)
        self.mail_service = MailService()
        self._register_route()
    
    def _register_route(self):
        self.bp.route("/confirm-code", methods=["POST"])(self.confirm_code)

    def confirm_code(self):
        print("called confirm_code")
        data = request.json
        recipients = data.get("email")
        email= recipients.lower()
        str_code = data.get("code")
        code = int(str_code)
        respond = self.mail_service.verify_code(email,code)
        if not respond:
            return jsonify({"status":"Failed"}),500

        return jsonify({"status":"Successfully"}),200
        