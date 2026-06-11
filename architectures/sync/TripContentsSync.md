# TRIPPING Sync Architecture

## Trip sync only happen when on current active trip 

# Events of sync

## Get trip contents
## Network event (if server reachable, only happen when positive edge) 
## Before end trip (force sync)


# Keys 
## upload_array - an array of contents that exists in local but not in server, also the event have to be 'add'
## delete_array - an array of contents that have event = 'remove' in local and 'add' in server

## Diagram
# see architecture/diagram/current_trip_contents_handler
