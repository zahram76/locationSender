import React, { Component } from 'react';
import {
    View, 
    Text, 
    TouchableOpacity, 
    Button,
    ToastAndroid } 
from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SQLite from "react-native-sqlite-storage";
import {styles} from '../style.js';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class database extends Component {
  constructor(props) {
    super(props)

    this.state = {
        TrackingUsers: [],
        rowss: "",
        number: 0,
    }

    this.timer = null;
    this.addOne = this.addOne.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    ToastAndroid.show('Hello!!', ToastAndroid.SHORT);
  }

  
  componentWillUnmount(){
    const {params} = this.props.navigation.state;
    params.callRefresh();
  }

  addOne() {
    this.setState({number: this.state.number+1});
    this.timer = setTimeout(this.addOne, 100);
  }

  stopTimer() {
    clearTimeout(this.timer);
  }

  init(){
    console.log("Opening database ...");
    SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        console.log("Database OPEN");
        DB.transaction((tx) => {
          console.log("execute transaction");
          tx.executeSql('CREATE TABLE IF NOT EXISTS TrackingUsers(user_id INTEGER PRIMARY KEY AUTOINCREMENT, phone_no VARCHAR(12) unique not null , first_name VARCHAR(20) not null,last_name VARCKAR(20) not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log(" Tracking Users ");
            console.log(JSON.stringify(results) + ' ' + len);
        });
          tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(loc_id integer primary key autoincrement, user_id INTEGER not null, datatime text not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log(" Locations ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
          tx.executeSql('CREATE TABLE IF NOT EXISTS CurrentUser(user_id integer primary key autoincrement, first_name text not null, last_name text not null, username text not null, password text not null, phone_no text not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log(" CurrentUser ");
            console.log(JSON.stringify(results) + ' ' + len);
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
        <TouchableOpacity 
            onPress={()=> this.props.navigation.navigate('Map')}>
          <Text style={styles.text} > in database. go to map screen </Text>
        </TouchableOpacity>
        
        <Text> {this.state.number}  </Text>
        <TouchableOpacity style={styles.ButtonStyle}
          onPressIn={this.addOne} onPressOut={this.stopTimer}>
            <Icon name="ios-add" size={50} color={'purple'} />
        </TouchableOpacity>
      </View>
    );
  }
}


