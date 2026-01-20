from datetime import datetime
# import json
# text =[{"coordinates": {"altitude": 27.399147263765336, "heading": -1, "latitude": 33.750507612697426, "longitude": -117.96657338913282, "speed": -1}, "time_stamp": 1768861377556, "trip_id": 122}, {"coordinates": {"altitude": 27.399147263765336, "heading": -1, "latitude": 33.750507612697426, "longitude": -117.96657338913282, "speed": -1}, "time_stamp": 1768861378185, "trip_id": 122}, {"coordinates": {"altitude": 18.033321380615234, "heading": -1, "latitude": 33.750529932739575, "longitude": -117.96641987141604, "speed": 0}, "time_stamp": 1768861378239, "trip_id": 122}, {"coordinates": {"altitude": 18.44668197631836, "heading": -1, "latitude": 33.75053232785122, "longitude": -117.96641790988207, "speed": 0}, "time_stamp": 1768861384992, "trip_id": 122}, {"coordinates": {"altitude": 27.399147263765336, "heading": -1, "latitude": 33.75051868201903, "longitude": -117.96653098135393, "speed": 0}, "time_stamp": 1768861403983, "trip_id": 122}]
# json_string = json.dumps(text)
# with open('test_output/albumassets.json','w') as j:
#     json.dump(text,j,indent=4)
    
    
# # result =''    
# # with open('test_output/albumassets.json','r') as j1:
# #     result = j1.read()
time_s = 1768874355271/1000
dt = datetime.fromtimestamp(time_s)
formatted = dt.strftime("%Y-%m-%d %H:%M:%S")
print (dt)