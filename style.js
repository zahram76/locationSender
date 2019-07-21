import React, {Component} from "react";
import {StyleSheet,
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    Dimensions,
    TextInput,
    Image,
    ScrollView,
    Button} from "react-native";

const {width : WIDTH} = Dimensions.get('window'); 
const {height : HEIGHT} = Dimensions.get('window'); 

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
      },
});