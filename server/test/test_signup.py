import requests
import pytest

def test_signup_perfect():
    payload = {
        "email" :"teasat@gamil.com",
        "displayName" : "Annaguyen",
        "username" :"Anndaguyen",
        "password" :"Annguyen2005@"
    }
    response = requests.post("http://127.0.0.1:8000/signup",json=payload)
    assert response.status_code == 200 ,"User was not created successfully"
    data = response.json()
    print("Perfect signup case: ",data)
def test_signup_exist_username():
    payload = {
        "email" :"tesat@gamil.com",
        "displayName" : "Annguyen",
        "username" :"Annguyen",
        "password" :"Annguyen2005@"
    }
    response = requests.post("http://127.0.0.1:8000/signup",json=payload)
    assert response.status_code == 401 ,"User was not created successfully"
    data = response.json()
    print("Exist username signup case: ",data)
def test_signup_exist_email():
    payload = {
        "email" :"test@gamil.com",
        "displayName" : "Annguyen",
        "username" :"Ananguyen",
        "password" :"Annguyen2005@"
    }
    response = requests.post("http://127.0.0.1:8000/signup",json=payload)
    assert response.status_code == 401 ,"User was not created successfully"
    data = response.json()
    print("Exist email signup case: ",data)
def test_signup_exist_email_username():
    payload = {
        "email" :"test@gamil.com",
        "displayName" : "Annguyen",
        "username" :"Annguyen",
        "password" :"Annguyen2005@"
    }
    response = requests.post("http://127.0.0.1:8000/signup",json=payload)
    assert response.status_code == 401 ,"User was not created successfully"
    data = response.json()
    print("Exist email/username signup case: ",data)
