from server_side.tokenservice import TokenService
from server_side.database import Database
class User_Request:
    _instance = None
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__(self):
        self.token_service = TokenService()
        self.database_service = Database()
    def request_new_trip(self,user_id,trip_name):
        # trip_db layout 
        # trip_id | trip_name | user_id | start_time | end_time | active

        exist_trip = self.database_service.find_item_in_sql(second_condition= True, table="tripin_trips.trips_table",item = "user_id", value=user_id, item2 ="active", value2 =True )
    
        if exist_trip is not None:
            return False, f"Currently in {exist_trip[1]}"
    
        exist_trip_name = self.database_service.find_item_in_sql(table = "tripin_trips.trips_table", item = "trip_name", value = trip_name)
        
        if exist_trip_name is not None:
            return False, f"Trip name: {trip_name} already exist!"
        
        create_trip,trip_id = self.database_service.insert_to_database_trip(user_id = user_id, trip_name = trip_name)
        if create_trip >=1 :
            return True, trip_id, f"Created trip {trip_name} successfully"
        else: 
            return False, "Error occur while creating trip." 
           
    def end_a_trip(self, trip_id):
        end_trip = self.database_service.update_db(table = "tripin_trips.trip_table", item = "id", value= trip_id, item_to_update = "active",value_to_update = False)
        if not end_trip:
            return False, f"Error while trying to end trip {trip_id}"
        return True,f"Successfully end trip {trip_id}" 
    
    