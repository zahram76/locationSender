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
import {initDatabase} from './initDatabase.js';

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
            phone: '',
        };
    }

    componentDidMount(){
     // initDatabase();
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
    
      insertUser(){
        SQLite.openDatabase(
          {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
          DB.transaction((tx) => {
          console.log("execute transaction");
          tx.executeSql('insert into CurrentUser(username, password, phone_no) values (?,?,?)', 
            [this.state.username, this.state.password, this.state.phone],
               (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  if (results.rowsAffected > 0) {
                    alert('Success'+'\n'+'You are Registered Successfully');
                    this.props.navigation.navigate('SignIn');
                  } else {
                    alert('Registration Failed');
                  }
                }
     });});});
    }

    isRepeatedUser(){
      SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        DB.transaction((tx) => {
        console.log("execute transaction");
        tx.executeSql('select username from CurrentUser where username=?', 
          [this.state.username],
             (tx, results) => {
              console.log('username Results',JSON.stringify(results.rows));
              if(results.rows.length == 0){
                tx.executeSql('select phone_no from CurrentUser where phone_no=?', 
                [this.state.phone],
                  (tx, results) => {
                    console.log('phone Results',JSON.stringify(results.rows));
                    if(results.rows.length == 0){
                      this.insertUser();
                  } else {
                    alert('This mobile number is already in use. ')
                  }});
              } else { alert('This username is already in use. ') }
        });
    });});
  }

    sighUpOnPress() {
        if (this.state.password == ''
          || this.state.rePassword == ''
          || this.state.username == ''
          || this.state.phone == ''){
            alert("Please fill the blanks!")
        }
        else if (this.state.rePassword != this.state.password) {
          alert("Does not match!")
        } else {
          this.isRepeatedUser()
          }
            // this.props.navigation.push('SignIn')
            // this.props.navigation.navigate('Auth')
    }


    render() {
        return ( 
          <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <ImageBackground source={require('../images/background.png')} style={styles.BackgroundContainer}> 
                <View style={styles.logoContainer}>
                  <Image source={require('../images/logo1.png')} style={styles.logo}/>
                </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'Username'}
                      placeholderTextColor={'gray'}
                      underlineColorAndroid='transparent'
                      onChangeText={(txt => this.setState({username: txt.split(' ')[0]}))}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'Password'}
                      secureTextEntry={this.state.showPass}
                      placeholderTextColor={'gray'}
                      underlineColorAndroid='transparent' 
                      onChangeText={(txt => this.setState({password: txt.split(' ')[0]}))}
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
                      placeholderTextColor={'gray'}
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
                      placeholder={'phone number'}
                      placeholderTextColor={'gray'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({phone: txt})}
                     />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.ButtonStyle}
                      onPress={this.sighUpOnPress.bind(this)}>
                      <Text style={styles.text}>Sign up</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image source={require('../images/gmother.png')} style={styles.grandmotherSignUp}/>
                    <Image source={require('../images/gfather.png')} style={styles.grandfatherSignUp}/>
                  </View>
                </ImageBackground>
              </ScrollView>
           </View>
        );
    }
}
