import { Device_type } from "../../../types/device.types";
import LocalStorage from "../async_storage/localStorage";
import { STORAGE_KEYS } from "../hot_data/keys/storage_keys";


class DeviceInfoStorage extends LocalStorage{
  constructor() {
    super()
  }
  async setDeviceInfoToLocal(device: Device_type) {
    try{
      this.saveDataObjectToLocal(STORAGE_KEYS.DEVICE.DEVICE_INFO, device)
    }
    catch (error) {
      console.error(`failed to set device info to local: ${error}`)
    }
  }
  async getDeviceInfoFromLocal():Promise<Device_type> {
    try {
      const device = this.getDataObjectFromLocal(STORAGE_KEYS.DEVICE.DEVICE_INFO)
      return device
    }
    catch (error) {
      console.error(`failed to get device info: ${error}`)
      return null
    }
  }
}
export default new DeviceInfoStorage()
