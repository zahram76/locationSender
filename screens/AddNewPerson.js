import React, {Component} from "react";
import {
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    TextInput,
    Image,
    ScrollView,
    Picker,
    Modal,
    TouchableHighlight,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SmsListener from 'react-native-android-sms-listener';
import SQLite from "react-native-sqlite-storage";
import SmsAndroid  from 'react-native-get-sms-android';
import {initDatabase} from './initDatabase.js';
import {styles} from '../style.js';

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
            color: 'red',
            answer: undefined,
            timer: null,
            modalVisible: false,
            canceled: false,
        };
    }

  componentDidMount() {
    initDatabase();
    SmsListener.addListener(message => {
      if(this.state.canceled == false)
        this.parseMessage(message);
    });
  }

    AddButtonPress() {
      this.setState({canceled: false});
        if (this.state.first_name == ''
          || this.state.last_name == ''
          || this.state.phone_no == ''
          || this.state.age == 0){
            alert("Please fill in the blanks!")
        } else {
          this.setState({modalVisible: true})
          this.isRepeatedUser();
          //this.sendsms();
        }
    }

    isRepeatedUser(){
      SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        DB.transaction((tx) => {
        console.log("execute transaction");
        tx.executeSql('select phone_no from TrackingUsers where phone_no=?', 
          [this.state.phone_no],
             (tx, results) => {
              console.log('phone Results', results.rows.length);
              if(results.rows.length == 0){
                this.sendsms();
                //this.InsertUser();
              } else {
                this.setState({modalVisible: false})
                alert('This phone number is already in use. ') }
        });
    });});
  }

    sendsms(){
      phoneNumber = this.state.phone_no;
      console.log( this.state.phone_no)
      message = 'hello can i access to your location?';
      this.setState({message : message});
      SmsAndroid.autoSend(phoneNumber, message, (fail) => {
          console.log("Failed with this error: " + fail)
      }, (success) => {
          console.log("SMS sent successfully" + success);
      });
    }

    parseMessage(message){ 
      var a = message.originatingAddress.split(' ')
      var b = this.state.phone_no.split(' ')
      var n = a[0].localeCompare(b[0]);
  
      if(n == 0){ 
        const res = message.body.split(' ');
        console.log('res' +  res)
        if (res[0] == 'hello' && res[1] == 'new_tracking_user'){
            if(res[2] == 'yes'){
              this.setState({answer: res[2]})
              console.log('yes ');
              this.InsertUser();
            } else {
              this.setState({answer: 'no'})
              alert("I can't access");
            }
      }} 
    }
  
    InsertUser(){
      SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        DB.transaction((tx) => {
        console.log("execute transaction");
        tx.executeSql('insert into TrackingUsers(phone_no, first_name, last_name, age, marker_color) values (?,?,?,?,?)', 
          [this.state.phone_no,this.state.first_name, this.state.last_name, this.state.age, this.state.color],
             (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                this.setState({modalVisible: false})
                alert('Success'+'\n'+'You are Registered Successfully');
                this.props.navigation.navigate('Map');
              } else {
                alert('Registration Failed');
              }
   });});});
  }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.setState({canceled: true});
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
                style={styles.addinput}
                placeholder={'phone number'}
                placeholderTextColor={'gray'}
                underlineColorAndroid='transparent'
                onChangeText={txt => {
                  console.log(txt)
                  this.setState({phone_no: txt.split(' ')[0]})
                  console.log('after : ' + this.state.phone_no)
                }}
               />
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-person'} size={18} color={'gray'}
                style={styles.inputIcon}/>
              <TextInput 
                style={styles.addinput}
                placeholder={'first name'}
                placeholderTextColor={'gray'}
                underlineColorAndroid='transparent'
                onChangeText={txt => this.setState({first_name: txt})}
               />
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-person'} size={18} color={'gray'}
                style={styles.inputIcon}/>
              <TextInput 
                style={styles.addinput}
                placeholder={'last name'}
                placeholderTextColor={'gray'}
                underlineColorAndroid='transparent' 
                onChangeText={(txt => this.setState({last_name: txt}))}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-person'} size={18} color={'gray'}
                style={styles.inputIcon}/>
              <TextInput 
                style={styles.addinput}
                placeholder={'age'}
                placeholderTextColor={'gray'}
                underlineColorAndroid='transparent' 
                onChangeText={(txt => this.setState({age: txt}))}
              />
              </View>

              <View style={[styles.inputContainer, {flexDirection: 'row', marginHorizontal: 25}]}>
                <Icon name={'ios-pin'} size={20} color={'gray'}
                  style={styles.inputIcon}/>
                <View style={styles.pickerTextBack}>
                  <Text style={styles.pickerText} > marker color </Text>
                </View>
                <View style={{height: 45, width: 140, borderRadius: 25,
                     marginRight: 27, paddingLeft: 10,
                     backgroundColor: 'rgba(0,0,0,0.05)', color: '#000000'}}>
                <Picker
                  selectedValue={this.state.color}
                  mode={"dialog"}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({color: itemValue})
                  }>
                  <Picker.Item label="White" value="white"/>
                  <Picker.Item label="Black" value="black"/>
                  <Picker.Item label="Blue" value="blue"/>
                  <Picker.Item label="Green" value="green"/>
                  <Picker.Item label="Gray" value="gray"/>
                  <Picker.Item label="Purple" value="purple"/>
                  <Picker.Item label="Red" value="red"/>
                  <Picker.Item label="Yellow" value="yellow"/>
                  <Picker.Item label="Pink" value="pink"/>
                  <Picker.Item label="Orange" value="orange"/>
                </Picker>
                </View>
              </View>
            
            <View style={[styles.btnContainer,{marginTop: 15}]}>
              <TouchableOpacity style={styles.btnLogin}
                onPress={this.AddButtonPress.bind(this)}>
                <Text style={styles.text}>Add</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{marginTop: 22}}>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    presentationStyle={"overFullScreen"}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      alert('Modal has been closed.');
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View style={{marginTop: 22, backgroundColor: "rgba(255,255,255,0.4)",
                      justifyContent: "center",
                      flex: 1, alignItems: 'center',}}>
                      <View style={{marginTop: 100}}>
                        <ActivityIndicator size="large" color="#0000ff" /> 
                        <TouchableHighlight
                          style={{margin: 30, backgroundColor: "rgba(255,255,255,0.5)",
                          justifyContent: "center", alignItems: 'center',}}
                          onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                          }}>
                          <Text>cancel ?</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>
                </View>

          </ImageBackground>
        </ScrollView>
     </View>
        );
    }
}

