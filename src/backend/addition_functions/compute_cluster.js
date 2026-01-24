export const computeCluster =(assetArray,radius)=>{
    let clusters =[] 
  for (const item of assetArray){
    let assign = false
    if(clusters.length ===0){
        const newCluster = createNewCluster(item.latitude,item.longitude,clusters.length)
        clusters.push(newCluster)
        newCluster.members.push(item)
        continue
    }
    for(const cluster of clusters){
        const itemMaxMin = getCoorMaxMin(item.latitude, item.longitude,radius)
        const centerMaxMin = getCoorMaxMin(cluster.center.lat,cluster.center.lng,radius)
        if (boxesOverlap(centerMaxMin,itemMaxMin)){
            cluster.members.push(item)
             assign =true
            break   
        }
          
    }
    if (! assign){
        const newCluster = createNewCluster(item.latitude,item.longitude,clusters.length )
        clusters.push(newCluster)
        newCluster.members.push(item)
    }
  }
  return clusters
}
const getCoorMaxMin=(lat,lng,radius)=>{
    const deltaLat = radius/111320
    const deltaLng = radius/ (111320 * Math.cos(lat * Math.PI / 180))
    return ({
        'minLat' : lat-deltaLat,
        'maxLat' : lat + deltaLat,
        'minLng' : lng - deltaLng,
        'maxLng' : lng +deltaLng,
    })}
const boxesOverlap=(a,b)=>{ 
    
  return !(
    a.maxLat < b.minLat ||
    a.minLat > b.maxLat ||
    a.maxLng < b.minLng ||
    a.minLng > b.maxLng
)}
const createNewCluster=(lat,lng,cluster_id)=>{
    return ({
        cluster_id : cluster_id,
        center:{lat,lng},
        members :[]
    })
}