from tokenservice import TokenService
class User_Request:
    def __init__(self):
        self.token_service = TokenService()
    def request_user_datas(self, access_token):
        status message = self.token_service.jwt_verify(access_token)
        if not status:
            return status, message
        