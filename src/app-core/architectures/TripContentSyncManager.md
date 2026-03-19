## Check Trip Media Hash
will triger everytime user upload media to server
compare the server hash and local then request sync if need

## Check Trip Media Hash flow

```
Upload -> check if hash is the same
            |
            |_same -> return no action needed
            |
            |_ different
                |
                |_request trip media metadata -> get local trip media metadata -> loop through and result in delete array and upload array
                |
                |_delete array is defined as medias that server have but local dont
                |_upload array is defined as medias that app have but server dont
                |
                |_pass into trip-contents-sync service (TripContentSync.md)

```

## Trip Media Sync Handler
fucntion will run everytime app got refresh or been request by network observers when app back online
compare the server hash and local then request sync if need

```
Called -> request server hash  
                |_check if hash is the same with local hash
                        |
                        |_same -> return no action needed
                        |
                        |_ different
                            |
                            |_request trip media metadata -> get local trip media metadata -> loop through and result in delete array and upload array
                            |
                            |_delete array is defined as medias that server have but local do not 
                            |
                            |_upload array is defined as medias that app have but server do not
                            |
                            |_pass into trip-contents-sync service (TripContentSync.md)
```

## Helper Functions

## _generateAndSaveTripMediaHash
generate hash then save it to localstorage 

## _getAndCompareTripMediasHash
get server hash and local hash and compare

## _getAndProcessTripMediasMetadata (only triger if hash not matching)
get trip media metadata from server, filter in to delete array and upload array
request sync base on the arrays

## _processRequestDeleteTripMedias,_processRequestUploadTripMedias
process sync by loop and add into trip-contents-sync-service's queue then process 

## Note 
hash are encode based on the total trip media using key as media_id
both server and app mush follow this rule

## trip-contents-sync-service -> TripContentSync.md