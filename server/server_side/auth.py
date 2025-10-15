from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime,timedelta
from server_side.database import Database
from server_side.config import Config
from server_side.tokenservice import TokenService
#userdata user_id|email|user_name|displayname|password
#token keyid| userid| username|token|issue name | exp name | revok
class Auth:
    def __init__(self):
        self.db = Database()
        self.tokenService = TokenService()
    #login function
    def login(self,**kwargs):
        username = kwargs.get("username")
        password = kwargs.get("password")
        row = self.db.find_item_in_sql(table="tripin_auth.userdata",item="user_name",value=username)
        if row is None:
            return False,"Wrong username",None
        elif not check_password_hash(row[4],password): # password
            return False,"Wrong password",None
        # if user is found and password is correct
        # old token got revoked
        self.tokenService.revoked_refresh_token(userid=row[0])
        #new tokens generated
        refresh_token = self.tokenService.generate_jwt(id=row[0],display_name = row[2],username=row[3])
        access_token = self.tokenService.generate_jwt(id=row[0],display_name = row[2],username=row[3],exp_time={"minutes":1})
        
        self.db.insert_token_into_db(
            userid =row[0],
            username=username,
            refresh_token=refresh_token,
            issued_at=datetime.utcnow(),
            expires_at = datetime.utcnow() + timedelta(days=30),
            revoked = False
            )
        #return data
        data = {'user_id':row[0],'display_name':row[2],'user_name':row[3],'refresh_token':refresh_token,'access_token':access_token}
        return True,"Sucessfully",data
    #signup function
    def signup(self,**kwargs): 
        print("calling signup")
        email = kwargs.get("email")
        display_name = kwargs.get("display_name")
        username = kwargs.get("username")
        password = kwargs.get("password")
        hashed_passwords = generate_password_hash(password)
        print(email,display_name,username,hashed_passwords)
        #check if email or username already exists
        if(self.db.find_item_in_sql(table="tripin_auth.userdata",item="email",value=email)):
            return False, "Email already exists!"
        if(self.db.find_item_in_sql(table="tripin_auth.userdata",item="user_name",value=username)):
            return False, "Username already exists!"
        #insert into database
        res = self.db.insert_to_database_singup(email=email, display_name=display_name,username=username,password=hashed_passwords)
        if res< 0:
            return False,"Unable to resolve request!"
        return True, "Successfully"



        