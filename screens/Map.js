import React from "react";
import {View,Text,TouchableOpacity,Platform,Dimensions,Image} from "react-native";
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
import { deleteUser } from "./deleteUser.js";
import {CurrentLocationButton} from '../component/CurrentLocationButton'

let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.01 
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

export default class Map  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Markers:[],
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      coordinates: [],
      mapType : 'standard',
      TrackingUser: [],
      isReady: false,
    };    
    this.readTrackingUsers();
  }

  _menu = null;

  render() {    
    return (
      <View style={{flex: 1}}> 
          <MapView
              ref={ref => {this.map = ref}}
              style={{flex:1, height: '100%', width: '100%'}}
              mapType={this.state.mapType}
              initialRegion={this.state.region}
              showsCompass={true}>
              
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
                        pinColor={String(marker.color).split(' ')[0]}
                        title={marker.title}
                    />);
                  }})}
            </MapView>
            
            <View  style={styles.MapTypeMenuStyle}>
              <MapTypeMenu onChange={mapType => this.setState({mapType})}></MapTypeMenu>
            </View>
            <CurrentLocationButton cb ={() => {this.centerMap(500)}}/>  
        </View>
    );
  }
  
  componentDidUpdate(){
    //this.fitAllMarkers();
  }

  fotTOsupliedMarker(){
    this.map.fitToSuppliedMarkers([`marker_0`],{edgePadding: DEFAULT_PADDING,
    animated: true,});
  }

  fitAllMarkers() {
    console.log('fit : '+JSON.stringify(this.state.coordinates))
    this.map.fitToCoordinates(this.state.coordinates, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }
   componentDidMount() {
     requestPermission();     
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
      }
    });
  }

  componentWillUnmount(){
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
  }

  centerMap(d){
    const {
      latitude,longitude,
      latitudeDelta,longitudeDelta
    } = this.state.region

    console.log(JSON.stringify(this.state.region))

    this.map.animateToRegion({
      latitude,longitude,latitudeDelta,longitudeDelta
    }, d);
    console.log(latitude+' '+longitude+' '+
      latitudeDelta+' '+longitudeDelta)
  }

  animateMarker (index){
    console.log(' in animated marker for index = ' + index);
    const routeCoordinates = this.state.Markers[index].routeCoordinates;
    const distanceTravelled = this.state.Markers[index].distanceTravelled;
    const { latitude, longitude } = this.state.coordinates[index];
    const newCoordinate = { latitude, longitude };

    if (Platform.OS === "android") {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
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
          this.setState({region: {latitude: la, longitude: lo, 
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
          }})
          this.centerMap(100)
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
              index: this.state.TrackingUser.length,
            };
            this.state.Markers.push(marker)
              
            console.log(' new marker added :) ');
            this.state.coordinates.push({latitude: 0, longitude: 0});

            this.setState({isReady:true});
          }
        })}
      else if(opration == 'remove') {
        console.log(' deleteddddddddddd :((((')
      }
      })});
  }

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
                    index: i,
                  });
                  console.log(' Markers color = ' + this.state.Markers[i].color);
                  this.state.coordinates.push({latitude: 0, longitude: 0});
                }
                this.setState({isReady:true});
          } else { alert(' There are no users to track. ')}
        });
      });
    });
}     

  calcDistance = (newLatLng, index) => {
    const { prevLatLng } = this.state.Markers[index].prevLatLng;
    return haversine(prevLatLng, newLatLng) || 0;
  };  

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
