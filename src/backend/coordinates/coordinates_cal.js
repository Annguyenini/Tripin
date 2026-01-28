export const getCoorMaxMin=(lat,lng,radius)=>{
    const deltaLat = radius/111320
    const deltaLng = radius/ (111320 * Math.cos(lat * Math.PI / 180))
    return ({
        'minLat' : lat-deltaLat,
        'maxLat' : lat + deltaLat,
        'minLng' : lng - deltaLng,
        'maxLng' : lng +deltaLng,
    })}
export const boxesOverlap=(a,b)=>{ 
    
  return !(
    a.maxLat < b.minLat ||
    a.minLat > b.maxLat ||
    a.maxLng < b.minLng ||
    a.minLng > b.maxLng
)}
const toRad = (deg) => deg * Math.PI / 180;

export const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Earth radius in meters
    const deltaLat = toRad(lat2 - lat1);
    const deltaLng = toRad(lng2 - lng1);

    const a = Math.sin(deltaLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in meters
};

