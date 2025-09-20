import jwt
import datetime
from database import Database
from config import Config
class Auth:
    def __init__(self):
        self.db = Database()
        self.authdb_path = Config.instance().get_authbd_path()
    def generate_jwt(self, item, key,**kwargs_time): #days:00 // hours:00 // minutes:00
        #encode token using key and HS256
            SECRET_KEY =key 
            token = jwt.encode({
                "user":item.get['username'],
                "exp":datetime.datetime.utcnow() + datetime.timedelta(**kwargs_time) 
            },
            SECRET_KEY,
            algorithm='HS256'
            )
            return token

        # def jwt_verify(token,type):
        # def insert_token_into_db(self,**kwargs): 
        #     #kwargs =>> type,token,issuePeriod,expPeriod
        #     # type(access,refresh) token (jwt)  issuePeriod(00_00_00:00_00) expPeriod(00_00_00:00_00)
    def login(self,**kwargs):
        username = kwargs.get("username")
        password = kwargs.get("password")
        row = self.db.find_item_in_sql('username',username)
        if row is None:
            return False,"Wrong username"
        elif password != row [4]: # password
            return False,"Wrong password"
        return True, row[2]

    def signup(self,**kwargs):
        email = kwargs.get("email")
        display_name = kwargs.get("display_name")
        username = kwargs.get("username")
        password = kwargs.get("password")
        print(display_name)
        if(self.db.find_item_in_sql("email",email)):
            return False, "Email already exists!"
        if(self.db.find_item_in_sql("username",username)):
            return False, "Username already exists!"
        
        con,cur= self.db.connect_db(self.authdb_path)
        cur.execute(f'INSERT INTO auth (email,display_name,username,password) VALUES(?,?,?,?)',(email,display_name,username,password))
        con.commit()
        con.close()
        if cur.rowcount < 0:
            return False,"Unable to resolve request!"
        return True, "Successfully"