

## Take Picture
After taking picture, save to camera roll, then save to sqlite3 then save to the app album()
If on a trip, it will then send the image to server and have server handle it
server then will return an hash fuction, that will compare with local hash function 
if hash function not matching, it will began the sync system

## Take picture flow
```
        picture taken
            |
            |_save to camera roll
            |_save to sqlite3
            |_save to app album
            |_display to map
            |_send to server if on a trip
                        |
                        |_failed -> return 
                        |
                        |_success -> compare hash
                                        |_ match -> return 
                                        |_not match begin sync 
```


## Notes 