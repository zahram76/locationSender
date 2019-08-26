import React from "react";
import {View,Text,TouchableOpacity,Platform,Dimensions,Image} from "react-native";
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
import {insertLocation} from './WriteLocation.js';

let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.01 
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const LATITUDE = 0; 
const LONGITUDE = 0;

export default class Map  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Markers:[{
        latitude: 0,
        longitude: 0,
        routeCoordinates: [],
        distanceTravelled: 0,
        prevLatLng: {},
        coordinate: new AnimatedRegion({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009
        }),
        color: '', 
      }],
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      coordinates: [{
        latitude : 0,
        longitude : 0
      }],
      mapType : 'standard',
      TrackingUser: [],
      isReady: false,
    };    
  }

  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };

  render() {    
    return (
      <View style={{flex: 1}}> 
      {this.props.navigation.getParam('refresh', false) ? this.readTrackingUsers() : null }
          <MapView
              style={{flex:1, height: '100%', width: '100%'}}
              mapType={this.state.mapType}
              region={this.state.region} 
              onRegionChangeComplete ={ (region) => this.setState({ region})}>
              
              {this.state.Markers.map(poly => {
                if(this.state.isReady == true){
                  return (
                    <Polyline coordinates={poly.routeCoordinates} 
                      key={poly}
                      strokeWidth={5} strokeColor= {String(poly.color)} lineCap= {"square"} lineJoin= {"miter"}>
                    </Polyline> );
                  }})
               }

              {this.state.Markers.map(marker => {
                if(this.state.isReady == true){
                  return (
                    <Marker.Animated
                      key={marker}
                      ref={marker => {
                      this.marker = marker;
                      }}
                        coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude}}
                        pinColor={marker.color}
                        title={marker.title}
                    > 
                    </Marker.Animated> );
                  }})}
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

        </View>
    );
  }
  
   componentDidMount() {
     requestPermission();
     this.readTrackingUsers();
     
    SmsListener.addListener(message => {
      this.parseMessage(message);
     // this.animateMarker();
    });
  }

  animateMarker (index){
    console.log(' in animated marker for index = ' + index);
    const routeCoordinates = this.state.Markers[index].routeCoordinates;
    const distanceTravelled = this.state.Markers[index].distanceTravelled;
    const { latitude, longitude } = this.state.coordinates[index];
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

    let a = this.state.Markers; //creates the clone of the state
    a[index] = {latitude,
                longitude,
                routeCoordinates: routeCoordinates.concat([newCoordinate]),
                distanceTravelled:
                  distanceTravelled, //+ this.calcDistance(newCoordinate, index),
                prevLatLng: newCoordinate};
    this.setState({Markers: a});
  }

  parseMessage(message){ 
    const len = this.state.TrackingUser.length;
    var i;
    var index;
    for(i=0; i<len; ++i){
      var userPhoneNo = this.state.TrackingUser[i].phone_no.split(' '[0]);
      var messagePhoneNo = message.originatingAddress.split(' ')[0];
      var n = messagePhoneNo.localeCompare(userPhoneNo);
      if(n == 0){
        index = this.state.TrackingUser[i].index;
        console.log(' receive message from ' + userPhoneNo + ' with index = ' + index);
        const res = message.body.split(' ');
        if (res[0] == 'hello' && res[1] == 'location'){
          const long = res[2].split('long:')[1];
          const lat = res[3].split('lat:')[1];
          const la = parseFloat( parseFloat(lat.split('.'[1])));
          const lo =  parseFloat( parseFloat(long.split('.'[1])));

          let coords = {latitude: la, longitude: lo};
          let a = this.state.coordinates;
          a[index] = coords;
          this.setState({coordinates : a});
          var user_id = this.state.TrackingUser[index].user_id;
          insertLocation(user_id, la, lo);
          this.animateMarker(index);
        }
      }
    }
    console.log(' end of parse message ' + message.originatingAddress);
  }

  readTrackingUsers(){
   // this.props.navigation.setParams({refresh : "false"});
    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      DB.transaction((tx) => {
        tx.executeSql('select  user_id, phone_no, marker_color from TrackingUsers', [], (tx, results) => {
          if(results.rows.length > 0){
            var i;
            console.log(' reading tracking users please wait :)');

            var isRepeat = false;
            for(i=0; i<results.rows.length; ++i){
                for(j=0; j<this.state.TrackingUser.length; ++j){
                  if(this.state.TrackingUser[J].user_id == results.rows.item(i).user_id.toString()){
                    isRepeat = true;
                  }
                }
                if(isRepeat != true){
                  console.log('not repeated')
                  const TrackingUser = {
                    user_id: results.rows.item(i).user_id.toString(),
                    phone_no: results.rows.item(i).phone_no.toString(),
                    marker_color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                    index: i,
                  };
                  this.state.TrackingUser.push(TrackingUser);

                  var a=[];
                  console.log(' marker color = ' + results.rows.item(i).marker_color.split(' ')[0].toString())
                  console.log(' initialize Markers for user with index = ' + i);
                  console.log(' Markers color = ' + this.state.Markers[i].color);
                  a.push({
                    latitude: 0,
                    longitude: 0,
                    routeCoordinates: [],
                    distanceTravelled: 0,
                    prevLatLng: {},
                    coordinate: new AnimatedRegion({
                      latitude: 0,
                      longitude: 0,
                      latitudeDelta : 0.01,
                      longitudeDelta : 0.01, 
                    }),
                    color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                  });
                  this.setState({Markers : a});
                  console.log(' Markers color = ' + this.state.Markers[i].color);
                  isRepeat = false;
                }

                this.setState({isReady:true});
            }
          } else { alert(' There are no users to track. ')}
        });
      });
      
    //     var k=0;
    //     for(k=0; k<this.state.TrackingUser.length; ++k){
    //       console.log(' init locations ');
    //       var user_id = this.state.TrackingUser[k].user_id;
    //       var color = this.state.TrackingUser[k].marker_color;
    //       var index = k;
    //       var lat=0,long=0;
    //       DB.executeSql('select user_id,latitude,longitude from Locations where user_id=? order by loc_id ASC', 
    //         [user_id], 
    //         (tx, results) => {
    //           const len = results.rows.length;
    //           if(len > 0){
    //             lat = results.rows.item(len-1).latitude.toString();
    //             long = results.rows.item(len-1).longitude.toString();
    //             console.log(' lat : '+lat+' long: '+long+' user_id: '+user_id);
    //           }});
              
          // console.log(' marker color = ' + results.rows.item(i).marker_color.split(' ')[0].toString())
          // console.log(' initialize Markers for user with index = ' + i);
          // console.log(' Markers color = ' + this.state.Markers[i].color);
          // a.push({
          //   latitude: lat,
          //   longitude: long,
          //   routeCoordinates: [],
          //   distanceTravelled: 0,
          //   prevLatLng: {},
          //   coordinate: new AnimatedRegion({
          //     latitude: lat,
          //     longitude: long,
          //     latitudeDelta : 0.01,
          //     longitudeDelta : 0.01, 
          //   }),
          //   color: color,
          // });
          // this.setState({Markers : a});
      
    //       b = this.state.coordinates;
    //       b[index] = {
    //         latitude: lat,
    //         longitude: long,
    //       };
    //       this.setState({coordinates : b});
    //       console.log(' Markers color = ' + this.state.Markers[i].color);
    //   }
      });
    
}     

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: this.state.latitudeDelta,
    longitudeDelta: this.state.longitudeDelta
  });

  calcDistance = (newLatLng, index) => {
    const { prevLatLng } = this.state.Markers[index].prevLatLng;
    return haversine(prevLatLng, newLatLng) || 0;
  };  

  callRefresh(){
    alert('yes');
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
              onPress={() => {
                navigation.navigate('AddPerson')
                //var r=navigation.getParam('refresh', false); 
                //alert(r)
                }             
              }
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
}
