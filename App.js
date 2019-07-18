import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import { Button , DeviceEventEmitter} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid  from 'react-native-get-sms-android';
import {PermissionsAndroid} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const {width,height} = Dimensions.get('window')
const SCREAN_HEIGHT =  height;
const SCREAN_WIDTH = width;
const ASPECT_RATIO = width/height;
const LATITIUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LONGITUDE_DELTA * ASPECT_RATIO;

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
}

export default class App extends Component {

constructor() {
  super();

  this.state = {
    markers: {
      coordinates: {
        latitude: 32.665509,
        longitude: 51.709533
      }
    },
    region : {
      latitude: 32.665509,
      longitude: 51.709533,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
      },
    initialPosition: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0
    },
    markerPosition: {
      latitude: 0,
      longitude: 0
    }
  }
}

watchID = null;

async componentDidMount() {
    await requestPermission();
    console.log('0');

    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);

      console.log('1');
      console.log(lat);
      console.log(long);

      var initialRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITIUDE_DELTA
      }
      this.setState({initialPosition : initialRegion})
      this.setState({markerPosition: initialRegion})
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy : true, timeout : 20000, muximumAge : 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);

      console.log('2');
      console.log(lat);
      console.log(long);

      var lastRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITIUDE_DELTA
      }
      this.setState({initialPosition : lastRegion})
      this.setState({markerPosition: lastRegion})
      }
    );
    
  DeviceEventEmitter.addListener('sms_onDelivery', (msg) => {
    console.log(msg);
  }); // vaghti sms tahvil dade shod mige

  SmsListener.addListener(message => {
    //console.log(message.originatingAddress);
    this.showmassage(message);
  }); // vaghti sms biad mige 
}

componentWillUnmount(){
  navigator.geolocation.clearWatch(this.watchID);
}

showmassage(message){
  //console.info(message);
  if(message.originatingAddress == '+989336812618'){
    const res = message.body.split(' ');
    //console.log(res);
    if (res[0] == 'hello'){
      const long = res[1].split('long:')[1];
      const lat = res[2].split('lat:')[1];
      const la = parseFloat( parseFloat(lat.split('.'[1])));
      const lo =  parseFloat( parseFloat(long.split('.'[1])));
      console.log(la + 'lat');
      console.log(lo + 'long');
      this.updateMarker(la,lo);
    }
  }
}

  sendsms(){
    phoneNumber = '+989336812618';
    message = 'hello long:51.713584 lat:32.656005';
    SmsAndroid.autoSend(phoneNumber, message, (fail) => {
        console.log("Failed with this error: " + fail)
    }, (success) => {
        console.log("SMS sent successfully" + success);
    });
  }

updateMarker(la, lo){
  let markers = {...this.state.markers, coordinates:{latitude:la,longitude:lo}};
  let region = {...this.state.region, latitude:la, longitude:lo, 
                    latitudeDelta:0.01, longitudeDelta:0.01};
  this.setState({markers, region});
 }

//  <View style={styles.container}>
//           <MapView style={styles.map} region={this.state.region}>
//             <Marker coordinate={this.state.markers.coordinates}/>
//           </MapView>
//           <View style={styles.box}>
//             <Text style={styles.welcome}> latitude : {this.state.latitude} </Text> 
//             <Text style={styles.welcome}> longitude : {this.state.longitude} </Text> 
//           </View> 
//         </View>

  render() {
    return (
      <View style={styles.container}>
      <MapView style={styles.map} region={this.state.initialPosition}>
        <Marker coordinate={this.state.markerPosition}/>
      </MapView>
      <View style={styles.box}>
        <Text style={styles.welcome}> latitude : {this.state.markerPosition.latitude} </Text> 
        <Text style={styles.welcome}> longitude : {this.state.markerPosition.longitude} </Text> 
      </View> 
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
    flex: 0.2,
    width: '100%',
    height: '100%'
  },
  welcome: {
    fontSize: 20,
    color: 'blue',
    textAlign: 'center',
    margin: 10,
    marginBottom: 10,
  },
  map: {
    flex: 0.8,
    width: '100%',
    height: '100%',
  }
});

AppRegistry.registerComponent('sender', () => App);