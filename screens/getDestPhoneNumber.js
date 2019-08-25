import React, {Component} from "react";
import {
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    TextInput,
    Image,
    ScrollView,
    Modal,
    TouchableHighlight,
    ActivityIndicator,
} from "react-native";
import { CheckBox } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-community/async-storage';
import SmsAndroid  from 'react-native-get-sms-android';
import SmsListener from 'react-native-android-sms-listener';
import {styles} from '../style.js';

export default class getDestPhone extends Component {
    constructor(props) {
        super(props);
        this.state={
            imageLogo: require('../images/logo1.png'),
            phone: '',
            pickerData: '',
            myCountryPicker: '',
            loading: false,
            modalVisible: false,
            answer: '',
          };
    }

      setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }
        
  parseMessage(message){ 
    var a = message.originatingAddress.split(' ')
    var b = this.state.phone.split(' ')
    var n = a[0].localeCompare(b[0]);

    if(n == 0){ 
      const res = message.body.split(' ');
      console.log('res' +  res)
      if (res[0] == 'hello' && res[1] == 'enter'){
          if(res[2] == 'yes'){
            this.setState({answer: res[2]})
            this.setState({modalVisible: false})
            this.props.navigation.navigate('Map') 
            console.log('yes ')
          } else {
            this.setState({answer: 'no'})
            alert("I can't enter");
          }
    }}
  }

    componentDidMount() {
      SmsListener.addListener(message => {
        this.parseMessage(message);
      });
    }
    
    sendsms(){
      phoneNumber = this.state.phone;
      message = 'hello can i access to your location?';
      this.setState({message : message});
      SmsAndroid.autoSend(phoneNumber, message, (fail) => {
          console.log("Failed with this error: " + fail)
      }, (success) => {
          console.log("SMS sent successfully" + success);
          this.setState({modalVisible: true});
      });
    }

    getPhoneOnPress(){
      if (this.state.phone == ''){
        alert("Please fill the blanks!")
      } else {
        //alert(' Please wait while you receive your username and password. ')
        this.sendsms();
      }
    }

    render() {
        return ( 
          <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <ImageBackground source={require('../images/background.png')} style={styles.backcontainer}> 
                <View style={styles.logoContainer}>
                  <Image source={this.state.imageLogo} style={styles.logo}/>
                </View>
                  <View style={[styles.inputContainer, {marginTop: 30}]}>
                  <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.IconStyle}/>
                    <TextInput 
                      style={styles.TextInputStyle}
                      placeholder={'phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({phone: txt})}
                     />
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.ButtonStyle}
                      onPress={this.getPhoneOnPress.bind(this) }>
                      <Text style={styles.text}>Send</Text>
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
                    }}>
                    <View style={{marginTop: 22, backgroundColor: "rgba(255,255,255,0.4)",
                      justifyContent: "center",
                    flex: 1, alignItems: 'center',}}>
                      <View style={{marginTop: 100}}>
                        <ActivityIndicator size="large" color="#0000ff" /> 
                        <TouchableHighlight
                          style={{margin: 30, backgroundColor: "rgba(255,255,255,0.9)",
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

                  <View style={[styles.imageContainer, {marginTop: 70}]}>
                    <Image source={require('../images/gmother.png')} style={styles.grandmother}/>
                    <Image source={require('../images/gfather.png')} style={styles.grandfather}/>
                  </View>
                </ImageBackground>
              </ScrollView>
           </View>
        );
    }
}