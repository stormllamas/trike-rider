import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification'
import { LocalNotification } from './LocalPushController'


const RemotePushController = () => {
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token)
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification)
        PushNotification.localNotification({
          channelId: "pn-1",
          autoCancel: true,
          subText: notification.message ? notification.message : 'Go to Trike Rider App',
          bigText: 'Click here to go to the Trike Rider app',
          title: 'New Trike Order',
          message: 'Expand to see more',
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: 'default',
          // actions: '["Yes", "No"]'
        })
        // process the notification here
      },
      // Android only: GCM or FCM Sender ID
      senderID: '287429814417',
      popInitialNotification: true,
      requestPermissions: true
    })
  }, [])

  return null
}

export default RemotePushController