import React, {Component} from "react";
import{Button, AppRegistry} from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import SignIn from './screens/SignIn.js';
import Map from './screens/Map.js';
import SignUp from './screens/SignUp.js';
import Profile from './screens/Profile.js';
import ForgotPass from './screens/ForgotPass.js';
import AuthLoadingScreen from './screens/AuthLoading.js';

const AppStack = createStackNavigator({
  Map: {
    screen: Map,
    navigationOptions: {
      title: 'Map',
      headerRight: (
        <Button
          onPress={() => alert('This is a button!')}
          title="Info"
          color="#fff"
        />
      ),
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
    },
   },
});
const AuthStack = createStackNavigator({ 
  SignIn: { screen: SignIn ,
    navigationOptions: {
      header: null, //this will hide the header
    },
  },
  SignUp: { screen: SignUp ,
    navigationOptions: {
      header: null,
    },
  },
  ForgotPass: { screen: ForgotPass ,
    navigationOptions: {
      title: 'ForgotPass',
    },
  },
 });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

//AppRegistry.registerHeadlessTask('backgroundTask', () => require('backgroundTask'));
AppRegistry.registerComponent('sender', () => App);