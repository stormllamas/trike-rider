import PushNotification from 'react-native-push-notification'

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('LOCAL NOTIFICATION ==>', notification)
  },

  popInitialNotification: true,
  requestPermissions: true
})

export const LocalNotification = () => {
  PushNotification.localNotification({
    channelId: "pn-1",
    autoCancel: true,
    bigText: 'Click here to go to the Trike Rider app',
    subText: 'Go to Trike Rider App',
    title: 'New Trike Order',
    message: 'Expand to see more',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    // actions: '["Yes", "No"]'
  })
}