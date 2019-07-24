import React from "react";
import {StyleSheet,
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  PermissionsAndroid, 
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  Button} from "react-native";
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import haversine from "haversine";
//import styles from './style.js';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const LATITUDE = 0; //326651473;
const LONGITUDE = 0;// 51.7088392;

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

export default class Map  extends React.Component {
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
        latitudeDelta: 0.0,
        longitudeDelta: 0.0
      }),
      coords: {
        latitude : LATITUDE,
        longitude : LONGITUDE
      },
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
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
    }); // vaghti sms biad mire to in rabe
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
    latitudeDelta: this.state.latitudeDelta,
    longitudeDelta: this.state.longitudeDelta
  });

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  changeRegion= () =>{
     this.setState({coordinate : {latitude: this.coordinate.latitude, longitude: this.coordinate.longitude,
      latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta}})
  }

  render() {
    return (
        <View style={styles.container}>
            <MapView
            style={styles.map}
            mapType={"standard"} //{"hybrid"} khuneh ha ro neshun mide
            loadingEnabled
            //SenableZoomControl={true}
            onRegionChange={region => 
              { 
                this.setState.latitudeDelta = region.latitudeDelta
                this.setState.longitudeDelta = region.longitudeDelta
              }}
            region={this.getMapRegion()}
            >
                <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
                <Marker.Animated
                    ref={marker => {
                    this.marker = marker;
                    }}
                    coordinate= {this.state.coordinate}
                >
                  <Image style={styles.MarkerImage} source={require('../images/cartoon-marker-48.png')}/>
                </Marker.Animated>
            </MapView>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.bubble, styles.button]}
                onPress={()=> this.props.navigation.navigate('Profile')}>
                <Text style={styles.bottomBarContent}>
                {parseFloat(this.state.distanceTravelled).toFixed(2)} km
                </Text>
            </TouchableOpacity>
            </View>
            <View>
                <Text> latitude : {this.state.coords.latitude} </Text> 
                <Text> longitude : {this.state.coords.longitude} </Text>
                <Text> latitudeDelta : {this.state.latitudeDelta}</Text>
                <Text> lonitudeDelta : {this.state.longitudeDelta}</Text> 
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
  },
  MarkerImage: {
    width: 35,
    height: 45,
  }
});
