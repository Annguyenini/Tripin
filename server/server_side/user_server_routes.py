from flask import Blueprint, jsonify, request
from flask_cors import CORS

class UserServer:
    _instance = None 
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__(self):
        self.db = Blueprint("user",__name__)


    def _register_routes(self):
        self.db.route("")