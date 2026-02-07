// src/frontend/navigationService.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.log('not ready')
    // if not ready, delay slightly
    setTimeout(() => {
      if (navigationRef.isReady()) navigationRef.navigate(name, params);
    }, 100);
  }
}