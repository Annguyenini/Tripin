type coords = [number, number];
let cameraMapRef = null;
export const setCameraMapRef = (mapRef) => {
  // console.log("mount ref", mapRef, cameraMapRef === mapRef);
  // cameraMapRef = mapRef;
};

export const flyToMarker = (coords: coords, zoom: number) => {
  // console.log(cameraMapRef.setCamera, coords, zoom);
  // // if (!cameraMapRef.current) {
  // //   console.log("missing ref");
  // //   return;
  // // }
  // cameraMapRef?.setCamera({
  //   centerCoordinate: coords,
  //   zoomLevel: zoom,
  //   animationDuration: 1000,
  // });
};
