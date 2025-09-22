import jwt
from config import Config
from datetime import datetime , timedelta
from database import Database
class TokenService:
    def __init__(self):
        self.db = Database()
    def generate_jwt(self, **kwargs): #days:00 // hours:00 // minutes:00
        #encode token using key and HS256
        exp_time = kwargs.pop("exp_time",{"days":30}) #if doesnt pass in, it will set as 30 days
        SECRET_KEY =Config.instance().get_private_key() 
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
        PUBLIC_KEY = Config.instance().get_public_key()
        try:
            payload = jwt.decode(token,PUBLIC_KEY,algorithm=["RS256"])
        except jwt.ExpiredSignatureError:
            return False,"Token Expired!"
        except jwt.InvalidTokenError:
            return False,"Token Invalid!"
        return True,"Successfully!" 
    def refresh_token_verify(self,row):
        if row[6] =1:
            return False
        if datetime.now() >= row[5]:
            self.revoked_refresh_token(userid=row[1])
            return False
        return True
        

    def revoked_refresh_token(self,**kwargs):
        userid = kwargs.get("userid")
        self.db.update_db(table ="refresh_tokens", item ="user_id", value =userid, item_to_update = "revoked", value_to_update = 1)
    def insert_token_into_db(self,**kwargs): 
        #kwargs =>> type,token,issuePeriod,expPeriod
        #type(access,refresh) token (jwt)  issuePeriod(00_00_00:00_00) expPeriod(00_00_00:00_00)
        userid = kwargs.get("userid")
        username =kwargs.get("username")
        token = kwargs.get("refresh_token")
        issued_at = kwargs.get("issued_at")
        expires_at = kwargs.get("expires_at")
        revoked = kwargs.get("revoked")
        print(kwargs)
        con,cur = self.db.connect_db(Config.instance().get_authbd_path())
        cur.execute(f'INSERT INTO refresh_tokens (user_id,user_name,token,issued_at,expires_at,revoked) VALUES (?,?,?,?,?,?)',(userid,username,token,issued_at,expires_at,revoked,))
        con.commit()
        if(cur.rowcount<0):
            return False, "Error insert to db"

        return True
    def request_new_access_token(self,refresh_token):
        row = self.db.find_item_in_sql(table="refresh_tokens",item="token",value=refresh_token)
        if row is None:
            return False, None
        if not refresh_toke_verify(row):
            new_token = generate_jwt(id=row[1],username=row[2])

        return new_token
        