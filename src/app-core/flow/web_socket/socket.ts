import { io, Socket } from "socket.io-client";
import * as API from '../../../config/config_api'
type callback = (value: string, data: any) => void
interface eventConnection  {
  event_name: string,
  callback:(value:string,data:any)=>void
}
//base socket
class SocketService {
  private socket: Socket | null = null;
  private isSocketOpen: boolean = false
  private pendingConnect:eventConnection[] =[]
  // inital connection
  connect(accessToken: string) {
    this.socket = io("http://192.168.0.111:8888", {
      auth: {
        access_token: accessToken,
      },

      // transports: ["polling", "websocket"]
    });
    this.registerEvents();
    const connect = (event_name, callback) => {
      console.log('connect',event_name,callback)
      this.socket.on(event_name, (data) => {


        callback(event_name,data?.data)
      })
    }
    if (this.pendingConnect.length >= 1) {
      for (const pending of this.pendingConnect) {
        connect(pending.event_name,pending.callback)
      }
    }
    this.pendingConnect =[]
  }
  // initial
  private registerEvents() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(
        "Socket connected:",
        this.socket?.id
      );
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error.message
      );
    });
    // this.socket.on(
    //   "friendships",
    //   (data: Notification) => {
    //     console.log(
    //       "New notification:",
    //       data
    //     );
    //   }
    // );
  }

  addEvent(event_name:string, callback:callback) {
    if (!this.socket) {
      this.pendingConnect.push({'event_name':event_name,"callback":callback})
      console.error("Socket not connected", event_name);
      return;
    }
    this.socket.on(event_name, (data) => {
      console.log(event_name)
      callback(event_name,data?.data)
    })

  }

  removeEvent(event_name, callback) {
    this.socket.off(event_name,callback)
  }
  sendEvent<T>(event: string, data: T) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new SocketService();
