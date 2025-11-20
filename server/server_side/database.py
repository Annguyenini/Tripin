import psycopg2
from dotenv import set_key, load_dotenv
import os
from server_side.config import Config
from server_side.encryption import Encryption
import inspect
from datetime import datetime
##change the connecttion to class variable

class Database:
    _instance = None
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        if getattr(self, "_initialized_credentials", False):
            return
        self._initialized = True
        self._initialized_credentials = False
        self.config = Config()
        self.encryption_Service = Encryption() 

        # database credentials
        self.database_host =None
        self.database_dbname =None
        self.database_username  =None
        self.database_password =None
        self.database_port = None

    # set database credentials(onlyfor server Auth class)
    def set_database_credentials(self,host,dbname,username,password,port):
        caller = inspect.stack()[1].frame.f_globals["__name__"]
        if caller == "server_side.server_auth":
            self.database_host = host
            self.database_dbname = dbname
            self.database_username = username
            self.database_password = password
            self.database_port = port
            self._initialized_credentials = True
            # self.__init__tripsetup()

            print("Database credentials set successfully!✅")
        else :
            print("You are not allowed to set database credentials!❌")
            return
    ## setup table if not exists (assuming exist)
    def __init__authsetup(self):
        if not self._initialized_credentials:
            return
        con,cur = self.connect_db()
        cur.execute('CREATE TABLE IF NOT EXISTS tripin_auth.userdata (id SERIAL PRIMARY KEY, email TEXT,display_name TEXT, user_name TEXT, password TEXT,created_time TIMESTAMP NOT NULL)')
        con.commit()
        cur.execute('''
        CREATE TABLE IF NOT EXISTS tripin_auth.tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES tripin_auth.auth(id) ON DELETE CASCADE,
        user_name TEXT NOT NULL,
        token TEXT NOT NULL,
        issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        revoked BOOLEAN NOT NULL DEFAULT FALSE
        );

        ''')
        con.commit() 
        cur.execute(''' CREATE TABLE IF NOT EXISTS tripin_auth.session (id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES tripin_auth.auth(id) ON DELETE CASCADE, login_time TIMESTAMP NOT NULL, last_activity TIMESTAMP NOT NULL);''')
        con.commit()
        con.close()
    def __init__tripsetup(self):
        if not self._initialized_credentials:
            return
        con,cur = self.connect_db()
        cur.execute('''
        CREATE TABLE IF NOT EXISTS tripin_trips.trip_table (
        id SERIAL PRIMARY KEY,
        trip_name INTEGER NOT NULL,
        user_id INTEGER NOT NULL REFERENCES tripin_auth.userdata(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        active BOOLEAN NOT NULL DEFAULT FALSE
        );

        ''')
        con.commit() 
        cur.execute('''
        CREATE TABLE IF NOT EXISTS tripin_trips.trip_points (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER NOT NULL REFERENCES tripin_trips.trip_table(id) ON DELETE CASCADE,
        altitude REAL NOT NULL,
        latitude REAL NOT NULL,
        longtitude REAL NOT NULL,
        speed REAL NOT NULL,
        heading REAL NOT NULL,
        time_stamp TIMESTAMP NOT NULL
        );
        ''')
        con.commit() 
        con.close() 
    def connect_db(self):
        conn = psycopg2.connect(
        host= self.database_host,
        dbname= self.database_dbname,
        user= self.database_username,
        password= self.database_password,
        port= self.database_port
        )
        print("Database connected successfully!✅")

        # con = sqlite3.connect(path,check_same_thread=False,isolation_level=None)
        cur= conn.cursor()
        return conn, cur


    def check_allowance(self,table,item):
        db_allow_table=['tripin_auth.userdata','tripin_auth.tokens','']
        db_allow_items_auth=['email','user_name','password','display_name','token','user_id','issued_at','exprires_at']
        # if tabletype == "userdata":

        #     if table not in db_allow_table or item not in db_allow_items_auth:
        #         return False
        # return True
    def find_item_in_sql(self, **kwargs):
        options = kwargs.pop("option","fetchone")
        second_condition = kwargs.pop("second_condition",False)
        table = kwargs.get("table")
        item = kwargs.get("item")
        value = kwargs.get("value")
        con,cur = self.connect_db()
        if not second_condition:
            cur.execute (f'SELECT * FROM {table} WHERE {item}=%s',(value,))
        else :
            item2 = kwargs.get("item2")
            value2 = kwargs.get("value2")
            cur.execute(f'SELECT * FROM {table} WHERE {item}=%s AND {item2} =%s',(value,value2,))
        if options =="fetchall":
            item = cur.fetchall()
        else:
            item = cur.fetchone()
        return item
    
    def update_db(self,**kwargs):
        table = kwargs.get("table")
        item = kwargs.get ("item")
        value = kwargs.get("value")
        self.check_allowance(table,item)
        item_to_update = kwargs.get("item_to_update")
        value_to_update = kwargs.get("value_to_update")
        con,cur = self.connect_db()
        cur.execute(f'UPDATE {table} SET {item_to_update} =%s WHERE {item} = %s',(value_to_update,value,))
        con.commit()
        con.close()
        if cur.rowcount <0:
            return False
        return True

    def insert_to_database_trip(self,**kwargs):
        con,cur = self.connect_db()
        user_id  = kwargs.get("user_id")
        trip_name = kwargs.get("trip_name")
        start_time = datetime.now()
        cur.execute(f'INSERT INTO tripin_trips.trip_table (user_id,trip_name,start_time,active) VALUES (%s,%s,%s,%s) RETURNING id',(user_id,trip_name,start_time,True))
        trip_id = cur.fetchone()[0]
        con.commit()
        con.close()
        return cur.rowcount,trip_id 
        
    def insert_to_database_singup(self, **kwargs):
        con,cur= self.connect_db()
        email = kwargs.get('email')
        display_name =kwargs.get('display_name')
        username = kwargs.get('username')
        password = kwargs.get('password')
        current_time = datetime.now()
        cur.execute(f'INSERT INTO tripin_auth.userdata (email,display_name,user_name,password,created_time) VALUES(%s,%s,%s,%s,%s)',(email,display_name,username,password,current_time))
        con.commit()
        con.close()
        return cur.rowcount


    def insert_token_into_db(self,**kwargs): 
        #kwargs =>> type,token,issuePeriod,expPeriod
        #type(access,refresh) token (jwt)  issuePeriod(00_00_00:00_00) expPeriod(00_00_00:00_00)
        userid = kwargs.get("userid")
        username =kwargs.get("username")
        token = kwargs.get("refresh_token")
        issued_at = kwargs.get("issued_at")
        expires_at = kwargs.get("expires_at")
        revoked = kwargs.get("revoked")
        con,cur = self.connect_db()
        cur.execute(f'INSERT INTO tripin_auth.tokens (user_id,user_name,token,issued_at,expires_at,revoked) VALUES (%s, %s, %s, %s, %s, %s)',(userid,username,token,issued_at,expires_at,revoked,))
        con.commit()
        if(cur.rowcount<0):
            return False, "Error insert to db"

        return True