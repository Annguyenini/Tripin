from flask_mail import Mail, Message
import random
mail = Mail()
class MailService:
    _instance = None
    _initialize = False
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance         
    def __init__(self):
        if not self._initialize:
            self.confirmation_list = {}
            self._initialize = True
    def send_confirmation_code(self, recipients:str):
        print("called send code")
        print("recipients before sendding",recipients)
        code = random.randint(100000, 999999) 
        subject ="Code for Tripin Auth"
        body = f"This is your code for Tripin {code}"
        try:
            msg =Message (subject = subject, recipients=[recipients],body=body)
            mail.send(msg)
        except Exception as e:
            print("Error at send mail",e)
            return False
        print(type(recipients))
        email = recipients.strip()
        self.confirmation_list[email]=code
        print("Added to dict:", self.confirmation_list)
        return True
    def verify_code(self,recipients:str, code:int):
        print(type(recipients))
        print(type(code))
        print("code recieve from client ",code)
        print("client email",recipients)
        print(self.confirmation_list)
        email = recipients.strip()
        
        print(f"Email key in dict: {list(self.confirmation_list.keys())[0]!r}")
        print(f"Email received: {email!r}")
        
        
        from server_side.credential.credential import Auth
        self.auth = Auth()
        realcode = self.confirmation_list.get(email)
        print(realcode)
        print (type(realcode))
        if code != realcode:
            return False
        del self.confirmation_list[email]
        if self.auth.process_new_user(email):
            return True
        return False
        