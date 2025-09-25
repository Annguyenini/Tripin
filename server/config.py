import configparser
import os
from werkzeug.security import generate_password_hash, check_password_hash

class Config:
    _instance =None
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.read('Confignure.ini')
        self.private_keep_path = self.config.get('paths','private_key',fallback=None)
        self.public_keep_path = self.config.get('paths','public_key',fallback=None)
        self.authdb_path =self.config.get('paths', 'authdb', fallback=None)
        self.__inti__database()
        if not os.path.exists(self.authdb_path):
            open(self.authdb_path,'w').close()
        with open (self.private_keep_path,'r') as prkeys:
            self.PRIVATE_KEY = prkeys.read()
        with open (self.public_keep_path,'r') as pukeys:
             self.PUBLIC_KEY= pukeys.read()
    def __inti__database(self):
        self.database_path = self.config.get('paths','databases_properties',fallback=None)
        self.database_config = configparser.ConfigParser()
        self.database_config.read(self.database_path)
        self.database_host =self.database_config.get('databasesPro','host',fallback=None)
        self.database_port = self.database_config.get("databasesPro",'port',fallback=None)
        self.database_username = self.database_config.get('databasesPro','username',fallback=None)
        self.database_password = self.database_config.get ('databasesPro','password',fallback=None)
        self.database_name = self.database_config.get('databasesPro','dbname',fallback =None)

    def get_database_host(self):
        return self.database_host
    
    def get_database_name(self):
        return self.database_name

    def get_database_password(self):
        return self.database_password
    
    def get_database_port(self):
        return self.database_port

    def get_database_username(self):
        return self.database_username

    def get_private_key(self):
        return self.PRIVATE_KEY
    def get_public_key(self):
        return self.PUBLIC_KEY
    def get_authbd_path(self): return self.authdb_path
    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance=Config()
        return cls._instance