import * as coordinateCal from '../coordinates/coordinates_cal'
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
        const itemMaxMin = coordinateCal.getCoorMaxMin(item.latitude, item.longitude,radius)
        const centerMaxMin = coordinateCal.getCoorMaxMin(cluster.center.lat,cluster.center.lng,radius)
        if (coordinateCal.boxesOverlap(centerMaxMin,itemMaxMin)){
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
const createNewCluster=(lat,lng,cluster_id)=>{
    return ({
        cluster_id : cluster_id,
        center:{lat,lng},
        members :[]
    })
}