import json
text ={'dsdsd':'dsdssd','ddd':'ddd'}
json_string = json.dumps(text)
with open('test_output/albumassets.json','w') as j:
    json.dump(json_string,j,indent=4)
    
    
# result =''    
# with open('test_output/albumassets.json','r') as j1:
#     result = j1.read()
