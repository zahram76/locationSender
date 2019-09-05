import {StyleSheet, Dimensions} from 'react-native';

const {width : WIDTH} = Dimensions.get('window'); 
const {height : HEIGHT} = Dimensions.get('window'); 

export const styles = StyleSheet.create({
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
    MapContainer: {
      flex: 1,
      position: 'relative',
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-start",
      alignItems: "center",
      
    },
    MapViewStyle: {
      marginTop: 1.5,
     // position: 'relative',
      width: '100%',
      height: '100%',
       ...StyleSheet.absoluteFillObject,
    },
    BubbleStyle: {
      flex: 1,
      //position: 'absolute',
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.8)",
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20
    },

    BubbleContainer: {
      position: 'absolute',//use absolute position to show button on top of the map
      top: '90%', //for center align
      alignSelf: 'center', //for align to right
      marginHorizontal: 110,
      marginVertical: 10,
      backgroundColor: "transparent",
      flexDirection: "row-reverse",
      alignContent: "space-between",
    },
    
    ButtonContainer: {
      //position: 'absolute',
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
    ButtonStyle: { 
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
    BackgroundContainer:{
      flex: 1,
      alignItems: "center",
      width: null,
      height: null,
      justifyContent: "center",
      backgroundColor: '#ffffff',
    },
    ScrollViewStyle: {
     flex: 1,
     backgroundColor: 'white',
    },
    inputContainer: {
      marginTop: 7
    },
    TextInputStyle: {
      width: WIDTH-55,
      height: 45,
      borderRadius: 25,
      fontSize: 16,
      paddingLeft: 45,
      backgroundColor: 'rgba(0,0,0,0.1)',
      color: '#000000',
      marginHorizontal: 25
    },
    IconStyle: {
      position: 'absolute',
      top: 14,
      left: 42
    },
    btnEye: {
      position: 'absolute',
      top: 10,
      right: 42
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
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
      backgroundColor: 'rgba(0,0,0,0.1)',
      color: '#000000',
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
    btnContainer:{
      flexDirection: "row",
    },
    btnLogin: { 
      width: WIDTH*(0.3),
      height: 45,
      borderRadius: 25,
      backgroundColor: '#16A085',
      justifyContent: "center",
      marginTop: 10,
      alignItems: "center",
      marginHorizontal: 7
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
      marginTop: 40,
      justifyContent: "flex-end",
      flexDirection: "row-reverse",
      alignContent: "space-between",
    },
    grandmother: {
      marginTop: 26,
      width: 150,
      height: 225,
      position: "relative",
    },
    grandfather: {
      width: 170,
      height: 255,
      position: "relative",
    },
    grandmotherSignUp: {
      marginTop: 18,
      width: 120,
      height: 195,
      position: "relative",
    },
    grandfatherSignUp: {
      width: 140,
      height: 215,
      position: "relative",
    },
    checkboxContainer:{
      backgroundColor: '#ffffff',
      borderColor: '#ffffff'
    },
    // addinput: {
    //   width: WIDTH-55,
    //   height: 45,
    //   borderRadius: 25,
    //   fontSize: 16,
    //   paddingLeft: 45,
    //   backgroundColor: 'rgba(0,0,0,0.05)',
    //   color: '#000000',
    //   marginHorizontal: 25
    // },
    addinput: {
      zIndex: 9,
      //borderBottomColor: '#BFBFBF',
      borderBottomWidth: 1,
      height: 40,
      fontSize: 16,
      paddingLeft: 25, // if have icon
      color: '#000000',
      marginLeft: 15,
      marginRight: 10
    },
    pickerTextBack: {
      width: 150,
      height: 45,
      borderRadius: 25,
      fontSize: 16,
      paddingLeft: 45,
      //backgroundColor: 'rgba(0,0,0,0.05)',
      color: '#000000',
      marginHorizontal: 25,
      justifyContent: 'center'
    },
    pickerText: {
      color: '#000000',
      fontSize: 16,
    },
    MapTypeMenuStyle: {
      position: 'absolute',//use absolute position to show button on top of the map
      top: '3%', //for top align
      left: '80%',
      alignSelf: 'flex-start', //for align to right 
      borderRadius: 20,
      color: 'transparent',
    },
    currentMap: {
      position: 'absolute',//use absolute position to show button on top of the map
      borderRadius: 20,
      color: 'transparent',
    }
  });
  