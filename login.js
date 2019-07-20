'use strict';

import React, {Component} from "react";
import {StyleSheet,
         View, 
         Text, 
         TouchableOpacity, 
         ImageBackground,
        }
from "react-native";
//import bgImage from './images/background.png'
//import { Certificate } from "crypto";

export default class Login extends Component {
    // constructor(props) {
    //     super(props);

    //}

    render() {
        return (
            <ImageBackground source={require('./images/background.png')} style={styles.container}>

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
