import jwt
from datetime import datetime,timedelta
from database import Database
from config import Config
class Auth:
    def __init__(self):
        self.db = Database()
        self.authdb_path = Config.instance().get_authbd_path()
    def login(self,**kwargs):
        username = kwargs.get("username")
        password = kwargs.get("password")
        row = self.db.find_item_in_sql('user_name',username)
        if row is None:
            return False,"Wrong username",None
        elif password != row [4]: # password
            return False,"Wrong password",None

        refresh_token = self.generate_jwt(id=row[0],username=row[3])
        access_token = self.generate_jwt(id=row[0],username=row[3],exp_time={"hours":1})
        self.insert_token_into_db(
            userid =row[0],
            username=username,
            refresh_token=refresh_token,
            issued_at=datetime.utcnow(),
            expires_at = datetime.utcnow() + timedelta(days=30),
            revoked = 0
            )
        
        data = {'userid':row[0],'displayname':row[2],'username':row[3],'refresh_token':refresh_token,'access_token':access_token}
        
        return True,"Sucessfully",data

    def signup(self,**kwargs):
        email = kwargs.get("email")
        display_name = kwargs.get("display_name")
        username = kwargs.get("username")
        password = kwargs.get("password")
        if(self.db.find_item_in_sql("email",email)):
            return False, "Email already exists!"
        if(self.db.find_item_in_sql("user_name",username)):
            return False, "Username already exists!"
        
        con,cur= self.db.connect_db(self.authdb_path)
        cur.execute(f'INSERT INTO auth (email,display_name,user_name,password) VALUES(?,?,?,?)',(email,display_name,username,password))
        con.commit()
        con.close()
        if cur.rowcount < 0:
            return False,"Unable to resolve request!"
        return True, "Successfully"

    def generate_jwt(self, **kwargs): #days:00 // hours:00 // minutes:00
        #encode token using key and HS256
        exp_time = kwargs.pop("exp_time",{"days":30})
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


        