import requests
import json
def test_login_wrong_username():
    payload = {
        "username" :"Annguyesn",
        "password" :"Annguyen2005@"
    }
    response = requests.post("http://127.0.0.1:8000/login",json=payload)
    assert response.status_code == 401 ,"User was not created successfully"
    data = response.json()
    print("Wrong usename login case: ",data)
def test_login_wrong_password():
    payload = {
        "username" :"Annguyen",
        "password" :"Annguyen205@"
    }
    response = requests.post("http://127.0.0.1:8000/login",json=payload)
    assert response.status_code == 401 ,"User was not created successfully"
    data = response.json()
    print("Wrong password login case: ",data)
def test_login_perfect():
    payload = {
        "username" :"Annguyen",
        "password" :"Annguyen2005@"
    }
    response = requests.post("http://127.0.0.1:8000/login",json=payload)
    assert response.status_code == 200 ,"User was not created successfully"
    data = response.json()
    with open ("test.json","w") as log:
        json.dump(data,log,indent=4)
    print("Perfect login case: ",data) 
