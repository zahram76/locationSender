import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View, String} from 'react-native';
import { Button , DeviceEventEmitter} from 'react-native';
import SmsAndroid  from 'react-native-get-sms-android';
import SmsListener from 'react-native-android-sms-listener';
//import {AsyncStorage} from 'react-native-community';
import {PermissionsAndroid} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
//import Geocoder from 'react-native-geocoding';

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

const Header = (props) => {
  // alert('Hi welcome!');
    return (
      <Text style={styles.welcome} >{props.title}</Text>
    );
};

//type props = {};
export default class App extends Component {//<props> {

constructor() {
  super();
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
    latitude: null,
    longitute: null,
    timestamp: null,
  }
  //this.address = Geocoder.from([32.699489,51.733532]);
}

async componentDidMount() {
    await requestPermission();
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     this.setState({ 
    //       latitude: position.coords.latitude ,
    //       longitute: position.coords.longitude,
    //       timestamp:  position.timestamp
    //     })
    //   },
    //   (error) => { console.log(error); },
    //   { enableHighAccuracy: true, timeout: 30000 }
    // )

    DeviceEventEmitter.addListener('sms_onDelivery', (msg) => {
      console.log(msg);
    }); // vaghti sms tahvil dade shod mige

    SmsListener.addListener(message => {
      //console.log(message.originatingAddress);
      this.showmassage(message);
    }); // vaghti sms biad mige 
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

//   sendsms(){
//     phoneNumber = '+989336812618';
//     message = 'hello long:51.713584 lat:32.656005';
//     SmsAndroid.autoSend(phoneNumber, message, (fail) => {
//         console.log("Failed with this error: " + fail)
//     }, (success) => {
//         console.log("SMS sent successfully" + success);
//     });
//   }

updateMarker(la, lo){
  let markers = {...this.state.markers, coordinates:{latitude:la,longitude:lo}};
  let region = {...this.state.region, latitude:la, longitude:lo, 
                    latitudeDelta:0.01, longitudeDelta:0.01};
  this.setState({markers, region});
  //console.log([markers, region]);
  //console.log(this.state);
 }

 
  render() {
    return (
        <View style={styles.container}>
          <MapView style={styles.map} region={this.state.region}>
            <Marker coordinate={this.state.markers.coordinates}/>
          </MapView>
          <View style={styles.box}>
            <Text style={styles.welcome}> latitude : {this.state.markers.coordinates.latitude} </Text> 
            <Text style={styles.welcome}> longitude : {this.state.markers.coordinates.longitude} </Text> 
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

 const a = new App();
 //a.sendsms();

AppRegistry.registerComponent('sender', () => App);