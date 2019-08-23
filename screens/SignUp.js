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


export default class SignUp extends Component {
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
          <View style={{ScrollViewStyle}}>
            <ScrollView style={styles.ScrollViewStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <ImageBackground source={require('../images/background.png')} style={styles.BackgroundContainer}> 
                <View style={styles.logoContainer}>
                  <Image source={require('../images/logo.png')} style={styles.logo}/>
                </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'Username'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'Password'}
                      secureTextEntry={this.state.showPass}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent' 
                      onChangeText={(txt => this.setState({password: txt}))}
                    />
                    <TouchableOpacity style={styles.btnEye}
                      onPress={this.showPass.bind(this)}>
                      <Icon name={this.state.press==false ? 'ios-eye' : 'ios-eye-off'} 
                        size={28} color={'gray'}/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'Re Password'}
                      secureTextEntry={this.state.reshowPass}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({rePassword: txt})}
                    />
                    <TouchableOpacity style={styles.btnEye}
                      onPress={this.reshowPass.bind(this)}>
                      <Icon name={this.state.repress==false ? 'ios-eye' : 'ios-eye-off'} 
                        size={28} color={'gray'}/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'src phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({src_phone: txt})}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'dest phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({dest_phone: txt})}
                     />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.ButtonStyle}
                      onPress={this.sighUpOnPress.bind(this)}>
                      <Text style={styles.text}>SIGN UP</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image source={require('../images/gmother.png')} style={styles.grandmother}/>
                    <Image source={require('../images/gfather.png')} style={styles.grandfather}/>
                  </View>
                </ImageBackground>
              </ScrollView>
           </View>
        );
    }
}
