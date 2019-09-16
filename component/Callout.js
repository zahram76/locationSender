import React, { Component } from 'react';
import {
  Image,              // Renders images
  StyleSheet,         // CSS-like styles
  Text,               // Renders text
  View,  
  TouchableOpacity,             // Container component
} from 'react-native';

const imageOption = [
    'asset:/images/full-battery.png',
    'asset:/images/battery-level.png',
    'asset:/images/empty-battery.png'
];

export default class Callout extends Component {
  render() {
    const { name, batteryLevel, distanceTravelled } = this.props;
    const image = batteryLevel > 0.7 ? imageOption[0] : (
        batteryLevel > 0.3 ? imageOption[1] : (batteryLevel < 0.25 ? imageOption[2] : null))

    console.log('in callout class ', name , batteryLevel, distanceTravelled, image)

    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <View style={{ flex: 1, flexDirection : 'row'}}> 
                <Text style={styles.name}>Dist: {distanceTravelled} Km</Text>
            </View>
            <View style={{ flex: 1, flexDirection : 'row'}}> 
                <Text style={{paddingBottom: 10, flex: 1}}  > 
                    <Image  style={styles.image} 
                        source={{uri : image}} resizeMode={'contain'}/>
                </Text>
                <Text style={[styles.name, {flex: 1, alignSelf: "center", marginTop: 20}]}>{batteryLevel*100}%</Text>
            </View>
          </View>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    
  },
  // Callout bubble
  bubble: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 20,
    //borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    paddingBottom: 10,
    //width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
   // alignSelf: 'center',
  },
  // Character image
  image: {
    width: 40,
    height: 40,
   // alignSelf: 'flex-start',
  },
});