import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
const AppNotifications = async() => {
  let Permission=null
  const { status: existsPermission } = await Notifications.getPermissionsAsync()
  if (existsPermission !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    Permission = status
  }
  if (!Permission)return
}
