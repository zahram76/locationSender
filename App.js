import React from "react";
import {StyleSheet,
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  PermissionsAndroid, 
  //AppRegistry, 
  Dimensions,
  TextInput,
  Image,
  ScrollView} from "react-native";
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import haversine from "haversine";

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import Login from './Login.js';
import ShowOnMap from './ShowOnMap.js';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  ShowOnMap: { screen: ShowOnMap},
});

const App = createAppContainer(AppNavigator);
export default App;

