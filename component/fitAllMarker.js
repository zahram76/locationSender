import React, { Component } from 'react';
import {Dimensions, View, Text, TouchableOpacity, StyleSheet} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const FitAllMarker = function(props){
    const cb = props.cb ? props.cb : ()=> console.log('callout function not call')
    const bottom = props.bottom ? props.bottom : 65
    return(
        <View style={[styles.container, {top: '85%', alignSelf: 'center'}]} >    
        <View style={[styles.icon]}>
            <MaterialCommunityIcons 
                name='map-marker-multiple' 
                color='#000000'
                size={25}
                onPress ={() => { cb() }}
            />
        </View>
        <Text style={{alignSelf: 'center',left: '5%',fontSize: 17}}>All</Text>
    </View>
    )
}



const styles= StyleSheet.create({
    container: {
        position: 'absolute',
        left: '5%',
    }, 
    icon: {
        borderRadius: 20,
        zIndex: 9,
       // position: 'absolute',
        width: 50,
        height: 50,
        left: '5%',
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowColor: '#000000',
        elevation: 4,
        shadowRadius: 5,
        shadowOpacity: 1.0,
        justifyContent: 'space-around',
        alignItems: 'center',
    }

})