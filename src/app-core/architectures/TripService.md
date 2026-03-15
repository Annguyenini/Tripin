
# Trip Service Architecture
## Overview
Allow user to create, modify, and end trip
To create users required to provide trip name, and or trip image
User can modify either trip name or image


## Create Trip Flow
```
User Create -> Server return 
                    |
                    |__ success -> trip id (int)
                    |_fail -> return
success -> App handle
                |
                |_ if have image -> save image to a path with key    
                |   {trip_id}_cover.jpg
                |
                |_ async storage | trip_data (data, trip name,trip   
                |    id, trip image)
                |
                |_ create sqlite3 table for trip -> insert into table
                |
                |_ call gps task controller
``` 
## modify Trip Flow
```
User modify trip -> generate a data object include either or both trip name and trip image -> server respond
                                |
                                |_failed -> return
                                |
                                |_success -> modify 
                                |
                                
```