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
import {CurrentLocationButton} from '../component/CurrentLocationButton';
import {FitAllMarker} from '../component/fitAllMarker';
import {MyLocation} from '../component/MyLocation.js';

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
      TrackingUser: [],
      isReady: false,
    };    
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
                  return (
                    <Polyline key={`poly_${poly.index}`}
                      coordinates={poly.routeCoordinates} 
                      strokeWidth={5} strokeColor= {String(poly.color).split(' ')[0]} lineCap= {"square"} lineJoin= {"miter"}>
                    </Polyline> );
                  }})}

              {this.state.Markers.map(marker => {
                if(this.state.isReady == true){
                  return (
                    <Marker.Animated
                        ref={ref => {this.marker = ref}}
                        key={`marker_${marker.index}`}
                        tracksViewChanges={true}
                        coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude}}
                       // pinColor={String(marker.color).split(' ')[0]}
                        title={marker.title}
                    >
                      <View >
                        <Text>{marker.index}</Text>
                        <Image style={{width: 50, height: 50}}
                          source={require('../images/marker1.png')}/>
                      </View>
                      
                    </Marker.Animated>);
                  }})}
                {this.state.youAreReady ?
                    <Marker.Animated
                        ref={ref => {this.marker1 = ref}}
                        key={`my_marker`}
                        tracksViewChanges={true}
                        coordinate={this.state.yourMarkers}
                        title={'your marker'}
                    >
                      <View >
                        <Text>your marker</Text>
                        <Image style={{width: 50, height: 50}}
                          source={require('../images/marker2.png')}/>
                      </View>
                      
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
            {/* <FitAllMarker cb ={() => {this.fitAllMarkers()}} /> */}
            <CurrentLocationButton cb ={() => {this.goToMrker(800)}}/> 

            
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
  componentDidUpdate(){
    //this.fitAllMarkers();
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
  componentDidMount() {
    SmsListener.addListener(message => this.parseMessage(message));
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log(' navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        var phone_no;
        JSON.parse(str, (key,value) => {
          if(key == 'refresh'){
            phone_no = value;
          } else if(key == 'addRemove'){
            this.afterNavigation(phone_no, value)
          }
          console.log(value);
        })  
        //this.afterNavigation()
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

    let a = this.state.Markers; //creates the clone of the state
    a[index] = {latitude, longitude,
                routeCoordinates: routeCoordinates.concat([newCoordinate]),
                distanceTravelled:
                  distanceTravelled, //+ this.calcDistance(newCoordinate, index),
                prevLatLng: newCoordinate,
                color: a[index].color,
                title: a[index].title };
    this.setState({Markers: a});
  }
//----------------------------------------------------------------------------------------------
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
          a[index] = coords;
          console.log('meghdar dehi region shod 4')
          this.setState({coordinates : a});

          console.log('meghdar dehi region shod 5')
          var user_id = this.state.TrackingUser[index].user_id;
          insertLocation(user_id, la, lo);
          this.animateMarker(index);
        }
      }
    }
    console.log(' end of parse message ' + message.originatingAddress);
  }
//----------------------------------------------------------------------------------------------
  afterNavigation(phone_no, opration){
    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      DB.transaction((tx) => {
        if(opration == 'add'){
          this.setState({isReady: false});
        tx.executeSql('select user_id, phone_no, marker_color from TrackingUsers where phone_no=?',
         [phone_no], (tx, results) => {
          console.log(' in after  okkkkkkkkkkkkkkkkkk : ' )
          this.setState({isReady: false});
          this.props.navigation.setParams({refresh : "no"});
          if(results.rows.length > 0){

            const TrackingUser = {
              user_id: results.rows.item(0).user_id,
              phone_no: results.rows.item(0).phone_no.split(' ')[0].toString(),
              marker_color: results.rows.item(0).marker_color.split(' ')[0].toString(),
              index: this.state.TrackingUser.length,
            };
            this.state.TrackingUser.push(TrackingUser);
            console.log(' new user added :) ');

            const marker = {
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
              index: this.state.TrackingUser.length,
            };
            this.state.Markers.push(marker)
              
            console.log(' new marker added :) ');
            this.state.coordinates.push({latitude: LATITUDE, longitude: LONGITUDE});

            this.setState({isReady:true});
          }
        })}
      else if(opration == 'remove') {
        console.log(' deleteddddddddddd :((((')
      }
      })});
  }
//----------------------------------------------------------------------------------------------
  readTrackingUsers(){
    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      DB.transaction((tx) => {
        tx.executeSql('select t.user_id, phone_no, marker_color, loc_id, latitude, longitude from TrackingUsers as t left join (select l.user_id, loc_id, latitude, longitude from Locations as l join (select user_id, max(loc_id) as loc from Locations group by user_id ) as m on l.loc_id = m.loc ) as ml on t.user_id = ml.user_id', [], (tx, results) => {
          if(results.rows.length > 0){
            var i;
            console.log(' reading tracking users please wait :) ' + results.rows.length ); 

             for(i=0; i<results.rows.length; ++i){
                console.log(JSON.stringify(results.rows.item(i))+'\n');
                  const TrackingUser = {
                    user_id: results.rows.item(i).user_id,
                    phone_no: results.rows.item(i).phone_no.split(' ')[0].toString(),
                    marker_color: results.rows.item(i).marker_color.split(' ')[0].toString(),
                    index: i,
                  };
                  this.state.TrackingUser.push(TrackingUser);

                  var a = this.state.Markers;
                  console.log(' marker color = ' + results.rows.item(i).marker_color.split(' ')[0].toString())
                  console.log(' initialize Markers for user with index = ' + i);

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
                    index: i,
                  });
                  console.log(' Markers color = ' + this.state.Markers[i].color);
                  this.state.coordinates.push({latitude: LATITUDE, longitude: LONGITUDE});
                }
                this.setState({isReady:true});
          } else { alert(' There are no users to track. ')}
        });
      });
    });
}     
//----------------------------------------------------------------------------------------------
  calcDistance = (newLatLng, index) => {
    const { prevLatLng } = this.state.Markers[index].prevLatLng;
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
}
//----------------------------------------------------------------------------------------------