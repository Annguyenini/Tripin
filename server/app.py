from flask import Flask, render_template, jsonify, request, send_file, abort
import configparser
import sqlite3
import json
import io
import os
import jwt
import datetime
class Server:
    def __init__(self):
        self.app = Flask(__name__)
        self.config = configparser.ConfigParser()
        self.config.read('Confignure.ini')
        self.authdb_path =self.config.get('paths', 'authdb', fallback=None)
    def __init__setup(self):
        
        if not os.file.exists(self.authdb_path):
            open(self.authdb_path,'w').close()
        con,cur = connect_db(self.authdb_path)
        cur.execute('CREATE TABLE IF NOT EXISTS auth (email TEXT,displayname TEXT, username TEXT, password TEXT)')
        con.commit()
        con.close()
        
    def connect_db(self, path):
        con = sqlite3.connect(path)
        cur= con.cursor()
        return con, cur

    def find_item_in_sql(self, item,value):
        con,cur = connect_db(self.authdb_path)
        cur.execute (f'SELECT * FROM auth WHERE {item}=?',(value))
        item = cur.fetchone()
        return item

    def generate_jwt(self, item, key):
        SECRET_KEY =key
        token = jwt.encode({
            "user":item.get['username'],
            "exp":datetime.datetime.utcnow() + datetime.timedelta(day =30)
        },
        SECRET_KEY,
        algorithm='HS256'
        )
        return token
















    def Auth(self):
        app = self.app
        @app.route("/POST/login", method =["POST"])
        def login(self):
            data = request.json()
            username = data.get("username")
            password = data.get("password")
        @app.route("/POST/signup",method =["POST"])
        def signup(self):
            data = request.json()
            email = data.get("email")
            display_name = data.get("displayName")
            username = data.get("username")
            password = data.get("password")
            if(find_item_in_sql("email",email)):
                return jsonify("EMAIL already exist!")
            if(find_item_in_sql("username",username)):
                return jsonify("Username already exist!")
            con,cur= connect_db(self.authdb_path)
            cur.execute(f'INSERT INTO auth (email,displayname,username,password) VALUES(?,?,?,?)',(email,display_name,username,password))
            con.commit()
            con.close()
            return jsonify("Successfully!")







server = Server()
app = server.app