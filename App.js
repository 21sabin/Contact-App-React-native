
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text, TouchableOpacity
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Login, Register, ContactList, Header, EditContact, ContactCreate, LocateMap, ResolveAuthScreen, SignOut } from './src/app/screens'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import { Provider } from './src/app/context/ContactContext';
import { getCurrentUser } from './src/app/firebase/firebase.utils';
import { Provider as AuthProvider } from './src/app/context/AuthContext';
import { setNavigator } from './src/app/navigationRef';
import messaging from '@react-native-firebase/messaging';
const Auth = createSwitchNavigator(
  {
    ResolveAuth: ResolveAuthScreen,
    Login: { screen: Login },
    Register: { screen: Register }
  }, {
  navigationOptions: {
    header: null
  }

}
)

const ContactStack = createStackNavigator({
  Contact: {
    screen: ContactList, navigationOptions: ({ navigation }) => {
      return {
        header: <View style={{ backgroundColor: '#375da1', height: 50, flexDirection: 'row', alignItems: 'center', }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="bars" style={{ fontSize: 30, color: '#fff', padding: 10 }} />
          </TouchableOpacity>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 30, paddingLeft: 30 }}>Contact List</Text>
        </View>
      }
    }
  },
  EditContact: { screen: EditContact },
  ContactCreate: { screen: ContactCreate }
}, {

});


const App = createDrawerNavigator({
  Contact: ContactStack,
  SignOut: SignOut

}, {
  navigationOptions: {
    header: null
  }
});

const AppTabNavigation = createBottomTabNavigator({
  Contact: { screen: App },
  LocateMap: { screen: LocateMap }
}, {
  navigationOptions: {
    header: null
  }
})



const AppRoute = createStackNavigator({
  Auth: { screen: Auth },
  App: { screen: AppTabNavigation }
}, {
  navigationOptions: {
    header: null
  }
})


const MainApp = createAppContainer(AppRoute);


async function registerAppWithFCM() {
  let register_device = await messaging().registerDeviceForRemoteMessages();
  console.log('Device registered in FCM', register_device)
}

export default () => {
  // getCurrentUser();
  useEffect(() => {
    registerAppWithFCM();
    return () => {

    }
  }, [])
  return (

    <Provider>
      <AuthProvider>
        <MainApp
          ref={
            navigator => {
              setNavigator(navigator)
            }
          }
        />
      </AuthProvider>

    </Provider>

  )
}