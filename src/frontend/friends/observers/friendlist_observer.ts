import SocketService from "../../../app-core/flow/web_socket/socket"
import { UserData } from "../../../types/user_data.types"
interface observer { update(value: UserData[]): void }
type event = 'friend_request'| 'friend_removed' | 'friend_added' | 'friend_reject' | 'friend_cancel'
class FriendshipsObserver {
  private observers: Map<event, observer[]> = new Map()
  constructor() {
    SocketService.addEvent('friend_request', this.socketCallback.bind(this))
    SocketService.addEvent('friend_removed', this.socketCallback.bind(this))
    SocketService.addEvent('friend_added', this.socketCallback.bind(this))
    SocketService.addEvent('friend_reject', this.socketCallback.bind(this))
    SocketService.addEvent('friend_cancel', this.socketCallback.bind(this))
  }
  private socketCallback(event:event,data:UserData[]) {
    // console.log(data, event, this.i)
  }
  // async _initalFriendOverviewList
  attach(event:event, observer: observer) {

    try {
      let observers = this.observers.get(event)
      if (!observers || observers?.length <= 0) {
        observers = []
      }
      observers.push(observer)
    }
    catch (err) {
      console.error(`failed to add into observer list: ${err}`)
    }
  }
  detach(event:event,observer: observer) {
    try {
      let observers = this.observers.get(event)
      if (!observers) return
      observers = observers.filter((obs:observer)=> obs!== observer)
    }
    catch (error) {
      console.error(`failed to remove from observer list: ${error}`)
    }
  }
  notify(event: event, data: UserData[]) {
    console.log('notify',event)
    try {
      let observers = this.observers.get(event)
      for (const obs of observers) {
        obs.update(data)
      }
    }
    catch (error) {
      console.error(`failed to notify observer list: ${error}`)
    }
  }
}
export default new FriendshipsObserver()
