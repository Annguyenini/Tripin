import requests
# def test_access_token():
#     headers={
#         "Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlciI6IkFubmd1eWVuIiwiaXNzdWUiOjE3NTk3NTE3MDIsImV4cCI6MTc1OTc1MTc2Mn0.tXE7pN6cWHO0jU6PwH41U3mcaY6k0VHHXNmKlay_AzAmhi1191ixmRYClG-U3RHkvTdzq_VAoAfyhnob4QOd6VZKr1UpsrOvHrnWnAUm2CZIkn26DKfb_DeiY2fIAimSBWi93a8S0kYcGlahMgxSk37CavOA5pdMir8EVrZ56F3KsjBTTWcDPygMc_YrdP3rw-Aax-8p08eOD1gUsvFNfyFaQFhJs6RrKfAEanDDFmQ5CNdGibxtcoWpCxPxyvdvX4KVZyaC8sCHYmI0HOjI-TfOpkGLC3HWFueEpAOgryeDFHTJPvRwcQvPHT2pEhSg-Q9431CajMQeOcnRkFpAQg"
#     }
#     response =requests.post("http://127.0.0.1:8000/login/token",headers = headers)
#     data = response.json()
#     print(data)
#     assert response.status_code ==401,"Unexpected error"
def test_access_token_request_new_token():
    headers={
        "Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlciI6IkFubmd1eWVuIiwiaXNzdWUiOjE3NTk3NTE3MDIsImV4cCI6MTc2MjM0NzMwMn0.jZNvXMxW_MwmlINZBZmvW5QOnnn_4FB7-rU8KGct5q4Xz2O7sBjTA9by_MQ82fzIoypEKP9mK3RLWpdiXdfBcZXfv_7Pu6lACPpom2cBz8JZ5-Zz5CsfeAHeH6ZDGBnGdhWpCW-wqUsHOU5OxpTXbScdVTwlYdM7rvkC6ZPXwo--ms2VVaKF-oMjibKAFGctPOppJAxyyzc0MDRem_Y1AguY8SpzbqdPWXcpEIDh6rVHC9QSfAJMmcMd_LHIB-Yo5VE1eFhVcheNGeNlyTCCZFBQaUxIEuHettz4kNyxvaUY4dipobksqJNFYfPrrxXpOYlMkpzXH0-dRiWzMk4-Ag"
    }
    response = requests.post("http://127.0.0.1:8000/auth/requestAT",headers =headers)
    data =response.json()
    print(data)
    assert response.status_code == 200,"Unexpected error"
def test_access_token_request_new_token_expried():
    headers={
        "Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlciI6IkFubmd1eWVuIiwiaXNzdWUiOjE3NTk3NTAxOTcsImV4cCI6MTc2MjM0NTc5N30.JWBYld1i6JtGgILHiYfioSRFJxNE59Jd3SDEE6t7aQIiaM2b2du_kC6Un-U-Wn_RBa-x22szQNfHhyjHokZq9Y-vpPbZCmZv2C3vogU5ebfYvnOtfyMPFnKjBZ8i_8KIpVeBY8ZAexqc5yY0i-0HFJH-m81gO170B-ZyTie74ujU4pzAEVauLCVVwFgZbOomA5t__PG8nT6J8i3lrISIFKQKmT9YSdjundU92K7sHVFQ7byxI9OnVcMZKtE3zlItQyHC5IyJggs-W97T-O-M0q_ggvHPDZA5li98g8XwUi9xfofy9TEHaVyEUAg6Oc4yQT0PLHgpVzkT1xMZ95yxtw"
    }
    response = requests.post("http://127.0.0.1:8000/auth/requestAT",headers =headers)
    data =response.json()
    print(data)
    assert response.status_code ==  401,"Unexpected error"