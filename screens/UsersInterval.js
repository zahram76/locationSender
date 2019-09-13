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
import SQLite from "react-native-sqlite-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SmsListener from 'react-native-android-sms-listener';
import SmsAndroid from 'react-native-get-sms-android';
import {styles} from '../style.js';
var RNFS = require('react-native-fs');

const color = '#349e9f';
const ImageOptions = [
  require('../asset/error.png'),
  require('../asset/verified.png')
]

export default class AccountSetting extends Component {
constructor(){
    super();
    this.state =  {
       showInputInterval: false,
       sendingType: 'speed',
       interval: 20,
       modalVisible: false,
       phone_no: '',
       isReady: false,
       error: false, 
       message: '',
       iscompelet: false,
   };
   flagIsRepeat = true;
   this.user_id;  
   this.sendingType; 
   this.interval;
   this.phone_no;
}

init(){
  console.log(' init profile');
  var a = [];
  var image = null ;
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
  DB.transaction((tx) => {
    console.log("execute transaction");
      tx.executeSql('select user_id, phone_no, sending_setting, interval from TrackingUsers where user_id=? ', [this.user_id], (tx, results) => {
            console.log('Results', results.rows.length);
            if (results.rows.length > 0) {
                console.log('Resultsss', JSON.stringify(results.rows.item(0)));
                  this.setState({
                    sendingType: results.rows.item(0).sending_setting,
                    interval: results.rows.item(0).interval,
                    showInputInterval: results.rows.item(0).sending_setting=='interval'?true: false,
                    phone_no: results.rows.item(0).phone_no
                  })
                  this.sendingType = results.rows.item(0).sending_setting
                  this.interval= results.rows.item(0).interval,
                  this.phone_no= results.rows.item(0).phone_no
                  console.log(' in init : ', this.state.phone_no)
                  this.setState({iscompelet : true})
              console.log('Success'+'\n'+'select users Successfully');
            } else {
              console.log('no user');
            }  
      })
  });
});
}

updateUserInterval(sending_type, interval, user_id){
    SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('update TrackingUsers set sending_setting=?, interval=? where user_id=?',
         [sending_type ,interval ,user_id], 
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('user account update : ' + results.rowsAffected)
                this.setState({message: 'Success'+'\n'+'Your account update Successfully'}); 
                this.setState({modalVisible: false})
                this.setState({error: false});
                this.setState({isReady: true});
              } else { console.log('can not find map type setting ') }  
        });
    });
    });
}

componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log('in TrackingUserSettings  navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        JSON.parse(str, (key,value) => {
          if(key == 'user_id'){ 
            this.user_id = value;
            this.init();
        }
          console.log(value);
        })  
      } else { console.log( ' is nul ')}
    });
    SmsListener.addListener(message => this.parseMessage(message));
}

SendButtonPress(){
    if(this.state.sendingType == this.sendingType && this.sendingType == 'speed'){
        this.setState({message: 'No change'}); 
        this.setState({error: false});
        this.setState({isReady: true});
    } else if (this.state.sendingType == this.sendingType
         && this.sendingType == 'interval' && this.state.interval == this.interval){
        this.setState({message: 'No change'}); 
        this.setState({error: false});
        this.setState({isReady: true});
    } else {
        this.setState({modalVisible: true})
        this.sendsms(this.state.phone_no)
    }
}

parseMessage(message){ 
    console.log('in parse message for interval')
    const res = message.body.split(' ');
    console.log(' message', res)
    if (res[0] == 'hello' && res[1] == 'got' && res[2] == 'interval'){
      console.log(' interval setting ok');
      this.updateUserInterval(this.state.sendingType, this.state.interval, this.user_id)
    } else console.log(' interval setting not ok')
}

sendsms(phoneNumber){ 
    console.log('in send by sms in set interval', phoneNumber )
     message = 'hello update sendingType:' + this.state.sendingType + ' interval:' + this.state.interval;
     SmsAndroid.autoSend(phoneNumber, message, (fail) => {
         console.log("Failed with this error: " + fail)
     }, (success) => {
         console.log("SMS sent successfully" + success);
     });
}

render(){
return (  
  <View style={styles.scrolStyle}>
    {this.state.iscompelet ? 
    <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
      
        <View style={{flex: 1, flexDirection: 'row', marginRight: 20, marginLeft: 15, marginTop: 60}}>
        <View style={{flex: 1}}>
            <Text style={{height: 45, alignSelf: 'flex-start',
            paddingRight: 10, paddingLeft: 10, marginTop: 10, fontSize: 15}}>Send by </Text>
        </View> 
        <View style={{flex: 2, height: 45, borderRadius: 25,
                paddingLeft: 10, width: 30,
                backgroundColor: 'rgba(0,0,0,0.05)', color: '#000000'}}>
            <Picker
            selectedValue={this.state.sendingType}
            mode={'dropdown'}
            onValueChange={(itemValue, itemIndex) =>{
                if(this.state.sendingType == itemValue)
                    this.repeat = true
                else {
                    this.setState({sendingType: itemValue})
                    if(itemValue == 'interval') this.setState({showInputInterval: true})
                    else {this.setState({showInputInterval: false})}
                    this.repeat = false
                }  
            }}>
            <Picker.Item label="interval" value="interval"/>
            <Picker.Item label="speed" value="speed"/>
            </Picker>
        </View>
        {this.state.showInputInterval?
        <View style={{flex: 1}}>
            <TextInput 
                style={[styles.addinput,{borderBottomColor : this.state.bordercolor}]}
                onFocus={() =>{this.setState({bordercolor : color});}}
                onBlur={() => {this.setState({bordercolor : "#DBDBDB"});
                //this.changeInterval(parseInt(this.text), true);
                //console.log('call change interval ', true)
              }}
                placeholder={'20'}
                placeholderTextColor={'#8D8D8D'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                onChangeText={txt => { console.log('in flat list for adding interval : ', txt);
                    if(parseInt(txt) != this.state.interval){
                        this.setState({interval: parseInt(txt)})
                        this.repeat = false
                    }
                    else this.repeat = true}}/>
        </View> : null}
        </View> 

                <Modal
                    animationType="fade"
                    transparent={true}
                    presentationStyle={"overFullScreen"}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      alert('Modal has been closed.');
                      this.setState({modalVisible: false})
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
                            this.setState({modalVisible: false})
                          }}>
                          <Text>cancel ?</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>

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
                  <TouchableOpacity style={[styles.btn,{alignSelf:'center', width: 100, 
                    height: 40, marginTop: 10, marginRight: 20, backgroundColor: color}]}
                    onPress={this.SendButtonPress.bind(this)}>
                    <Text style={{color: '#ffffff'}}>save</Text>
                  </TouchableOpacity> 
                </View>
        </ScrollView>
        : null }
     </View>
    );
}
}

const style = StyleSheet.create({
  MainContainer :{
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
  btn1:{
    borderRadius: 15,
    //color: color,
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
    marginRight: 7, 
    backgroundColor: '#ffffff',
    borderColor: color, 
    borderWidth: 1
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
    color: '#000000',
  }

});









