import React, {Component} from "react";
import{AppRegistry} from "react-native";
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
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
    },
   },
  Map: {
    screen: Map,
    navigationOptions: {
      title: 'Map',
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