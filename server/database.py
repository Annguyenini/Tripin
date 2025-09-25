import sqlite3
import psycopg2

from config import Config
class Database:
    _instance = None
    def __init__(self):
        self.__init__authsetup()
        self.authdb_path = Config.instance().get_authbd_path()


    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__authsetup(self):
        self.authdb_path = Config.instance().get_authbd_path()
    
        con,cur = self.connect_db(self.authdb_path)
        # con.execute('PRAGMA journal_mode=WAL;') #WAL mode

        cur.execute('CREATE TABLE IF NOT EXISTS tripin_auth.auth (id SERIAL PRIMARY KEY, email TEXT,display_name TEXT, user_name TEXT, password TEXT)')
        con.commit()
        cur.execute('''
        CREATE TABLE IF NOT EXISTS tripin_auth.refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES tripin_auth.auth(id) ON DELETE CASCADE,  -- Now correctly references 'id'
        user_name TEXT NOT NULL,
        token TEXT NOT NULL,
        issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        revoked BOOLEAN NOT NULL DEFAULT FALSE
        );

        ''')
        con.commit() 
        con.close()
    def connect_db(self, path):
        conn = psycopg2.connect(
        host= Config.instance().get_database_host(),
        dbname= Config.instance().get_database_name(),
        user= Config.instance().get_database_username(),
        password= Config.instance().get_database_password(),
        port= Config.instance().get_database_port()
        )
        print(Config.instance().get_database_username())


        # con = sqlite3.connect(path,check_same_thread=False,isolation_level=None)
        cur= conn.cursor()
        return conn, cur


    def check_allowance(self,table,item,tabletype):
        db_allow_table=['tripin_auth.auth','tripin_auth.refresh_tokens']
        db_allow_items_auth=['email','user_name','password','display_name','token','user_id','issued_at','exprires_at']
        if tabletype == "auth":

            if table not in db_allow_table or item not in db_allow_items_auth:
                return False
        return True
    def find_item_in_sql(self, **kwargs):
        options = kwargs.pop("option","fetchone")
        table = kwargs.get("table")
        item = kwargs.get("item")
        self.check_allowance(table,item,"auth")
        value = kwargs.get("value")
        con,cur = self.connect_db(self.authdb_path)
        cur.execute (f'SELECT * FROM {table} WHERE {item}=%s',(value,))
        if options =="fetchall":
            time = cur.fetchall()
        else:
            item = cur.fetchone()
        return item
    def update_db(self,**kwargs):
        table = kwargs.get("table")
        item = kwargs.get ("item")
        value = kwargs.get("value")
        self.check_allowance(table,item,"auth")
        item_to_update = kwargs.get("item_to_update")
        value_to_update = kwargs.get("value_to_update")
        con,cur = self.connect_db(self.authdb_path)
        cur.execute(f'UPDATE {table} SET {item_to_update} =%s WHERE {item} = %s',(value_to_update,value,))

    def insert_to_database_singup(self, **kwargs):
        con,cur= self.connect_db(self.authdb_path)
        email = kwargs.get('email')
        display_name =kwargs.get('display_name')
        username = kwargs.get('username')
        password = kwargs.get('password')
        cur.execute(f'INSERT INTO tripin_auth.auth (email,display_name,user_name,password) VALUES(%s,%s,%s,%s)',(email,display_name,username,password))
        con.commit()
        con.close()
        return cur.rowcount
    def insert_token_into_db(self,**kwargs): 
        #kwargs =>> type,token,issuePeriod,expPeriod
        #type(access,refresh) token (jwt)  issuePeriod(00_00_00:00_00) expPeriod(00_00_00:00_00)
        userid = kwargs.get("userid")
        print(userid)
        username =kwargs.get("username")
        token = kwargs.get("refresh_token")
        issued_at = kwargs.get("issued_at")
        expires_at = kwargs.get("expires_at")
        revoked = kwargs.get("revoked")
        con,cur = self.connect_db(Config.instance().get_authbd_path())
        cur.execute(f'INSERT INTO tripin_auth.refresh_tokens (user_id,user_name,token,issued_at,expires_at,revoked) VALUES (%s, %s, %s, %s, %s, %s)',(userid,username,token,issued_at,expires_at,revoked,))
        con.commit()
        if(cur.rowcount<0):
            return False, "Error insert to db"

        return True