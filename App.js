import React, {useEffect} from 'react';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';

import {navigationRef} from './components/RootNavigation'

import Intro from './components/common/Intro'
import Login from './components/accounts/Login'
import Security from './components/accounts/Security'
import Profile from './components/accounts/Profile'

import OrdersManager from './components/OrdersManager'

import { loadUser } from './actions/auth'
import { loadSite } from './actions/siteConfig'

import PushNotification, {Importance} from 'react-native-push-notification';
import RemotePushController from './services/RemotePushController'


const Stack = createStackNavigator();

const linking = {
  prefixes: ['trikerider://'],
  config: {
    screens: {
      OrdersManager: 'ordersmanager',
      Profile: 'profile',
    },
  }
};

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadSite());

    PushNotification.createChannel(
      {
        channelId: "pn-1", // (required)
        channelName: "Push Notification 1", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        // playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.subscribeToTopic('new-order')
  });

  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.dark, ...theme}} customMapping={mapping}>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
            <Stack.Screen
              name="Intro"
              component={Intro}
            />
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Security"
              component={Security}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
            />
            <Stack.Screen
              name="OrdersManager"
              component={OrdersManager}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
      <RemotePushController />
    </Provider>
  )
}

export default App;