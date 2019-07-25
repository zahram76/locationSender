// import React from "react";
// import {StyleSheet,
//   View, 
//   Text, 
//   TouchableOpacity, 
//   Platform, 
//   PermissionsAndroid, 
//   Dimensions,
//   Image,
// } from "react-native";
// import SmsListener from 'react-native-android-sms-listener';
// import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
// import haversine from "haversine";
// import AsyncStorage from "@react-native-community/async-storage";


// module.exports = async () => {
//     SmsListener.addListener(message => {
//         if(message.originatingAddress == '+989336812618'){
//             const res = message.body.split(' ');
//             if (res[0] == 'hello'){
//               const long = res[1].split('long:')[1];
//               const lat = res[2].split('lat:')[1];
//               const la = parseFloat( parseFloat(lat.split('.'[1])));
//               const lo =  parseFloat( parseFloat(long.split('.'[1])));
//             //   let coords = {...this.state.coord, latitude: la, longitude:lo};
//             //   this.setState({coords});
//             //   AsyncStorage.setItem('latitude', JSON.stringify(la));
//             //   AsyncStorage.setItem('longitude', JSON.stringify(lo));
//             }
//           }
//         }
//   }