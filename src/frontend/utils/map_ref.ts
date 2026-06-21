type Coords = [number, number];

let cameraMapRef: any = null;

export const setCameraMapRef = (ref: any) => {
  cameraMapRef = ref;
};

export const flyToMarker = (coords: Coords, zoom: number) => {
  if (!cameraMapRef) {
    console.log("missing ref");
    return;
  }
  cameraMapRef.setCamera({
    centerCoordinate: coords,
    zoomLevel: zoom,
    animationDuration: 1000,
  });
};

export const flyToOnTopMarker = (coords: Coords, zoom: number) => {
  if (!cameraMapRef) {
    console.log("missing ref");
    return;
  }
  cameraMapRef.setCamera({
    centerCoordinate: coords,
    zoomLevel: zoom,
    animationDuration: 1000,
    padding: {
      paddingTop: 0,
      paddingBottom: 350,
      paddingLeft: 0,
      paddingRight: 0,
    },
  });
};
