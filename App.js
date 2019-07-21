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
  TextInput,
  Image,
  ScrollView} from "react-native";
import SmsAndroid  from 'react-native-get-sms-android';
import SmsListener from 'react-native-android-sms-listener';
import MapView, {Marker, AnimatedRegion, Polyline} from "react-native-maps";
import haversine from "haversine";
import Login from './login.js';
import Icon from "react-native-vector-icons/Ionicons";

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const LATITUDE = 0;
const LONGITUDE = 0;
//
const {width : WIDTH} = Dimensions.get('window'); 
const {height : HEIGHT} = Dimensions.get('window'); 

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
      },
      //
      showPass: true,
      press: false,
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

  showPass = () => {
    if(this.state.press == false){
      this.setState({showPass:false, press:true});
    } else {
      this.setState({showPass:true, press:false});
    }
  }
 
  render() {
    return (
      <View style={styles.scrolStyle}>
        <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
          <ImageBackground source={require('./images/background.png')} style={styles.backcontainer}>
            
            <View style={styles.logoContainer}>
              <Image source={require('./images/logo.png')} style={styles.logo}/>
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-person'} size={18} color={'gray'}
                style={styles.inputIcon}/>
              <TextInput 
                style={styles.input}
                placeholder={'Username'}
                placeholderTextColor={'rgba(255,255,255,255)'}
                underlineColorAndroid='transparent'
                />
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-lock'} size={18} color={'gray'}
                style={styles.inputIcon}/>
              <TextInput 
                style={styles.input}
                placeholder={'Password'}
                secureTextEntry={this.state.showPass}
                placeholderTextColor={'rgba(255,255,255,255)'}
                underlineColorAndroid='transparent'
                />
                <TouchableOpacity style={styles.btnEye}
                  onPress={this.showPass.bind(this)}>
                  <Icon name={this.state.press==false ? 'ios-eye' : 'ios-eye-off'} 
                    size={28} color={'gray'}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnLogin}>
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              <Image source={require('./images/gmother.png')} style={styles.grandmother}/>
              <Image source={require('./images/gfather.png')} style={styles.grandfather}/>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}

/* <View>
<Image source={require('./images/new-grandmother.jpg')}/>
</View> */
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
  backcontainer:{
    flex: 1,
    alignItems: "center",
    width: null,
    height: null,
    justifyContent: "center",
    backgroundColor: '#ffffff',
  },
  scrolStyle: {
   flex: 1,
   backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 7
  },
  input: {
    width: WIDTH-55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: 'rgba(0,0,0,0.28)',
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 25
  },
  inputIcon: {
    position: 'absolute',
    top: 14,
    left: 42
  },
  btnEye: {
    position: 'absolute',
    top: 10,
    right: 42
  },
  btnLogin: { 
    width: WIDTH*(0.5),
    height: 45,
    borderRadius: 25,
    backgroundColor: '#16A085',
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
    marginHorizontal: 25
  },
  text: {
    color: 'rgba(255,255,255,255)',
    fontSize: 16,
    textAlign: "center"
  },
  logo: {
    width: 100,
    height: 100
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30
  },
  imageContainer: {
    marginTop: 80,
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
    alignContent: "space-between",
  },
  grandmother: {
    width: 150,
    height: 225,
    position: "relative",
  },
  grandfather: {
    width: 150,
    height: 225,
    position: "relative",
  }

});

export default AnimatedMarkers;
AppRegistry.registerComponent('sender', () => App);
