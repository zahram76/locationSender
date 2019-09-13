import React from "react";
import {View,Text,TouchableOpacity,Platform,Dimensions,Image} from "react-native";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from 'react-native-geolocation-service';
import SmsListener from 'react-native-android-sms-listener';
import Icon from "react-native-vector-icons/Ionicons";
import SQLite from "react-native-sqlite-storage";
import haversine from "haversine";
import {styles} from '../style.js'
import {MapTypeMenu} from './MapTypeMenu.js';
import {requestPermission} from './GetPermissions.js';
import {insertLocation} from './WriteLocation.js';
import { deleteUser } from "./deleteUser.js";
import AnimatingPolylineComponent from '../component/AnimatedPolyline.js';
import {CurrentLocationButton} from '../component/CurrentLocationButton';
import {FitAllMarker} from '../component/fitAllMarker';
import {MyLocation} from '../component/MyLocation.js';
import Callout from '../component/Callout.js';
var RNFS = require('react-native-fs');

const color = '#028687';
let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
var LATITUDE_DELTA = 0.09 
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const LATITUDE = 35.7006177
const LONGITUDE = 51.4013785
const DEFAULT_PADDING = { top: 40000, right: 40000, bottom: 40000, left: 40000 };

export default class Map  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Markers:[],
      yourMarkers: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      yourCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      region:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      youAreReady: false,
      coordinates: [],
      mapType : 'standard',
      markerImage: '',
      TrackingUser: [],
      isReady: false,
    };    
    this.lastLocations = []
    this.readTrackingUsers();
  }

  _menu = null;
//----------------------------------------------------------------------------------------------
  render() {    
    return (
      <View style={{flex: 1,}}> 
          <MapView
              ref={ref => {this.map = ref}}
              style={{flex:1, height: '100%', width: '100%'}}
              mapType={this.state.mapType}
              initialRegion={this.state.region}
              showsCompass={true}
              onRegionChangeComplete={r => {LATITUDE_DELTA=r.latitudeDelta; LONGITUDE_DELTA=r.longitudeDelta;}}>
              
              {this.state.Markers.map(poly => {
                if(this.state.isReady == true){
                  return(
                  <AnimatingPolylineComponent 
                    key={`poly_${poly.user_id}`}
                    id={`poly_${poly.user_id}`}
                    Direction={poly.routeCoordinates.reverse()} 
                    strokeColor={String(poly.color).split(' ')[0]}
                  />);
                  // return (
                  //   <Polyline key={`poly_${poly.user_id}`}
                  //     coordinates={poly.routeCoordinates} 
                  //     strokeWidth={6} strokeColor= {String(poly.color).split(' ')[0]} lineCap= {"square"} lineJoin= {"miter"}>
                  //   </Polyline> );
                  }})}

              
              {this.state.Markers.map(marker => {
                if(this.state.isReady == true){
                  return (
                    <Marker.Animated
                        ref={ref => {this.marker = ref}}
                        key={`marker_${marker.user_id}`}
                        tracksViewChanges={true}
                        coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude}}
                        calloutOffset={{ x: -8, y: 28 }}
                    >  
                    <View style={[styles.containerImageMarker]}>
                      <View style={styles.bubbleImageMarker}>
                        <View>
                          <Image style={{width: 50, height: 50, borderRadius: 50}}
                              source={{uri: marker.marker_image}}/>
                        </View>
                      </View>
                      <View style={styles.arrowBorder} />
                      <View style={styles.arrow} />
                    </View>

                      <MapView.Callout tooltip={true} style={styles.callout}>
                        <Callout
                          name={marker.name}
                          batteryLevel={marker.batteryLevel}
                          distanceTravelled={marker.distanceTravelled}
                        />
                      </MapView.Callout>                      
                    </Marker.Animated>);
                  }})}
                {this.state.youAreReady ?
                    <Marker.Animated
                        ref={ref => {this.marker1 = ref}}
                        key={`my_marker`}
                        coordinate={this.state.yourMarkers}
                    >
                      <Image style={{width: 50, height: 50}}
                        source={require('../images/marker2.png')}/>
                    </Marker.Animated> : null 
                  }
            </MapView>
            <View 
            style={{
              backgroundColor: '#ffffff',
              position: "absolute",
              shadowColor: '#ffffff', 
              elevation: 10,
              shadowOpacity: 5.0,}}></View>
            <View  style={styles.MapTypeMenuStyle}>
              <MapTypeMenu onChange={mapType => this.setState({mapType})}></MapTypeMenu>
            </View>

            <MyLocation cb ={() => {this.showCurrentLocation()}} />
            <FitAllMarker cb ={() => {this.goToMrker(800)}} />
            {/* <CurrentLocationButton cb ={() =>  {this.fitAllMarkers()}/>  */}

            
        </View>
    );
  }
 //----------------------------------------------------------------------------------------------
  showMyLocation(){
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    .then(data => {
      this.geolocationWatcher();  
    }).catch(err => {
      alert(err); });
  }
//----------------------------------------------------------------------------------------------
  fotTOsupliedMarker(){
    this.map.fitToSuppliedMarkers(['marker_0'],{edgePadding: DEFAULT_PADDING,
    animated: true,});
  }
//----------------------------------------------------------------------------------------------
  fitAllMarkers() {
    console.log('fit : '+JSON.stringify(this.state.coordinates))
    this.map.fitToCoordinates(this.state.coordinates, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }
//----------------------------------------------------------------------------------------------
  goToMrker(d){ // mire be ye region ke goftim
    const latitude = this.state.region.latitude;
    const longitude = this.state.region.longitude;
    const latitudeDelta = this.state.region.latitudeDelta;
    const longitudeDelta = this.state.region.longitudeDelta;
    console.log(latitudeDelta+' '+longitudeDelta)

    this.map.animateToRegion({
      latitude,longitude,latitudeDelta,longitudeDelta
    }, d);
    console.log(latitude+' '+longitude+' '+
      latitudeDelta+' '+longitudeDelta)
  }
//----------------------------------------------------------------------------------------------
  centerMap(d){ // mire be ye region ke goftim
    const latitude = this.state.region.latitude;
    const longitude = this.state.region.longitude;
    var latitudeDelta = LATITUDE_DELTA;
    var longitudeDelta = LONGITUDE_DELTA;
    console.log(JSON.stringify(this.state.region))

    this.map.animateToRegion({
      latitude,longitude,latitudeDelta,longitudeDelta
    }, d);
    console.log(latitude+' '+longitude+' '+
      latitudeDelta+' '+longitudeDelta)
  }
//----------------------------------------------------------------------------------------------
showCurrentLocation(){
  Geolocation.getCurrentPosition( position => {
    const latitudeDelta = this.state.region.latitudeDelta;
      const longitudeDelta = this.state.region.longitudeDelta;
      var latitude = parseFloat(position.coords.latitude);
      var longitude = parseFloat(position.coords.longitude);
      let marker = {...this.state.yourMarkers, yourCoordinates:{latitude:latitude,longitude:longitude}};
      this.setState({youAreReady: true});
      this.setState({yourMarkers: marker});
      this.map.animateToRegion({
        latitude,longitude,latitudeDelta,longitudeDelta
      }, 800);
      const newCoordinate = { latitude, longitude };
      if (Platform.OS === "android") {
        if (this.marker1) {
          this.marker1._component.animateMarkerToCoordinate(newCoordinate, 800);
        }
      } else { coordinate.timing(newCoordinate).start(); }
  })
}
//----------------------------------------------------------------------------------------------
geolocationWatcher(){
  this.watchID = Geolocation.watchPosition(
    position => {
      const latitudeDelta = this.state.region.latitudeDelta;
      const longitudeDelta = this.state.region.longitudeDelta;
      var latitude = parseFloat(position.coords.latitude);
      var longitude = parseFloat(position.coords.longitude);

      let marker = {...this.state.yourMarkers, yourCoordinates:{latitude:latitude,longitude:longitude}};
      this.setState({youAreReady: true});
      this.setState({yourMarkers: marker});
      
      const newCoordinate = { latitude, longitude };
      if (Platform.OS === "android") {
        if (this.marker1) {
          this.marker1._component.animateMarkerToCoordinate(newCoordinate, 2000);
        }
      } else { coordinate.timing(newCoordinate).start(); }

    },
    error => alert(error),
    {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000, distanceFilter: 0.1}
  );
}
//----------------------------------------------------------------------------------------------
initSetting(){
  console.log(' map for init setting');
  SQLite.openDatabase(
    {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('select value from Settings where setting_name=?', ['mapType'], (tx, results) => {
              console.log('map Results', results.rows.length);
              if (results.rows.length > 0) {
                this.setState({mapType: results.rows.item(0).value})
                console.log('map inti setting : ' + this.state.mapType)
              } else { console.log('can not find map type setting ') }
        });
    });
  });
}
//----------------------------------------------------------------------------------------------
  componentDidMount() {
    this.createDir()
    SmsListener.addListener(message => this.parseMessage(message));
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log(' navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        this.afterNavigation()
      //   var phone_no;
      //   var addRemove;
      //   var flag;
      //   JSON.parse(str, (key,value) => {
      //     if(key == 'refresh' && value != ''){
      //       phone_no = value;
      //       flag = true;
      //       console.log('in component did mount in map phone no is : ', value)
      //     } else if(key == 'addRemove' && value != ''){
      //       addRemove = value
      //     }
      //     if(flag)
      //       this.afterNavigation(phone_no, addRemove)
      //     console.log(value);
      //   })  
       } else { console.log( ' is nul ')}
    });

    requestPermission();   
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    .then(data => {
      this.geolocationWatcher();  
    }).catch(err => {
      alert(err); });
 }
//----------------------------------------------------------------------------------------------
 componentWillUnmount(){
   // Remove the event listener before removing the screen from the stack
   this.focusListener.remove();
 }
 //----------------------------------------------------------------------------------------------
  animateMarker (index){
    console.log(' in animated marker for index = ' + index);
    const routeCoordinates = this.state.Markers[index].routeCoordinates;
    const distanceTravelled = this.state.Markers[index].distanceTravelled;
    const { latitude, longitude } = this.state.coordinates[index];
    const newCoordinate = { latitude, longitude };

    if (Platform.OS === "android") {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 2000);
      }
    } else { coordinate.timing(newCoordinate).start(); }

    let a = [...this.state.Markers]; //creates the clone of the state
    a[index] = {latitude, longitude,
                routeCoordinates: routeCoordinates.concat([newCoordinate]),
                distanceTravelled:
                  distanceTravelled + this.calcDistance(newCoordinate, index),
                prevLatLng: newCoordinate,
                color: a[index].color,
                user_id: a[index].user_id,
                user_image: a[index].user_image,
                name: a[index].name,
                marker_image: a[index].marker_image,
                batteryLevel: a[index].batteryLevel};
    this.setState({Markers: a});
    console.log(' in animated marker , distaceTraveled ', this.state.Markers[index].distanceTravelled)
  }
//----------------------------------------------------------------------------------------------
  parseMessage(message){ 
    const index = this.state.TrackingUser.findIndex(
      data => data.phone_no.split(' '[0]) == message.originatingAddress.split(' ')[0]
    );
    console.log(' in parse message ',index , this.state.TrackingUser[index].phone_no, message.originatingAddress)
    if(index != -1)
    {
      console.log(' receive message from ' + this.state.TrackingUser[index].phone_no + ' with user_id = ' + index);
      const res = message.body.split(' ');
        if (res[0] == 'hello' && res[1] == 'location')
        {
          const long = res[2].split('long:')[1];
          const lat = res[3].split('lat:')[1];
          const batteryLevel = res[4].split('battery:')[1];
          const la = parseFloat( parseFloat(lat.split('.'[1])));
          const lo = parseFloat( parseFloat(long.split('.'[1])));
          let coords = {latitude: la, longitude: lo};
          console.log('meghdar dehi region shod 1')

          this.setState({region: {latitude: la, longitude: lo, 
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
          }})
          console.log('meghdar dehi region shod 2')

          this.centerMap(100)
          console.log('meghdar dehi region shod 3')
          var a = [...this.state.coordinates];
          console.log(a)
          this.lastLocations[index].latitude = a[index].latitude
          this.lastLocations[index].longitude = a[index].longitude
          console.log(' last location ', JSON.stringify(this.lastLocations))
          a[index] = coords;
          console.log('meghdar dehi region shod 4')
          this.setState({coordinates : a});

          var b = [...this.state.Markers];
          b[index].batteryLevel = batteryLevel;
          this.setState({Markers: b})

          console.log('meghdar dehi region shod 5')
          var user_id = this.state.TrackingUser[index].user_id;
          insertLocation(user_id, la, lo, this.lastLocations[index].latitude, this.lastLocations[index].longitude);
          this.animateMarker(index);
        }
      }
      console.log(' end of parse message ' + message.originatingAddress);
  }
//----------------------------------------------------------------------------------------------
  afterNavigation(){
    this.initSetting();
    this.AddNewUserToMap();
    this.RemoveDeletedUserFromMap();
    this.updateTrackingUsers();
  }
//----------------------------------------------------------------------------------------------
  calcDistance = (newLatLng, index) => {
    const prevLatLng = this.state.Markers[index].prevLatLng;
    console.log('in calc distance , newlatlang, index, prev latlang ',JSON.stringify(newLatLng), index, JSON.stringify(prevLatLng))
    return haversine(prevLatLng, newLatLng) || 0;
  };  
//----------------------------------------------------------------------------------------------
  static navigationOptions = ({ navigation }) => {
    return {
        title: 'Map',
        headerStyle: {
          backgroundColor: color,
          barStyle: "light-content", // or directly
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <View style={{flexDirection: "row-reverse"}}>
            <Menu
                ref={(ref) => this._menu = ref}
                button={<TouchableOpacity onPress={() => this._menu.show()} 
                  style={{paddingHorizontal:16, height: '100%', alignItems:'center', 
                  justifyContent: 'center'}}>
                    <Icon name={'ios-menu'} size={25} color={'white'} 
                    style={{alignSelf:'center', marginRight: 3,}} resizeMode='contain'/></TouchableOpacity>}>
                <MenuItem onPress={() => {
                  this._menu.hide()
                  }} textStyle={{fontSize: 16}} disabled>Map</MenuItem>
                <MenuItem onPress={() => {
                  this._menu.hide()
                  navigation.navigate('Profile')
                  }} textStyle={{color: '#000', fontSize: 16}}>Setting</MenuItem>
                <MenuItem  onPress={() =>{
                  this._menu.hide()
                  navigation.navigate('FlatListComponent')
                  }} textStyle={{color: '#000',fontSize: 16}}>flat list</MenuItem>
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
              onPress={() => navigation.navigate('AddPerson')}>
              <Icon name={'ios-person-add'} size={25} color={'white'}
               style={{alignSelf:'center'}} resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        ),
      }
    }
//----------------------------------------------------------------------------------------------
createDir(){
    RNFS.mkdir(RNFS.DocumentDirectoryPath+'/images').then( result => {
      console.log('GOT RESULT mkdir ', result);
    }).then(contents => {
      console.log('contents mkdir'+ contents);
    }) .catch((err) => {
      console.log('contents error mkdir' + err.message, err.code);
    });
  }
//----------------------------------------------------------------------------------------------
readTrackingUsers(){
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      tx.executeSql('select t.user_id, phone_no, marker_color, loc_id, latitude, longitude, marker_image, user_image, first_name, last_name from TrackingUsers as t left join (select l.user_id, loc_id, latitude, longitude from Locations as l join (select user_id, max(loc_id) as loc from Locations group by user_id ) as m on l.loc_id = m.loc ) as ml on t.user_id = ml.user_id', [], (tx, results) => {
        if(results.rows.length > 0){
          console.log(' reading tracking users please wait :) ' + results.rows.length ); 

           for(let i=0; i<results.rows.length; ++i){
              console.log(JSON.stringify(results.rows.item(i))+'\n');
                const TrackingUser = {
                  user_id: results.rows.item(i).user_id,
                  phone_no: results.rows.item(i).phone_no.split(' ')[0].toString(),
                  marker_color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                  //index: i,
                };
                this.state.TrackingUser.push(TrackingUser);

                var a = this.state.Markers;
                console.log(' marker color = ' + results.rows.item(i).marker_color.split(' ')[0].toString())
                console.log(' initialize Markers for user with index = ' + i);

                var user_image, marker_image, latitude, longitude;
                JSON.parse(results.rows.item(i).user_image, (key,value) =>{
                  if(key == 'uri')
                    user_image = value
                })
                JSON.parse(results.rows.item(i).marker_image, (key,value) =>{
                  if(key == 'uri')
                    marker_image = value
                })
                latitude =  parseFloat(results.rows.item(i).latitude==null ? LATITUDE :  results.rows.item(i).latitude)
                longitude = parseFloat(results.rows.item(i).longitude==null ? LONGITUDE :  results.rows.item(i).longitude)
                console.log('in init map , user image',user_image)
                this.state.Markers.push({
                  latitude: latitude,
                  longitude: longitude,
                  routeCoordinates: [],
                  distanceTravelled: 0,
                  prevLatLng: {},
                  coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta : LATITUDE_DELTA,
                    longitudeDelta : LONGITUDE_DELTA, 
                  }),
                  color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                  //index: i,
                  user_id: results.rows.item(i).user_id,
                  image: user_image,
                  name : results.rows.item(i).first_name +' '+results.rows.item(i).last_name,
                  marker_image: marker_image,
                  batteryLevel: 0.8
                });
                console.log(' Markers color = ' + this.state.Markers[i].marker_image);
                this.state.coordinates.push({
                  latitude: latitude, 
                  longitude: longitude});
                this.setState({region: {latitude: latitude, longitude: longitude, 
                  latitudeDelta: this.state.region.latitudeDelta,
                  longitudeDelta: this.state.region.longitudeDelta,
                }})
                this.centerMap(100)
                this.lastLocations = [...this.state.coordinates]
              }
              this.setState({isReady:true});
        } else { console.log(' There are no users to track. ')}
      });
    });
  });
}     
//----------------------------------------------------------------------------------------------
updateTrackingUsers(){
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      tx.executeSql('select user_id, phone_no, marker_color, marker_image, user_image, first_name, last_name from TrackingUsers ', [], (tx, results) => {
        if(results.rows.length > 0){
          console.log(' reading tracking users please wait :) in update user' + results.rows.length ); 

           for(let i=0; i<results.rows.length; ++i){
              console.log(JSON.stringify(results.rows.item(i))+'\n');

              const index = this.state.TrackingUser.findIndex(
                data => data.user_id == results.rows.item(i).user_id
              );

              var a = [...this.state.TrackingUser]
              a[index].marker_color =  results.rows.item(i).marker_color.split(' ')[0].toString()
              this.setState({TrackingUser: a})
               
                console.log(' marker color = ' + results.rows.item(i).marker_color.split(' ')[0].toString())
                console.log(' initialize Markers for user with index = ' + i);

                var b = this.state.Markers;
                var user_image, marker_image;
                JSON.parse(results.rows.item(i).user_image, (key,value) =>{
                  if(key == 'uri')
                    user_image = value
                })
                JSON.parse(results.rows.item(i).marker_image, (key,value) =>{
                  if(key == 'uri')
                    marker_image = value
                })
                console.log('in init map , user image',user_image)
                b[index].color = results.rows.item(i).marker_color.split(' ')[0].toString()
                b[index].name = results.rows.item(i).first_name +' '+results.rows.item(i).last_name
                b[index].user_image = user_image
                b[index].marker_image = marker_image,
               // b[index].batteryLevel = results.rows.item(i).batteryLevel.split(' ')[0].toString(),
                this.setState({Markers : b})
                console.log(' Markers color = ' + this.state.Markers[i].color);
              }
              this.setState({isReady:true});
        } else { console.log(' There are no users to track. ')}
      });
    });
  });
}     
//----------------------------------------------------------------------------------------------
AddNewUserToMap(){
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      tx.executeSql('select user_id, phone_no, marker_color, marker_image, user_image, first_name, last_name from TrackingUsers', [], (tx, results) => {
        if(results.rows.length > 0){
          console.log(' reading tracking users please wait :)  in add new user ' + results.rows.length ); 

           for(let i=0; i<results.rows.length; ++i){
              console.log(JSON.stringify(results.rows.item(i))+'\n');
              const index = this.state.TrackingUser.findIndex(
                data => data.user_id == results.rows.item(i).user_id
              );
              if(index == -1){
                const TrackingUser = {
                  user_id: results.rows.item(i).user_id,
                  phone_no: results.rows.item(i).phone_no.split(' ')[0].toString(),
                  marker_color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                 // index: i,
                };
                this.state.TrackingUser.push(TrackingUser);

                console.log(' marker color = ' + results.rows.item(i).marker_color.split(' ')[0].toString())
                console.log(' initialize Markers for user with index = ' + i);

                var user_image, marker_image;
                JSON.parse(results.rows.item(i).user_image, (key,value) =>{
                  if(key == 'uri')
                    user_image = value
                })
                JSON.parse(results.rows.item(i).marker_image, (key,value) =>{
                  if(key == 'uri')
                    marker_image = value
                })
                console.log('in init map , user image',user_image)
                this.state.Markers.push({
                  latitude: LATITUDE,
                  longitude: LONGITUDE,
                  routeCoordinates: [],
                  distanceTravelled: 0,
                  prevLatLng: {},
                  coordinate: new AnimatedRegion({
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    latitudeDelta : LATITUDE_DELTA,
                    longitudeDelta : LONGITUDE_DELTA, 
                  }),
                  color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                  //index: i,
                  user_id: results.rows.item(i).user_id,
                  image: user_image,
                  name : results.rows.item(i).first_name +' '+results.rows.item(i).last_name,
                  marker_image: marker_image,
                  batteryLevel: 0.8
                });
                console.log(' Markers color = ' + this.state.Markers[i].color);
                this.state.coordinates.push({latitude: LATITUDE, longitude: LONGITUDE});
                this.lastLocations = [...this.state.coordinates]
              } else { console.log(' in add new user to map index is ', index)}
              this.setState({isReady:true});
           }
        } else { console.log(' There are  no users to track. ')}
      });
    });
  });
}
//----------------------------------------------------------------------------------------------
RemoveDeletedUserFromMap(){
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      tx.executeSql('select user_id, phone_no, marker_color, marker_image, user_image, first_name, last_name from TrackingUsers', [], (tx, results) => {
        if(results.rows.length > 0){
          console.log(' reading tracking users please wait :) in remove user' , 
            results.rows.length, JSON.stringify(results.rows) ); 

          var resultsCopy = results.rows
          for(let i=0; i<this.state.TrackingUser.length; ++i){
            const index = resultsCopy.findIndex(
              data => data.user_id == resultsCopy.user_id
            );
            if(index == -1) // if a user is in tracking user array but not in database // removed
            {
              console.log(' in remove user form map , index', index)
              var a = this.state.TrackingUser.slice(0,i).concat(this.state.TrackingUser.slice(i+1))
              this.setState({TrackingUser: a})
              console.log(' in remove user form map after init tracking user , i', i)
              var b = this.state.Markers.slice(0,i).concat(this.state.Markers.slice(i+1))
              this.setState({Markers: b})
              console.log(' in remove user form map after init marker, i', i)
              var c = this.state.coordinates.slice(0,i).concat(this.state.coordinates.slice(i+1))
              this.setState({coordinates: c})
              console.log(' in remove user form map after init coordinates, i', i)
              this.lastLocations = [...this.state.coordinates]
            }
          }
            this.setState({isReady:true});
        } else { console.log(' There are no users to track. ')}
      });
    });
  });
}
}