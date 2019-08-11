import SQLite from "react-native-sqlite-storage";
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

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "database.db";
const database_version = "1.0";
const database_displayname = "SQLite React Database";
const database_size = 200000;

export default class Database extends Component {
    constructor(){
        super();

        this.state = {
            TrackingUser: {
                firstName: null,
                lastName: null,
                Age: null,
                PhoneNo: null,
                userId: null
            }

        }
    }

    initDB() {
        let db;
        return new Promise((resolve) => {
          console.log("Plugin integrity check ...");
          SQLite.echoTest()
            .then(() => {
              console.log("Integrity check passed ...");
              console.log("Opening database ...");
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;
                  console.log("Database OPEN");
                  db.executeSql('SELECT * FROM TrackingUser').then(() => {
                      console.log("Database is ready ... executing query ...");
                  }).catch((error) =>{
                      console.log("Received error: ", error);
                      console.log("Database not yet ready ... populating data");
                    //   db.transaction((tx) => {
                    //       tx.executeSql('CREATE TABLE IF NOT EXISTS Product (prodId, prodName, prodDesc, prodImage, prodPrice)');
                    //   }).then(() => {
                    //       console.log("Table created successfully");
                    //   }).catch(error => {
                    //       console.log(error);
                    //   });
                  });
                  resolve(db);
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log("echoTest failed - plugin not functional");
            });
          });
      };

      render(){
          rreturn (
            <View>
                <Text>database screen</Text>
                <Button title="in database. go to map screen" 
                    onPress={()=> this.props.navigation.navigate('Map')}/>
                <Button title="in database. show tracking users row" 
                    onPress={()=> }/>
            </View>
        );
      }
}