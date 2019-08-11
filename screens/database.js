import React, { Component } from 'react';
import {
    StyleSheet,
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    TextInput,
    Button,
    ToastAndroid } 
from "react-native";

import SQLite from "react-native-sqlite-storage";

var db = SQLite.openDatabase({name: 'database.db', createFromLocation: '~database.db'})

export default class database extends Component {
  constructor(props) {
    super(props)

    this.state = {
        TrackingUser: {
            firstName: null,
            lastName: null,
            Age: null,
            PhoneNo: null,
            userId: null
        }
    }
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM pet WHERE owner=?', ['Mary'], (tx, results) => {
          var len = results.rows.length;
          if(len > 0) {
            // exists owner name John
            var row = results.rows.item(0);
            this.setState({TrackingUser: row});
          }
        });
    });

    ToastAndroid.show('Hello!!', ToastAndroid.SHORT);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>SQLite Example</Text>
        <Text> first name is {this.state.TrackingUser.firstName}</Text>
        <Text>database screen</Text>
        <Button title="in database. go to map screen" 
            onPress={()=> this.props.navigation.navigate('Map')}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});


