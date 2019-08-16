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

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class database extends Component {
  constructor(props) {
    super(props)

    this.state = {
        TrackingUsers: [],
        // {
            // firstName: null,
            // lastName: null,
            // Age: null,
            // PhoneNo: null,
            // userId: null
        // },
        rowss: "",
    }
    ToastAndroid.show('Hello!!', ToastAndroid.SHORT);
  }

  init(){
    console.log("Opening database ...");
    SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        console.log("Database OPEN");
        console.log("execute transaction");
        DB.transaction((tx) => {
            tx.executeSql('SELECT * FROM TrackingUser', [], (tx, results) => {
                var len = results.rows.length;
                console.log("helllllllllllllo");
                console.log(JSON.stringify(results));
                if(len > 0) {
                  var row = results.rows.item(0);
                  var rrr = JSON.stringify(row);
                  console.log(row);
                  JSON.parse(rrr, (key, value) => {
                    console.log(key + ' ' + value);
                  });
                  var res = row.splite(',');
                  //var r1 = res[0].splite('user_id');
                  //this.state.TrackingUsers.push(rrr);
                  console.log(res);
                  alert(len);
                }
              });
         });
    })
  }

  render() {
      this.init();
    return (
      <View style={styles.container}>
        <Text>SQLite Example</Text>
        <Text>row is {this.state.rowss}</Text>
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


