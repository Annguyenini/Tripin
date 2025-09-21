import sqlite3
from config import Config
class Database:
    _instance = None
    def __init__(self):
        self.__init__setup()
        self.authdb_path = Config.instance().get_authbd_path()


    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__setup(self):
        self.authdb_path = Config.instance().get_authbd_path()
    
        con,cur = self.connect_db(self.authdb_path)
        con.execute('PRAGMA journal_mode=WAL;') #WAL mode

        cur.execute('CREATE TABLE IF NOT EXISTS auth (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT,display_name TEXT, user_name TEXT, password TEXT)')
        con.commit()
        cur.execute('''
        CREATE TABLE IF NOT EXISTS refresh_tokens (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            token TEXT NOT NULL,
            issued_at DATETIME NOT NULL,
            expires_at DATETIME NOT NULL,
            revoked BOOLEAN NOT NULL DEFAULT 0
        )
        ''')
        con.commit() 
        con.close()
    def connect_db(self, path):
        con = sqlite3.connect(path,check_same_thread=False,isolation_level=None)
        cur= con.cursor()
        return con, cur
    def find_item_in_sql(self, item,value):
        
        con,cur = self.connect_db(self.authdb_path)
        cur.execute (f'SELECT * FROM auth WHERE {item}=?',(value,))
        item = cur.fetchone()
        return item
