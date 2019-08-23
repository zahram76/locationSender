import React, {Component} from "react";
import {
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    TextInput,
    Image,
    ScrollView,
    } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SQLite from "react-native-sqlite-storage";
import {styles} from '../style.js';

// var db =  SQLite.openDatabase(
//   {name : "database", createFromLocation : "~database.sqlite"});
SQLite.DEBUG(true);
SQLite.enablePromise(true);


export default class AddNewPerson extends Component {
    constructor(props) {
        super(props);
        // const { navigation } = this.props;
        // const uname = navigation.getParam('username', '');
        // const pass = navigation.getParam('password', '');
        // username: uname,
        // password: pass,
      // for get param from another page

        this.state={
            showPass: true,
            press: false,
            reshowPass: true,
            repress: false,
            username: '',
            password: '',
            rePassword: '',
            src_phone: '',
            dest_phone: '',
        };
    }

    showPass = () => {
        if(this.state.press == false){
          this.setState({showPass:false, press:true});
        } else {
          this.setState({showPass:true, press:false});
        }
      }

    reshowPass = () => {
        if(this.state.repress == false){
          this.setState({reshowPass:false, repress:true});
        } else {
          this.setState({reshowPass:true, repress:false});
        }
      }

    sighUpOnPress() {
        if (this.state.password == ''
          || this.state.rePassword == ''
          || this.state.username == ''
          || this.state.src_phone == ''
          || this.state.dest_phone == ''){
            alert("Please fill the blanks!")
        }
        else if (this.state.rePassword != this.state.password) {
          alert("Does not match!")
        } else {
          // if this username is not in database
            // try {
            //   AsyncStorage.setItem('username', this.state.username)
            //   this.props.navigation.navigate('App')
            // } catch (e) {
            //   alert(e);
            // } ooooooooorrrrrrr
            this.props.navigation.push('SignIn')
            this.props.navigation.navigate('Auth')
        }
    }

    initDatabase(){
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
        return ( 
          <View style={styles.ScrollViewStyle}>
            <ScrollView style={styles.ScrollViewStyle} scrollEnabled contentContainerStyle={styles.ScrollViewStyle}>
              <ImageBackground source={require('../images/background.png')} style={styles.BackgroundContainer}> 
                  <View style={styles.inputContainer}>
                    <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({src_phone: txt})}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'first name'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'last name'}
                      secureTextEntry={this.state.showPass}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent' 
                      onChangeText={(txt => this.setState({password: txt}))}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'age'}
                      secureTextEntry={this.state.showPass}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent' 
                      onChangeText={(txt => this.setState({password: txt}))}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.ButtonStyle}
                      onPress={this.sighUpOnPress.bind(this)}>
                      <Text style={styles.text}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.imageContainer, {marginTop: 50}]}>
                    <Image source={require('../images/gmother.png')} style={styles.grandmother}/>
                    <Image source={require('../images/gfather.png')} style={styles.grandfather}/>
                  </View>
                </ImageBackground>
              </ScrollView>
           </View>
        );
    }
}
