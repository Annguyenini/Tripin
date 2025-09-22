from datetime import datetime,timedelta
from database import Database
from config import Config
from tokenservice import TokenService
class Auth:
    def __init__(self):
        self.db = Database()
        self.tokenService = TokenService()
        self.authdb_path = Config.instance().get_authbd_path()
    def login(self,**kwargs):
        username = kwargs.get("username")
        password = kwargs.get("password")
        row = self.db.find_item_in_sql(table="auth",item="user_name",value=username)
        if row is None:
            return False,"Wrong username",None
        elif password != row [4]: # password
            return False,"Wrong password",None
        self.tokenService.revoked_refresh_token(userid=row[0])
        refresh_token = self.tokenService.generate_jwt(id=row[0],username=row[3])
        access_token = self.tokenService.generate_jwt(id=row[0],username=row[3],exp_time={"hours":1})
        self.tokenService.insert_token_into_db(
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
        if(self.db.find_item_in_sql(table="auth",item="email",value=email)):
            return False, "Email already exists!"
        if(self.db.find_item_in_sql(table="auth",item="user_name",value=username)):
            return False, "Username already exists!"
        
        con,cur= self.db.connect_db(self.authdb_path)
        cur.execute(f'INSERT INTO auth (email,display_name,user_name,password) VALUES(?,?,?,?)',(email,display_name,username,password))
        con.commit()
        con.close()
        if cur.rowcount < 0:
            return False,"Unable to resolve request!"
        return True, "Successfully"

   


        