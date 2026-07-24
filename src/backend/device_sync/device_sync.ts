import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as Crypto from "expo-crypto";
import DeviceInfoStorage from '../storage/device/device_info';
import fetchFunction from '../services/fetch_function';
import { Device_type } from '../../types/device.types';
import * as API from '../../config/config_api'
class DeviceSync {
  // async getDeviceUUID () {
  //   let uuid = await DeviceInfoStorage.getDeviceInfoFromLocal()

  //   if (!uuid) {
  //     uuid = uuidv4();
  //     await SecureStore.setItemAsync('device_uuid', uuid);
  //   }

  //   return uuid;
  // }

  async getPushToken() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    return token;
  }

  async generateDeviceInfo(push_token:string):Promise<Device_type> {
    try {
      const device = await DeviceInfoStorage.getDeviceInfoFromLocal()
      const brand = Device.brand || 'unknown';
      const model = Device.modelName || 'unknown';
      let device_id = device?.device_id || `${brand}:${model}:${Crypto.randomUUID()}
}`;
      let platform = device?.platform || Device.osName?.toLowerCase() || 'unknown';
      let last_seen = Date.now()
      return {
        device_id,
        platform,
        push_token,
        last_seen
      };
    }
    catch (err) {
      console.error(`Failed to generate device info: ${err}`)
      return null
    }
  }
  async updateDeviceInfoToServer(device: Device_type) {
    try{
      const response = await fetchFunction(API.SYNC_DEVICE, {
        method:'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          device_id: device.device_id,
          push_token: device.push_token,
          last_seen: device.last_seen,
          platform:device.platform
        })
      })
      console.log(response)
      if (!response.ok || response.status !== 200) return false
      return true
    }
    catch (err) {
      console.error(`Failed to sync device: ${err}`)
      return false
    }
  }

  async checkAndUpdateDeviceHandler(force:boolean = false) {

    try{
      // get the device token from local
      let device = await DeviceInfoStorage.getDeviceInfoFromLocal()
      let modify: boolean = false
      const current_time = Date.now()
      const push_token = await this.getPushToken()
      // this will cover pass 5 mins and inital send
      // update if last seen pass 5 mins or not exist or one of the dynamic token change. EX push_noti token
      console.log(device)

      if(force) modify = true
      else if (current_time - (device?.last_seen || 0) >= 300000) {
        modify =true
      }
      else if (push_token !== device?.push_token) modify = true

      if (modify) {
        // if modify
        // generate new device
        device = await this.generateDeviceInfo(push_token)
        if (!device) throw new Error (`Failed to get device info`)
        // send to server
        const update_device_to_server = await this.updateDeviceInfoToServer(device)
        // if send to server success fully
        if (!update_device_to_server) return
        //
        await DeviceInfoStorage.setDeviceInfoToLocal(device)
      }
      return
    }
    catch (error) {
      throw new error(error)
    }
  }
}

export default new DeviceSync();
