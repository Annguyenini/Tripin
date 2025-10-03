import jwt
from server_side.config import Config
from datetime import datetime , timedelta
from server_side.database import Database
class TokenService:
    def __init__(self):
        self.db = Database()
        self.config = Config()
    def generate_jwt(self, **kwargs): #days:00 // hours:00 // minutes:00
        #encode token using key and HS256
        exp_time = kwargs.pop("exp_time",{"days":30}) #if doesnt pass in, it will set as 30 days
        SECRET_KEY =self.config.private_key 
        token = jwt.encode({
            "id":kwargs.get("id"),
            "user":kwargs.get("username"),
            "issue":int((datetime.utcnow().timestamp())),
            "exp":int((datetime.utcnow() + timedelta(**exp_time)).timestamp()) 
        },
        SECRET_KEY,
        algorithm='RS256'
        )
        return token

    def jwt_verify(self,token):
 
        PUBLIC_KEY = self.config.public_key
        try:
            payload = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=["RS256"],
            options={"exp": True}  # make sure expiration is enforced
        )
            print(datetime.utcfromtimestamp(payload['issue']))
            print(datetime.utcfromtimestamp(payload['exp']))
            print(datetime.utcnow())

        except jwt.ExpiredSignatureError:
            print("somethins")
            return False,"Token Expired!"
        except jwt.InvalidTokenError:
            return False,"Token Invalid!"
        return True,"Successfully!" 
    def refresh_token_verify(self,row):
        if row[6] ==1:
            return False
        if datetime.now() >= row[5]:
            self.revoked_refresh_token(userid=row[1])
            return False
        return True
        

    def revoked_refresh_token(self,**kwargs):
        userid = kwargs.get("userid")
        self.db.update_db(table ="tripin_auth.refresh_tokens", item ="user_id", value =userid, item_to_update = "revoked", value_to_update = True)
 
 
    def request_new_access_token(self,refresh_token):
        row = self.db.find_item_in_sql(table="tripin_auth.refresh_tokens",item="token",value=refresh_token)
        if row is None:
            return False, None
        if not refresh_toke_verify(row):
            new_token = generate_jwt(id=row[1],username=row[2])

        return new_token
        