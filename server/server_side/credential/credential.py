from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime,timedelta
from server_side.database.database import Database
from server_side.server_config.config import Config
from server_side.token.tokenservice import TokenService
from server_side.mail.mail_service import MailService
#userdata user_id|email|user_name|displayname|password
#token keyid| userid| username|token|issue name | exp name | revok
class Auth:
    _instance = None 
    _initialize =False
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__(self):
        if not self._initialize:
            self.db = Database()
            self.tokenService = TokenService()
            self.mail_serveice = MailService()
            self.user_queue = {}
            self._initialize = True
    #login function
    def login(self,**kwargs):
        username = kwargs.get("username")
        password = kwargs.get("password")
        row = self.db.find_item_in_sql(table="tripin_auth.userdata",item="user_name",value=username)
        if row is None:
            return False,"Wrong username",None
        userid=row[0] 
        display_name=row[2] 
        username=row[3] 
        assert type(row) == tuple ,"Row must be type tuple"
        assert userid is not None ,"UserID Null"
        assert display_name is not None ,"Display_name Null"
        assert username is not None ,"Username is Null"
        if row is None:
            return False,"Wrong username",None
        elif not check_password_hash(row[4],password): # password
            return False,"Wrong password",None
        # if user is found and password is correct
        # old token got revoked
        self.tokenService.revoked_refresh_token(userid=userid)
        #new tokens generated
        refresh_token = self.tokenService.generate_jwt(id=userid,display_name = display_name,username=username)
        access_token = self.tokenService.generate_jwt(id=userid,display_name = display_name,username=username,exp_time={"minutes":1})
        
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
        # print(email,display_name,username,hashed_passwords)
        #check if email or username already exists
        if(self.db.find_item_in_sql(table="tripin_auth.userdata",item="email",value=email)):
            return False, "Email already exists!"
        if(self.db.find_item_in_sql(table="tripin_auth.userdata",item="user_name",value=username)):
            return False, "Username already exists!"
        
        #insert into database
    
        respond = self.mail_serveice.send_confirmation_code(email)
        if(respond):
            data={
                "email":email,
                "display_name":display_name,
                "username":username,
                "password":hashed_passwords,
            }
            self.user_queue[email] = data
            return True, "Successfully"
        else :
            return False,"Error at signup"
    def process_new_user(self,email:str):
        assert(type(email) is not str,"Email should be string")
        data =  self.user_queue.get(email)
        display_name = data.get ("display_name")
        username = data.get("username")
        password = data.get("password")
        res = self.db.insert_to_database_singup(email=email, display_name=display_name,username=username,password=password)
        if res< 0:
            return False
        return True