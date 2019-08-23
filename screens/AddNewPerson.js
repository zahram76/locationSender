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
            first_name: '',
            last_name: '',
            phone_no: '',
            age: 0,
        };
        
        DB =  SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"});

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

      AddButtonPress() {
        if (this.state.first_name == ''
          || this.state.last_name == ''
          || this.state.phone_no == ''
          || this.state.age == 0){
            alert("Please fill the blanks!")
        } else {
          SQLite.openDatabase(
            {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
            DB.transaction((tx) => {
            console.log("execute transaction");
            tx.executeSql('insert into TrackingUsers(phone_no, first_name, last_name, age) values (?,?,?,?)', 
              [this.state.phone_no,this.state.first_name, this.state.last_name, this.state.age],
                 (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    if (results.rowsAffected > 0) {
                      alert('Success'+'\n'+'You are Registered Successfully');
                      this.props.navigation.navigate('Map');
                    } else {
                      alert('Registration Failed');
                    }
                  }
                }
              );
            });
          });
        }
    }

    componentDidMount(){
      this.initDatabase();
    }

    initDatabase(){
      SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        console.log("Database OPEN");
          DB.transaction((tx) => {
            console.log("execute transaction");
            tx.executeSql('CREATE TABLE IF NOT EXISTS TrackingUsers(user_id INTEGER PRIMARY KEY AUTOINCREMENT, phone_no VARCHAR(12) unique not null , first_name VARCHAR(20) not null, last_name VARCKAR(20) not null, age integer not null)', [], (tx, results) => {
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
        });
    }

    render() {
        return ( 
          <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <ImageBackground source={require('../images/background.png')} style={styles.backcontainer}> 
                <View style={[styles.inputContainer, {marginTop: 50}]}>
                    <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({phone_no: txt})}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'first name'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({first_name: txt})}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'last name'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent' 
                      onChangeText={(txt => this.setState({last_name: txt}))}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'age'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent' 
                      onChangeText={(txt => this.setState({age: txt}))}
                    />
                  </View>
                  <View style={[styles.btnContainer,{marginTop: 15}]}>
                    <TouchableOpacity style={styles.btnLogin}
                      onPress={this.AddButtonPress.bind(this)}>
                      <Text style={styles.text}>Add</Text>
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
