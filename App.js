// import React, {Component} from 'react';
// import {AppRegistry, Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
// import { Button , DeviceEventEmitter} from 'react-native';
// import SmsListener from 'react-native-android-sms-listener';
// import SmsAndroid  from 'react-native-get-sms-android';
// import {PermissionsAndroid} from 'react-native';
// import MapView, {Marker} from 'react-native-maps';

// const {width,height} = Dimensions.get('window')
// const SCREAN_HEIGHT =  height;
// const SCREAN_WIDTH = width;
// const ASPECT_RATIO = width/height;
// const LATITIUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LONGITUDE_DELTA * ASPECT_RATIO;

// export async function requestPermission() {
//   try {
//     const granted = await PermissionsAndroid.requestMultiple(
//       [PermissionsAndroid.PERMISSIONS.SEND_SMS,
//       PermissionsAndroid.PERMISSIONS.READ_SMS,
//       PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ,
//       {
//         title: 'App',
//         message:
//           'App needs access to your SMS and read your loacation',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },

//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('granted');
//     } else {
//       console.log('not granted');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }

// export default class App extends Component {

// constructor() {
//   super();

//   this.state = {
//     markers: {
//       coordinates: {
//         latitude: 32.665509,
//         longitude: 51.709533
//       }
//     },
//     region : {
//       latitude: 32.665509,
//       longitude: 51.709533,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01
//       },
//     initialPosition: {
//       latitude: 0,
//       longitude: 0,
//       latitudeDelta: 0,
//       longitudeDelta: 0
//     },
//     markerPosition: {
//       latitude: 0,
//       longitude: 0
//     }
//   }
// }

// watchID = null;

// async componentDidMount() {
//     await requestPermission();
//     console.log('0');

//     navigator.geolocation.getCurrentPosition((position) => {
//       var lat = parseFloat(position.coords.latitude);
//       var long = parseFloat(position.coords.longitude);

//       console.log('1');
//       console.log(lat);
//       console.log(long);

//       var initialRegion = {
//         latitude: lat,
//         longitude: long,
//         longitudeDelta: LONGITUDE_DELTA,
//         latitudeDelta: LATITIUDE_DELTA
//       }
//       this.setState({initialPosition : initialRegion})
//       this.setState({markerPosition: initialRegion})
//       },
//       (error) => alert(JSON.stringify(error)),
//       {enableHighAccuracy : true, timeout : 20000, muximumAge : 1000}
//     );

//     this.watchID = navigator.geolocation.watchPosition((position) => {
//       var lat = parseFloat(position.coords.latitude);
//       var long = parseFloat(position.coords.longitude);

//       console.log('2');
//       console.log(lat);
//       console.log(long);

//       var lastRegion = {
//         latitude: lat,
//         longitude: long,
//         longitudeDelta: LONGITUDE_DELTA,
//         latitudeDelta: LATITIUDE_DELTA
//       }
//       this.setState({initialPosition : lastRegion})
//       this.setState({markerPosition: lastRegion})
//       },
//       (error) => alert(JSON.stringify(error)),
//       {enableHighAccuracy : true, timeout : 20000, muximumAge : 1000}
//     );
    
//   DeviceEventEmitter.addListener('sms_onDelivery', (msg) => {
//     console.log(msg);
//   }); // vaghti sms tahvil dade shod mige

//   SmsListener.addListener(message => {
//     //console.log(message.originatingAddress);
//     this.showmassage(message);
//   }); // vaghti sms biad mige 
// }

// componentWillUnmount(){
//   navigator.geolocation.clearWatch(this.watchID);
// }

// showmassage(message){
//   //console.info(message);
//   if(message.originatingAddress == '+989336812618'){
//     const res = message.body.split(' ');
//     //console.log(res);
//     if (res[0] == 'hello'){
//       const long = res[1].split('long:')[1];
//       const lat = res[2].split('lat:')[1];
//       const la = parseFloat( parseFloat(lat.split('.'[1])));
//       const lo =  parseFloat( parseFloat(long.split('.'[1])));
//       console.log(la + 'lat');
//       console.log(lo + 'long');
//       this.updateMarker(la,lo);
//     }
//   }
// }

//   sendsms(){
//     phoneNumber = '+989336812618';
//     message = 'hello long:51.713584 lat:32.656005';
//     SmsAndroid.autoSend(phoneNumber, message, (fail) => {
//         console.log("Failed with this error: " + fail)
//     }, (success) => {
//         console.log("SMS sent successfully" + success);
//     });
//   }

// updateMarker(la, lo){
//   let markers = {...this.state.markers, coordinates:{latitude:la,longitude:lo}};
//   let region = {...this.state.region, latitude:la, longitude:lo, 
//                     latitudeDelta:0.01, longitudeDelta:0.01};
//   this.setState({markers, region});
//  }

// //  <View style={styles.container}>
// //           <MapView style={styles.map} region={this.state.region}>
// //             <Marker coordinate={this.state.markers.coordinates}/>
// //           </MapView>
// //           <View style={styles.box}>
// //             <Text style={styles.welcome}> latitude : {this.state.latitude} </Text> 
// //             <Text style={styles.welcome}> longitude : {this.state.longitude} </Text> 
// //           </View> 
// //         </View>

//   render() {
//     return (
//       <View style={styles.container}>
//       <MapView style={styles.map} region={this.state.initialPosition}>
//         <Marker coordinate={this.state.markerPosition}/>
//       </MapView>
//       <View style={styles.box}>
//         <Text style={styles.welcome}> latitude : {this.state.markerPosition.latitude} </Text> 
//         <Text style={styles.welcome}> longitude : {this.state.markerPosition.longitude} </Text> 
//       </View> 
//     </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   box: {
//     flex: 0.2,
//     width: '100%',
//     height: '100%'
//   },
//   welcome: {
//     fontSize: 20,
//     color: 'blue',
//     textAlign: 'center',
//     margin: 10,
//     marginBottom: 10,
//   },
//   map: {
//     flex: 0.8,
//     width: '100%',
//     height: '100%',
//   }
// });

// AppRegistry.registerComponent('sender', () => App);

// import React, {Component} from 'react';
// import {AppRegistry, Platform, StyleSheet, Text, View, String} from 'react-native';
// import { Button , DeviceEventEmitter} from 'react-native';
// import {PermissionsAndroid} from 'react-native';
// import SmsAndroid  from 'react-native-get-sms-android';
// import SmsListener from 'react-native-android-sms-listener';
// import MapView, {Marker} from 'react-native-maps';

// export async function requestPermission() {
//   try {
//     const granted = await PermissionsAndroid.requestMultiple(
//       [PermissionsAndroid.PERMISSIONS.SEND_SMS,
//       PermissionsAndroid.PERMISSIONS.READ_SMS,
//       PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ,
//       {
//         title: 'App',
//         message:
//           'App needs access to your SMS and read your loacation',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },

//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('granted');
//     } else {
//       console.log('not granted');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }

// export default class App extends Component {

// constructor() {
//   super();

//   this.state = {
//     markers: {
//       coordinates: {
//         latitude: 32.665509,
//         longitude: 51.709533
//       }
//     },

//     region : {
//       latitude: 32.665509,
//       longitude: 51.709533,
//       latitudeDelta: 0.007,
//       longitudeDelta: 0.007
//       },

//     latitude: null,
//     longitute: null,
//     timestamp: null,

//     initalPosition: {
//       latitude: 32.665509,
//       longitude: 51.709533,
//       latitudeDelta: 0.007,
//       longitudeDelta: 0.007
//     },

//     markerPosition: {
//       latitude: 32.665509,
//       longitude: 51.709533
//     }
//   }
// }

// async componentDidMount() {
//     await requestPermission();
//     navigator.geolocation.getCurrentPosition((position) => {
//       var lat = parseFloat(position.coords.latitude)
//       var long = parseFloat(position.coords.longitude)

//       var initialRegion = {
//         latitude: lat,
//         longitude: long,
//         latitudeDelta: 0.007,
//         longitudeDelta: 0.007
//       }

//       this.setState({initialPosition: initialRegion})
//       this.setState({markerPosition: initialRegion})
//     },(error) => alert(JSON.stringify(error)),
//     {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000})

//     this.watchID = navigator.geolocation.watchPosition((position) => {
//       var lat = parseFloat(position.coords.latitude)
//       var long = parseFloat(position.coords.longitude)

//       var initialRegion = {
//         latitude: lat,
//         longitude: long,
//         latitudeDelta: 0.007,
//         longitudeDelta: 0.007
//       }

//       this.setState({initialPosition: initialRegion})
//       this.setState({markerPosition: initialRegion})
//     },(error) => alert(JSON.stringify(error)),
//     {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000})
    
//     DeviceEventEmitter.addListener('sms_onDelivery', (msg) => {
//       console.log(msg);
//     }); // vaghti sms tahvil dade shod mige

//     SmsListener.addListener(message => {
//       //console.log(message.originatingAddress);
//       this.showmassage(message);
//     }); // vaghti sms biad mige 
//   }
  
//   componentWillMount(){
//     navigator.geolocation.clearWatch(this.watchID)
//   }

// showmassage(message){
//     if(message.originatingAddress == '+989336812618'){
//       const res = message.body.split(' ');
//       if (res[0] == 'hello'){
//         const long = res[1].split('long:')[1];
//         const lat = res[2].split('lat:')[1];
//         const la = parseFloat( parseFloat(lat.split('.'[1])));
//         const lo =  parseFloat( parseFloat(long.split('.'[1])));
//         console.log(la + 'lat');
//         console.log(lo + 'long');
//         this.updateMarker(la,lo);
//       }
//     }
//   }

// sendsms(lat,long){
//     phoneNumber = '+989336812618';
//     message = 'hello long:' + long + ' lat:' + lat;
//     SmsAndroid.autoSend(phoneNumber, message, (fail) => {
//         console.log("Failed with this error: " + fail)
//     }, (success) => {
//         console.log("SMS sent successfully" + success);
//     });
//   }

// updateMarker(la, lo){
//     let markers = {...this.state.markers, coordinates:{latitude:la,longitude:lo}};
//     let region = {...this.state.region, latitude:la, longitude:lo, 
//                       latitudeDelta:0.01, longitudeDelta:0.01};
//     this.setState({markers, region});
//   }

 
//   render() {
//     return (
//         <View style={styles.container}>
//           <MapView style={styles.map} region={this.state.initalPosition}>
//             <Marker coordinate={this.state.markerPosition}/>
//           </MapView>
//           <View style={styles.box}>
//             <Text style={styles.welcome}> latitude : {this.state.markerPosition.latitude} </Text> 
//             <Text style={styles.welcome}> longitude : {this.state.markerPosition.longitude} </Text> 
//           </View> 
//         </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   box: {
//     flex: 0.2,
//     width: '100%',
//     height: '100%'
//   },
//   welcome: {
//     fontSize: 20,
//     color: 'blue',
//     textAlign: 'center',
//     margin: 10,
//     marginBottom: 10,
//   },
//   map: {
//     flex: 0.8,
//     width: '100%',
//     height: '100%',
//   }
// });


//AppRegistry.registerComponent('tracker', () => App);



import React from "react";
import {StyleSheet, View, Text, TouchableOpacity, Platform, PermissionsAndroid, AppRegistry} from "react-native";
import SmsAndroid  from 'react-native-get-sms-android';
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import haversine from "haversine";


const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const LATITUDE = 0;
const LONGITUDE = 0;

export async function requestPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ,
      {
        title: 'App',
        message:
          'App needs access to your SMS and read your loacation',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },

    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('granted');
    } else {
      console.log('not granted');
    }
  } catch (err) {
    console.warn(err);
  }
};

class AnimatedMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
      coords: {
        latitude : LATITUDE,
        longitude : LONGITUDE
      }
    };
  }

  async componentDidMount() {
    await requestPermission();
    const { coordinate } = this.state;

    SmsListener.addListener(message => {
      console.log(message.originatingAddress);
      console.log(message.body + 'message');
      this.showmassage(message);
      
      const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = this.state.coords;
        console.log(latitude,longitude);
        const newCoordinate = {
          latitude,
          longitude
        };
        console.log({ newCoordinate });

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
    }); // vaghti sms biad mige 
  }

  componentWillUnmount() {
   // navigator.geolocation.clearWatch(this.watchID);
  }

  showmassage(message){
    if(message.originatingAddress == '+989336812618'){
      const res = message.body.split(' ');
      if (res[0] == 'hello'){
        console.log('hello');
        const long = res[1].split('long:')[1];
        const lat = res[2].split('lat:')[1];
        console.log(lat);
        const la = parseFloat( parseFloat(lat.split('.'[1])));
        const lo =  parseFloat( parseFloat(long.split('.'[1])));
        console.log(la + 'lat');
        console.log(lo + 'long');
        // this.updateMarker(la,lo);
        let coords = {...this.state.coord, latitude: la, longitude:lo};
        console.log(coords);
        this.setState({coords});
      }
    }
  }

  // updateMarker(la, lo){
  //   let markers = {...this.state.markers, coordinates:{latitude:la,longitude:lo}};
  //   let region = {...this.state.region, latitude:la, longitude:lo, 
  //                     latitudeDelta:0.01, longitudeDelta:0.01};
  //   this.setState({markers, region});
  // }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  
 
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate= {this.state.coordinate}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Text style={styles.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
            </Text>
          </TouchableOpacity>
        </View>
        <View >
             <Text> latitude : {this.state.coords.latitude} </Text> 
             <Text> longitude : {this.state.coords.longitude} </Text> 
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  }
});

export default AnimatedMarkers;
AppRegistry.registerComponent('sender', () => App);

// readsms(){
//   SmsAndroid.list(JSON.stringify(this.filter), (fail) => {
//             console.log("Failed with this error: " + fail)
//         },
//         (count, smsList) => {
//             console.log('Count: ', count);
//             console.log('List: ', smsList);

//             var arr = JSON.parse(smsList);
//             arr.forEach(function(object){
//                 console.log("Object id : " + object._id);
//                 console.log("Object phone number : " + object.address);
//                 console.log("Object date : " + object.date);
//                 console.log("object body : " + object.body);
//             })
//         });
//     }

  //Geocoder.init("AIzaSyBq8zPwbc-UF54RzKN7WKoX_BZn6pZ3EOU");
  // this.filter = {
  //     box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
  //     // the next 4 filters should NOT be used together, they are OR-ed so pick one
  //     read: 0, // 0 for unread SMS, 1 for SMS already read
  //     //_id: 762, // specify the msg id
  //     //address: '+989336812618', // sender's phone number
  //     //body: 'hello', // content to match
  //     // the next 2 filters can be used for pagination
  //     indexFrom: 0, // start from index 0
  //     maxCount: 10, // count of SMS to return each time
  // };

 