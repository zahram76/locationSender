import React from "react";
import {StyleSheet,
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  PermissionsAndroid, 
  AppRegistry, 
  ImageBackground,
  Dimensions,
  TextInput} from "react-native";
import SmsAndroid  from 'react-native-get-sms-android';
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import haversine from "haversine";
import Login from './login.js';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const LATITUDE = 0;
const LONGITUDE = 0;
//
const {width : WIDTH} = Dimensions.get('window'); 

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
        let coords = {...this.state.coord, latitude: la, longitude:lo};
        console.log(coords);
        this.setState({coords});
      }
    }
  }

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
      <ImageBackground source={require('./images/background.png')} style={styles.backcontainer}>
        <View>
          <TextInput 
            style={styles.input}
            placeholder={'username'}
            placeholderTextColor={'rgba(255,255,255,255)'}
            underlineColorAndroid='transparent'
            >
          </TextInput>
          <TextInput 
            style={styles.input}
            placeholder={'password'}
            placeholderTextColor={'rgba(255,255,255,255)'}
            underlineColorAndroid='transparent'
            >
          </TextInput>
        </View>
      </ImageBackground>
    );
  }
}

/* <View style={styles.container}>
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
      </View>*/
const styles = StyleSheet.create({
  backcontainer:{
    flex: 1,
        alignItems: "center",
        width: null,
        height: null,
        justifyContent: "center",
        backgroundColor: '#ffffff',
  },
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
  },
  input:{
    width: WIDTH-55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: 'rgba(0,0,0,0.25)',
    color: 'rgba(255,255,255,255)',
    marginBottom: 7,
    marginHorizontal: 25
  }
});

export default AnimatedMarkers;
AppRegistry.registerComponent('sender', () => App);
