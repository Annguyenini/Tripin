   if(foregroundStatus&&backgroundStatus){
     {
      // if the uses are not in any tcurrent trip,  we can skipp tracking in background
      
      (async()=>{
      const state = AppState.addEventListener('change' ,nextState=>{
        setCurrentState(nextState)
      });
      // await location_logic();
      location_logic.location_handler(currentState);
      return () => state.remove();
      })();

      // location_handler(currentState)
      
    }

  }