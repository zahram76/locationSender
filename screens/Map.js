import React from "react";
import {
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  PermissionsAndroid, 
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import haversine from "haversine";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import SQLite from "react-native-sqlite-storage";
import {styles} from '../style.js'
import {MapTypeMenu} from './MapTypeMenu.js';
import {requestPermission} from './GetPermissions.js';

let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.01 
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const LATITUDE = 0; 
const LONGITUDE = 0;

var options = [
  { label: "standard", value: "standard" },
  { label: "satellite", value: "hybrid" },
  { label: "terrian", value: "terrian" },
];

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
      mapType : 'standard',
      TrackingUser: [],
    };
  }

  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };

  render() {
    return (
      <View style={{flex: 1}}> 
       
          <MapView
              style={{flex:1, height: '100%', width: '100%'}}
              mapType={this.state.mapType}
              onRegionChangeComplete ={ (region) => {
                this.state.latitudeDelta = region.latitudeDelta
                this.state.longitudeDelta = region.longitudeDelta
                }}
              region={this.getMapRegion()}>
                <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor= {"red"}/>
                <Marker.Animated
                    ref={marker => {
                    this.marker = marker;
                    }}
                    coordinate= {this.state.coordinate}>
                  <Image style={styles.MarkerImage} source={require('../images/cartoon-marker-48.png')}/>
                </Marker.Animated>
            </MapView>
            
            <View  style={{
                  position: 'absolute',//use absolute position to show button on top of the map
                  top: '3%', //for top align
                  left: '80%',
                  alignSelf: 'flex-start', //for align to right 
                  borderRadius: 20,
                  color: 'transparent', 
                }}>
              <MapTypeMenu onChange={mapType => this.setState({mapType})}></MapTypeMenu>
            </View>

            <View style={styles.BubbleContainer}>
              <TouchableOpacity style={styles.BubbleStyle}>
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
                    style={{alignSelf:'center', marginRight: 3,}} resizeMode='contain'/></TouchableOpacity>}
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
                  AsyncStorage.clear();
                  navigation.navigate('Auth')
                  }}  textStyle={{color: '#000', fontSize: 16}}>Sign out</MenuItem>
            </Menu>
            <TouchableOpacity 
              style={{
                paddingHorizontal:8, 
                height: '100%', 
                alignItems:'center', 
                justifyContent: 'center',
                marginRight: 3,
               }}
              onPress={() => navigation.navigate('AddPerson')}
            >
              <Icon name={'ios-person-add'} size={25} color={'white'}
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
    await this.readTrackingUsers();

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

    // var a = message.originatingAddress.split(' ')
    // var b = this.state.phone_no.split(' ')
    // var n = a[0].localeCompare(b[0]);
    if(message.originatingAddress == '+989336812618'){
      const res = message.body.split(' ');
      if (res[0] == 'hello' && res[1] == 'location'){
        const long = res[2].split('long:')[1];
        const lat = res[3].split('lat:')[1];
        const la = parseFloat( parseFloat(lat.split('.'[1])));
        const lo =  parseFloat( parseFloat(long.split('.'[1])));
        let coords = {...this.state.coord, latitude: la, longitude:lo};
        this.setState({coords});
        AsyncStorage.setItem('latitude', JSON.stringify(la));
        AsyncStorage.setItem('longitude', JSON.stringify(lo));
      }
    }
  }

  readTrackingUsers(){
    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      DB.transaction((tx) => {
        tx.executeSql('select phone_no, user_id from TrackingUsers', [], (tx, results) => {
          if(results.rows.length > 0){
            var i;
            for(i=0; i<results.rows.length; ++i){
              const TrackingUser = {
                user_id: results.rows.item(i)[0].toString(),
                phone_no: results.rows.item(i)[1].toString()
              };
              this.state.TrackingUser.push(TrackingUser);
            }
          } else { alert(' There are no users to track. ')}
        });});
  })  
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
