import React, {Component} from "react";
import {
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Image,
    ScrollView,
      Picker,
    Modal,
    StyleSheet,
    TouchableHighlight,
    ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SmsListener from 'react-native-android-sms-listener';
import SQLite from "react-native-sqlite-storage";
import ImagePicker from 'react-native-image-picker';
import SmsAndroid  from 'react-native-get-sms-android';
import ImageResizer from 'react-native-image-resizer';
import {initDatabase} from './initDatabase.js';
import {InsertUser} from './insertUser.js';
import {deleteUser} from './deleteUser.js';
import {styles} from '../style.js';
var RNFS = require('react-native-fs');

const color = '#028687';
const ImageOptions = [
  require('../images/error.png'),
  require('../images/verified.png')
]
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var phone_no = ''

export default class AddNewPerson extends Component {
    constructor(props) {
        super(props);
        this.state={
            first_name: '',
            last_name: '',
            phone_no: '',
            age: '',
            image: '',
            saveImage: null,
            error: false, 
            message: '',
            bordercolor: '#DBDBDB',
            bordercolor1: '#DBDBDB',
            bordercolor2: '#DBDBDB',
            bordercolor3: '#DBDBDB',
            color: 'red',
            timer: null,
            answer: undefined,
            modalVisible: false,
            canceled: false,
            resizedImageUri: null,
            avatarSource: {uri: 'asset:/images/defaultProfile.png'},
            isReady: false,
            uriFlag: false,
            sendigType: 'speed',
            interval: 20,
        };
    }

  componentDidMount() {
    //initDatabase();
    SmsListener.addListener(message => {
      if(this.state.canceled == false)
        this.parseMessage(message);
    });
  }

  AddButtonPress() {
    var flag = false;
      if (this.state.phone_no == '' ){ 
        this.setState({bordercolor2 : '#B30000'}); 
        flag = true}
      if (this.state.first_name == ''){
         this.setState({bordercolor : '#B30000'}); 
         flag = true}
      if (this.state.last_name == ''){ 
        this.setState({bordercolor1 : '#B30000'}); 
        flag = true}

      if(flag){
        this.setState({message: 'Please fill in the blanks!'});
        this.setState({error: true});
        this.setState({isReady: true});
      } else {
        phone_no = this.state.phone_no;
        this.setModalVisible(true);
        this.isRepeatedUser();
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
                this.setState({message: 'This phone number is already in use. '})
                this.setState({error: true});
                this.setState({isReady: true}); }
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

    async parseMessage(message){ 
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
              var image;
              JSON.parse(JSON.stringify(this.state.avatarSource), (key, value) =>{
                if (key == 'uri')
                  image = value
              })
              console.log(' image in insert new user : ',image)
              this.InsertUser(this.state.phone_no,this.state.first_name,this.state.last_name,this.state.age,
                this.state.color, this.state.avatarSource, this.state.sendigType, this.state.interval, image);
                console.log('pa color ine dige ', this.state.color)
              this.setState({message: 'Success'+'\n'+'You are Registered Successfully'});
              this.setState({error: false});
              this.setState({isReady: true});
              this.setState({modalVisible: false})
              //this.props.navigation.navigate('Map',{refresh : this.state.phone_no, addRemove: "add"});
            } else {
              this.setState({answer: 'no'})
              this.setState({message: 'This phone number is already in use. '})
              this.setState({error: true});
              this.setState({isReady: true});
              //alert("I can't access");
            }
      }} 
    }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    if(this.state.visible == false)
      this.setState({canceled: true});
  }

  InsertUser(phone_no,first_name,last_name,age,color,image,sendigType,interval,marker_image){
    console.log('image : '+ image)
        SQLite.openDatabase(
          {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
          DB.transaction((tx) => {
          console.log("execute transaction");
          tx.executeSql('insert into TrackingUsers(phone_no, first_name, last_name, age, marker_color, user_image, sending_setting, interval, marker_image) values (?,?,?,?,?,?,?,?,?)', 
            [phone_no,first_name, last_name, age, color, JSON.stringify(image),sendigType, interval, marker_image],
               (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  this.setState({modalVisible: false})
                  alert('Success'+'\n'+'You are Registered Successfully');
                  //this.back();
                } else {
                  alert('Registration Failed');
                }
          });
        // console.log('update user image for marker setting in account : ',image.uri)
        // tx.executeSql('update CurrentUser set markerImage=? where where phone_no=?', [image.uri,phone_no], 
        //     (tx, results) => {
        //       console.log('Results', results.rowsAffected);
        //       if (results.rowsAffected > 0) {
        //         console.log('markerImage update : ' + results.rowsAffected)
        //       } else { console.log('can not find markerImage setting ') }  
        // });
    });
  });
}

  getImage(){ 
    console.log('image picker');
      ImagePicker.launchImageLibrary(options, (response) => {
         const uri = 'data:image/jpeg;base64,' + response.data ;
         this.imageUri = uri
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          ImageResizer.createResizedImage(uri, 300, 300, 'JPEG', 80,1, RNFS.DocumentDirectoryPath+'/images/')
          .then(({uri}) => {
            this.setState({avatarSource: {uri: uri}})
          }).catch((err) => {
            console.log(err);
          });
        }
      });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'New user',
      headerStyle: {
        backgroundColor: color,
        barStyle: "light-content", // or directly
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
    },
        headerLeft: (
        <View style={{marginLeft: 15}}>
          <MaterialCommunityIcons name={'arrow-left'} size={25} style={{color: 'white'}}
            onPress={ () => { navigation.navigate('Map', {refresh : phone_no, addRemove: "add"}) }} />
        </View>
        ),
      }
    }

    render() {
        return ( 
         <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
                <View style={style.avatarContainer} >
                  <TouchableOpacity onPress={() => this.getImage()}>
                      <Image source={this.state.avatarSource}
                              style={style.avatarImage} resizeMode={'cover'}/>
                  </TouchableOpacity> 
                </View>
              <View style={{flex: 1, marginTop: 55,marginBottom: 20}}>
                <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor, width: '85%'}]}
                      onFocus={() => {this.setState({bordercolor : color}); 
                        this.setState({bordercolor1 : "#DBDBDB"});
                        this.setState({bordercolor2 : "#DBDBDB"}); 
                        this.setState({isReady: false}); }}
                      onBlur={() => {this.setState({bordercolor : "#DBDBDB"});}}
                      placeholder={'First name'}
                      placeholderTextColor={'#8D8D8D'}
                      underlineColorAndroid='transparent'
                      fontSize={16}
                      keyboardType={'default'}
                      onChangeText={txt => {
                        this.setState({first_name: txt})}}/>
                  </View>
                </View>
                <View style={{flex: 1,marginBottom: 20}}>
                  <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor1, width: '85%'}]}
                      onFocus={() => {this.setState({bordercolor1 : color});
                          this.setState({bordercolor2 : "#DBDBDB"});
                          this.setState({bordercolor : "#DBDBDB"}); 
                          this.setState({isReady: false})}}
                      placeholder={'Last name'}
                      placeholderTextColor={'#8D8D8D'}     
                      onBlur={() => {this.setState({bordercolor1 : "#DBDBDB"})}}
                      underlineColorAndroid='transparent'
                      keyboardType={'default'}
                      onChangeText={txt => {
                        this.setState({last_name: txt})}}/>
                  </View>
                </View>

                <View style={{flex: 1,marginBottom: 20}}>
                  <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor1, width: '85%'}]}
                      onFocus={() => {this.setState({bordercolor1 : color});
                          this.setState({bordercolor2 : "#DBDBDB"});
                          this.setState({bordercolor : "#DBDBDB"}); 
                          this.setState({isReady: false})}}
                      placeholder={'Age'}
                      placeholderTextColor={'#8D8D8D'}     
                      onBlur={() => {this.setState({bordercolor1 : "#DBDBDB"})}}
                      underlineColorAndroid='transparent'
                      keyboardType={'numeric'}
                      onChangeText={txt => {
                        this.setState({age: txt})}}/>
                  </View>
                </View>
              <View style={{flex: 1, marginBottom: 20}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor2, width: '85%'}]}
                      onFocus={() =>{this.setState({bordercolor2 : color});
                        this.setState({bordercolor1 : "#DBDBDB"});
                        this.setState({bordercolor : "#DBDBDB"}); 
                        this.setState({isReady: false})}}
                      onBlur={() => {this.setState({bordercolor2 : "#DBDBDB"})}}
                      placeholder={'Phone number'}
                      placeholderTextColor={'#8D8D8D'}
                      underlineColorAndroid='transparent'
                      keyboardType={'numeric'}
                      onChangeText={txt => {
                        this.setState({phone_no: txt.split(' ')[0]})
                        console.log('after : ' + this.state.phone_no)}}/>
                  </View>
                </View>
              </View >

              <View style={{flex: 1, flexDirection: 'row', marginRight: 20, marginLeft: 15}}>
                <View style={{flex: 1}}>
                  <Text style={{height: 45, alignSelf: 'flex-start',
                    paddingRight: 10, paddingLeft: 10, marginTop: 10, fontSize: 15}}>Send by </Text>
                </View> 
                <View style={{flex: 2, height: 45, borderRadius: 25,
                      paddingLeft: 10, width: 30,
                      backgroundColor: 'rgba(0,0,0,0.05)', color: '#000000'}}>
                  <Picker
                    selectedValue={this.state.sendigType}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) =>{
                      this.setState({sendigType: itemValue})
                      if(itemValue == 'interval') this.setState({showInputInterval: true})
                      else {this.setState({showInputInterval: false})}
                    }}>
                    <Picker.Item label="interval" value="interval"/>
                    <Picker.Item label="speed" value="speed"/>
                  </Picker>
                </View>
                {this.state.showInputInterval? 
                <View style={{flex: 1}}>
                  <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor3}]}
                      onFocus={() =>{this.setState({bordercolor3 : color});
                        this.setState({bordercolor1 : "#DBDBDB"});
                        this.setState({bordercolor2 : "#DBDBDB"});
                        this.setState({bordercolor : "#DBDBDB"}); 
                        this.setState({isReady: false})}}
                      onBlur={() => {this.setState({bordercolor3 : "#DBDBDB"})}}
                      placeholder={'20'}
                      placeholderTextColor={'#8D8D8D'}
                      underlineColorAndroid='transparent'
                      keyboardType={'numeric'}
                      onChangeText={txt => { console.log('in add person for adding interval : ', txt);
                        this.setState({interval: parseInt(txt)})}}/>
                </View> : null}
              </View>             

              <View style={{flex: 1, flexDirection: 'row', marginRight: 20, marginLeft: 15}}>
                <View style={{flex: 1}}>
                  <Text style={{height: 45, alignSelf: 'flex-start',
                    paddingRight: 10, paddingLeft: 10, marginTop: 10, fontSize: 15}}>Line color </Text>
                </View> 
                <View style={{flex: 2, height: 45, borderRadius: 25,
                      paddingLeft: 10, width: 30,
                      backgroundColor: 'rgba(0,0,0,0.05)', color: '#000000'}}>
                <Picker
                  selectedValue={this.state.color}
                  mode={'dropdown'}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({color: itemValue})
                  }>
                  <Picker.Item label="Blue" value="blue"/>
                  <Picker.Item label="Green" value="green"/>
                  <Picker.Item label="Gray" value="gray"/>
                  <Picker.Item label="Purple" value="purple"/>
                  <Picker.Item label="Red" value="red"/>
                  <Picker.Item label="Yellow" value="yellow"/>
                  <Picker.Item label="Orange" value="orange"/>
                </Picker>
                </View>
              </View> 
            <View>

                  <Modal
                    animationType="fade"
                    transparent={true}
                    presentationStyle={"overFullScreen"}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      alert('Modal has been closed.');
                      this.setModalVisible(false);
                    }}>
                    <View style={{backgroundColor: "rgba(255,255,255,0.4)",
                      justifyContent: "center",
                      flex: 1, alignItems: 'center',}}>
                      <View style={{marginTop: 150}}>
                        <ActivityIndicator size="large" color="#0000ff" /> 
                        <TouchableHighlight
                          style={{margin: 30, backgroundColor: "rgba(255,255,255,0.4)",
                          justifyContent: "center", alignItems: 'center',}}
                          onPress={() => {
                            this.setModalVisible(false);
                          }}>
                          <Text>cancel ?</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>
                </View>

              <View style={{flex: 1, marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <TouchableOpacity style={[styles.btn,{marginTop: 10, marginRight: 20, marginLeft: 30}]}>
                    <Image source={this.state.isReady ? (this.state.error ? ImageOptions[0]: ImageOptions[1]): null}
                        style={{height: 30, width: 30}} />
                  </TouchableOpacity> 
                </View>
                    
                <View style={{flex: 4}}>
                  <Text style={[{marginTop: 20,}]}> {this.state.isReady ? this.state.message : null} </Text>
                </View>
              </View>

              <View style={{flex: 1}}>
                  <TouchableOpacity style={[style.btn,{alignSelf:'center', width: 100, 
                    height: 40, marginTop: 10, marginRight: 20, backgroundColor: color}]}
                    onPress={this.AddButtonPress.bind(this)}>
                    <Text style={{color: '#ffffff'}}>save</Text>
                  </TouchableOpacity> 
                </View>
            </View>
        </ScrollView>
     </View>
        );
    }
}

const style = StyleSheet.create({
  MainContainer :{
  // Setting up View inside content in Vertically center.
    justifyContent: 'center',
    flex:1,
    margin: 10,
    marginTop: 40
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    position: 'absolute',
    width: 45,
    backgroundColor: '#ffffff',
  },
  avatarContainer:{
    backgroundColor: color,
    height:110,
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: color,
    marginBottom:10,
    alignSelf: "center",
    backgroundColor: color,
    marginTop:20
  },
  labelStyle: {
    marginLeft: 15,
    marginTop: 10,
   // color: color,
  },
  btn:{
    height: 45,
    borderRadius: 25,
    color: color,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
    marginRight: 7, 
  },

});