import configparser
import os

class Config:
    _instance =None
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.read('Confignure.ini')
        self.private_keep_path = self.config.get('paths','private_key',fallback=None)
        self.public_keep_path = self.config.get('paths','public_key',fallback=None)
        self.authdb_path =self.config.get('paths', 'authdb', fallback=None)

        if not os.path.exists(self.authdb_path):
            open(self.authdb_path,'w').close()
        with open (self.private_keep_path,'r') as prkeys:
            self.PRIVATE_KEY = prkeys.read()
        with open (self.public_keep_path,'r') as pukeys:
             self.PUBLIC_KEY= pukeys.read()

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