import React, {Component, Fragment} from 'react';
import {Dimensions, View, Text, AppRegistry, TouchableOpacity, Image,  Modal,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,} from "react-native";
import MapView, {Marker, AnimatedRegion, Polyline, Circle} from "react-native-maps";
import SQLite from "react-native-sqlite-storage";
import haversine from "haversine";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/FontAwesome'
import {deleteLacation} from '../functions/deleteLocation.js';
import {FitAllMarker} from '../component/fitAllMarker';

const color = '#349e9f';
const LATITUDE =  0;
const LONGITUDE = 0;
let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
       
export default class HistoryShowOnMap extends Component {
  constructor(){
    super();
    this.state = {
      modalVisible: false,
      first: true,
      mapType: "standard",
      markerImage: require('../asset/start.png'),
      Markers:[],
      region:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      data : {
          routeCoordinates: []
      }
    };
    this.dateGetter;
    this.dataflag = false;
    this.userflag = false;
  }  
//-------------------------------------------------------------------------------------------
locationDataInit(value){
    var a=[]
    var newCoordinate;
    SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB =>{
      DB.transaction((tx) => {
        console.log("execute transaction");
          tx.executeSql('select loc_id, latitude, longitude from Locations where substr(datatime,1,10)=? and user_id=?', [ value.split(' ')[0], this.user_id ], (tx, results) => {
                console.log('Resultsssssssss', results.rows.length ,value.split(' ')[0]);
                if (results.rows.length > 0) {
                    console.log('lennnnnnnn : ' , JSON.stringify(results.rows.length))
                  for(let i=0; i<results.rows.length; ++i){  
                    newCoordinate = {  
                        latitude: parseFloat(results.rows.item(i).latitude),
                        longitude: parseFloat(results.rows.item(i).longitude),
                    }  
                    //console.log('New coordiantes : '+JSON.stringify(newCoordinate))
                    a.push({
                      key : results.rows.item(i).loc_id,
                      coordinates: newCoordinate
                    })
                    //console.log('New data : '+JSON.stringify(a))
                    this.setState({data : { 
                        routeCoordinates: this.state.data.routeCoordinates.concat([newCoordinate])
                    }})
                    //console.log('New data : '+JSON.stringify(this.state.data))
                      console.log('Result 4'+ i);
                  }
                  this.first = true
                  this.setState({Markers : a})
                  this.setState({region:{
                    latitude: newCoordinate.latitude,
                    longitude: newCoordinate.longitude,
                    latitudeDelta: 0.006,
                    longitudeDelta: 0.006
                  }})
                 // console.log('result 1 : ', JSON.stringify(this.state.data) + 'result 2 : '+ JSON.stringify(this.state.Markers));
                  //var len = this.data.routeCoordinates.length
                  //console.log('Result 3'+ "len");
                  this.centerMap(250)
                  console.log('select location to flat list Successfully');
                } else { console.log('no location'); }  
          });
        });  
      });  
}
//-------------------------------------------------------------------------------------------
goToMrker(d){ // mire be ye region ke goftim
  const latitude = this.state.region.latitude;
  const longitude = this.state.region.longitude;
  const latitudeDelta = this.state.region.latitudeDelta;
  const longitudeDelta = this.state.region.longitudeDelta;
  console.log(latitudeDelta+' '+longitudeDelta)

  this.map.fitToElements(true);
  // this.map.animateToRegion({
  //   latitude,longitude,latitudeDelta,longitudeDelta
  // }, d);
  // console.log(latitude+' '+longitude+' '+
  //   latitudeDelta+' '+longitudeDelta)
}
//-------------------------------------------------------------------------------------------
  centerMap(d){
    const {
      latitude,longitude,
      latitudeDelta,longitudeDelta
    } = this.state.region

    // this.map.fitToCoordinates(this.state.data.routeCoordinates, {
    //   edgePadding: DEFAULT_PADDING,
    //   animated: true,
    // });

    this.map.animateToRegion({
      latitude,longitude,latitudeDelta,longitudeDelta}, d);
      this.setState({modalVisible: false})
  }
//-------------------------------------------------------------------------------------------
  componentDidMount(){
    this.setState({modalVisible: true})
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log(' navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        JSON.parse(str, (key,value) => {
          if(key == 'date'){
            this.date = value
            this.dataflag = true
            console.log(value)
          }
          if(key == 'user_id'){ 
            this.user_id = value;
            this.userflag = true
          }
          if(this.dataflag && this.userflag){
            this.locationDataInit(this.date);
            this.dataflag = false
            this.userflag = false
          }
        })
      } else { console.log( ' is nul ')}
    });
  }
//-------------------------------------------------------------------------------------------
  render(){
    return (
      <Fragment>
        <MapView
          ref={ref => {this.map = ref}}
          style={{flex:1, height: '100%', width: '100%'}}
          mapType={this.state.mapType}
          rotateEnabled={true}
          initialRegion={this.state.region}
          //onRegionChangeComplete={(region)=> this.setState({region})}
          >
          <Polyline
            coordinates={this.state.data.routeCoordinates}
            strokeWidth={5}  strokeColor = { 'blue' }>
          </Polyline> 
          {this.state.Markers.map(marker => {
              console.log('markers : '+JSON.stringify(marker))
            return (
              <Marker
                  key ={`marker_${marker.key}`}
                  tracksViewChanges={true}
                  coordinate={marker.coordinates}
                  //onPress={()=> alert('afajkl')}
                  //image={require('../asset/bubble.png')}
                  centerOffset={{x: 5, y: -5}}
                  >
               </Marker> );
            })}

            {this.state.Markers.map(marker => {
               return (
              <Circle
                  key ={`circle_${marker.key}`}
                  center = { marker.coordinates }
                  radius = { 30 }
                  strokeWidth = { 1 }
                  strokeColor = { '#1a66ff' }
                  fillColor = { 'rgba(230,238,255,0.5)' }
                  >
            </Circle>  )})}

         </MapView>
         <Modal
            animationType="fade"
            transparent={true}
            presentationStyle={"overFullScreen"}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      alert('Modal has been closed.');
                      this.setState({modalVisible: false})
                    }}>
                    <View style={{backgroundColor: "rgba(255,255,255,0.04)",
                      justifyContent: "center",
                      flex: 1, alignItems: 'center',}}>
                      <View style={{marginTop: 150}}>
                        <ActivityIndicator size="large" color="#0000ff" /> 
                        <TouchableHighlight
                          style={{margin: 30, backgroundColor: "rgba(255,255,255,0.4)",
                          justifyContent: "center", alignItems: 'center',}}
                          onPress={() => {
                            this.setState({modalVisible: false})
                          }}>
                          <Text>cancel ?</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>
                  <FitAllMarker cb ={() => {this.goToMrker(800)}} />
      </Fragment>
  );
}
//-------------------------------------------------------------------------------------------
 
//-------------------------------------------------------------------------------------------
  calcDistance = (newLatLng) => {
    const  prevLatLng  = this.state.Markers.prevLatLng;
    return haversine(prevLatLng, newLatLng) || 0;
  };
//-------------------------------------------------------------------------------------------
  static navigationOptions = ({ navigation }) => {
    return {
        title: 'History ',
        headerStyle: {
          backgroundColor: color,
          barStyle: "light-content", // or directly
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: (
          <View style={{marginLeft: 15}}>
            <MaterialCommunityIcons name={'arrow-left'} size={25} style={{color: 'white'}}
              onPress={ () => { navigation.navigate('UsersHistory') }} />
            </View>
        ),
      }
    }
}