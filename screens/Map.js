import React from "react";
import {StyleSheet,
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  PermissionsAndroid, 
  Dimensions,
  Image,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline, Circle} from "react-native-maps";
import haversine from "haversine";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.01 
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const LATITUDE = 0; 
const LONGITUDE = 0;

const options = [
  { label: "satellite", value: "hybrid" },
  { label: "standard", value: "standard" },
];

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
      mapType: "standard",
    };
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  render() {
    return (
      <View style={styles.container}>  
          <MapView
              style={styles.map}
              mapType={this.state.mapType}
              loadingEnabled
              onRegionChangeComplete ={ (region) => {
                this.state.latitudeDelta = region.latitudeDelta
                this.state.longitudeDelta = region.longitudeDelta
                }}
              region={this.getMapRegion()}
            >
                <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor= {"red"}/>
                <Marker.Animated
                    ref={marker => {
                    this.marker = marker;
                    }}
                    coordinate= {this.state.coordinate}
                >
                  <Image style={styles.MarkerImage} source={require('../images/cartoon-marker-48.png')}/>
                </Marker.Animated>
            </MapView>
            <SwitchSelector
              style={{marginVertical : 20,
                marginHorizontal : 100}}
              options={options}
              initial={1}
              onPress={value => this.toggleSwitch(value)}
            />
            <Text> latitude : {this.state.coords.latitude} </Text> 
            <Text> longitude : {this.state.coords.longitude} </Text> 
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.bubble, styles.button]}>
                <Text style={styles.bottomBarContent}>
                {parseFloat(this.state.distanceTravelled).toFixed(2)} km
                </Text>
            </TouchableOpacity>
            </View>
          </View>
    );
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
        title: 'Map',
        headerStyle: {
          backgroundColor: '#16A085',
          barStyle: "light-content", // or directly
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <View style={{
            flexDirection: "row-reverse",
            }}>
            <Menu
                ref={(ref) => this._menu = ref}
                button={<TouchableOpacity onPress={() => this._menu.show()} 
                  style={{paddingHorizontal:16, height: '100%', alignItems:'center', 
                  justifyContent: 'center'}}>
                    <Icon name={'ios-menu'} size={25} color={'white'} 
                    style={{alignSelf:'center'}} resizeMode='contain'/></TouchableOpacity>}
            >
                <MenuItem onPress={() => {
                  this._menu.hide()
                  }} textStyle={{fontSize: 16}} disabled>Map</MenuItem>
                <MenuItem onPress={() => {
                  this._menu.hide()
                  navigation.navigate('Profile')
                  }} textStyle={{color: '#000', fontSize: 16}}>Setting</MenuItem>
                <MenuItem  onPress={() =>{
                  this._menu.hide()
                  navigation.navigate('database')
                  }} textStyle={{color: '#000',fontSize: 16}}>Database</MenuItem>
                <MenuItem onPress={() =>{
                  this._menu.hide()
                  navigation.navigate('Auth')
                  }}  textStyle={{color: '#000', fontSize: 16}}>Sign out</MenuItem>
            </Menu>
            <TouchableOpacity 
              style={{
                paddingHorizontal:8, 
                height: '100%', 
                alignItems:'center', 
                justifyContent: 'center',
               }}
              onPress={() => navigation.navigate('AddPerson')}
            >
              <Icon name={'ios-person-add'} size={24} color={'white'}
               style={{alignSelf:'center'}} resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        ),
      }
    }

  toggleSwitch = (value) => {
    this.setState({mapType: value})
 }

  async componentDidMount() {
    await requestPermission();
  
    const lat = Number(await AsyncStorage.getItem('latitude')); //get first location 
    const long = Number(await AsyncStorage.getItem('longitude'));
    let coords = {...this.state.coord, latitude: lat, longitude:long};
    this.setState({coords});
    let coordinate = {...this.state.coordinate, latitude: lat, longitude:long};
    this.setState({coordinate});
    this.setState({latitude: lat, longitude: long});  

    SmsListener.addListener(message => {
      this.parseMessage(message);
      this.animateMarker();
    });
  }

  animateMarker (){
    const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = this.state.coords;
        const newCoordinate = {
          latitude,
          longitude
        };

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
  }

  parseMessage(message){ 
    if(message.originatingAddress == '+989336812618'){
      const res = message.body.split(' ');
      if (res[0] == 'hello'){
        const long = res[1].split('long:')[1];
        const lat = res[2].split('lat:')[1];
        const la = parseFloat( parseFloat(lat.split('.'[1])));
        const lo =  parseFloat( parseFloat(long.split('.'[1])));
        let coords = {...this.state.coord, latitude: la, longitude:lo};
        this.setState({coords});
        AsyncStorage.setItem('latitude', JSON.stringify(la));
        AsyncStorage.setItem('longitude', JSON.stringify(lo));
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
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#16A085',
    tintColor: '#fff',
    height: 55,
  },
  footerTabStyle: {
    backgroundColor: '#16A085',
    tintColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
  },
  TitleStyle: {
    marginHorizontal: 15,
    alignItems: "center",
    color: 'white',
    justifyContent: "center",
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    
  },
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginHorizontal: 110,
    marginVertical: 20,
    backgroundColor: "transparent",
    flexDirection: "row-reverse",
    alignContent: "space-between",
  },
  MarkerImage: {
    width: 35,
    height: 45,
  },
  button1: { 
    width: 100,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#16A085',
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
    marginHorizontal: 7
  },
  btnView: {
    justifyContent: "flex-end",
     marginVertical: 20,
     justifyContent: "center",
     flexDirection: "row-reverse",
     alignContent: "space-between",
   },
   text: {
    color: 'rgba(255,255,255,255)',
    fontSize: 16,
    textAlign: "center"
  },
});


