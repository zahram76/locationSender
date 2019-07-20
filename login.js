import React, {Component} from "react";
import {StyleSheet,
         View, 
         Text, 
         TouchableOpacity, 
         Platform, 
         PermissionsAndroid, 
         ImageBackground,
        }
from "react-native";
import bgImage from './images/background.png'
import { Certificate } from "crypto";

export class Login extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <ImageBackground source={bgImage} style={styles.container}>

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        width: null,
        height: null,
        justifyContent: "center",
        backgroundColor: '#ffffff',
    }
});
