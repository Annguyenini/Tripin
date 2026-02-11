import * as coordinateCal from '../coordinates/coordinates_cal'
export const computeCluster =(assetArray,radius,closeCluster= false)=>{
    let clusters =[] 
    // let lastCluster ={}
  for (const item of assetArray){
    let assign = false
    // the first cluster, created new cluster
    if(clusters.length ===0){
        const newCluster = createNewCluster(item.latitude,item.longitude,clusters.length)
        clusters.push(newCluster)
        newCluster.members.push(item)
        continue
    }
    // check and ground into clusters
    for(const cluster of clusters){
        const itemMaxMin = coordinateCal.getCoorMaxMin(item.latitude, item.longitude,radius)
        const centerMaxMin = coordinateCal.getCoorMaxMin(cluster.center.lat,cluster.center.lng,radius)
        if (coordinateCal.boxesOverlap(centerMaxMin,itemMaxMin)){
            if(cluster.closed) break
            cluster.members.push(item)
            assign =true
            break   
        }
          
    }
    // if can't group created new cluster
    if (! assign){
        const newCluster = createNewCluster(item.latitude,item.longitude,clusters.length )
        clusters.push(newCluster)
        newCluster.members.push(item)
        // if want to close the previous cluster, use for coordinates to prevend close coords but wrong path 
        if(closeCluster){
            clusters[clusters.length -2 ].closed = true
        }
        
    }
  }
  return clusters
}
const createNewCluster=(lat,lng,cluster_id)=>{
    return ({
        cluster_id : cluster_id,
        center:{lat,lng},
        closed:false,
        members :[]
    })
}