import React from "react";
import {StyleSheet,
  View, 
  Text, 
  Button,
TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile  extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const data = navigation.getParam('saveSession', true);
    this.state ={
        saveSession : data,
    };
  }

  render() {
    return (
        <View>
            <Text>Profile screen</Text>
            <TouchableOpacity style={styles.button}
                onPress={()=> this.props.navigation.navigate('Map')}>
                    <Text style={styles.text}> Map </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={()=> {
                    AsyncStorage.clear()
                    this.props.navigation.navigate('Auth')
                   }}>
                    <Text style={styles.text}> sign out </Text>
            </TouchableOpacity>   
        </View>
    );
  }
}

const styles = StyleSheet.create({
    button: { 
        width: 100,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#16A085',
        justifyContent: "center",
        marginTop: 20,
        alignItems: "center",
        marginHorizontal: 7
      },
      text: {
        color: 'rgba(255,255,255,255)',
        fontSize: 16,
        textAlign: "center"
      },
});