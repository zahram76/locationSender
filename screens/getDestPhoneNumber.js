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
import { CheckBox } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-community/async-storage';
import SmsAndroid  from 'react-native-get-sms-android';
// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
//import PhoneInput from 'react-native-phone-input';
//import CountryCodeList from 'react-native-country-code-list'
import {styles} from '../style.js';

export default class getDestPhone extends Component {
    constructor(props) {
        super(props);
        this.state={
            imageLogo: require('../images/logo1.png'),
            phone: '',
            pickerData: '',
            myCountryPicker: '',
          };
    }

    sendsms(){
        phoneNumber = this.state.phone;
        message = 'hello can i access to your location?';
        this.setState({message : message});
        SmsAndroid.autoSend(phoneNumber, message, (fail) => {
            console.log("Failed with this error: " + fail)
        }, (success) => {
            console.log("SMS sent successfully" + success);
        });
      }

    isValid(str){
        
    }

    getPhoneOnPress(){
      if (this.state.phone == ''){
        alert("Please fill the blanks!")
      } else {
        alert(' Please wait while you receive your username and password. ')
        this.sendsms();
        this.props.navigation.navigate('SignIn')
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
                      <Text style={styles.text}>send sms</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.imageContainer, {marginTop: 100}]}>
                    <Image source={require('../images/gmother.png')} style={styles.grandmother}/>
                    <Image source={require('../images/gfather.png')} style={styles.grandfather}/>
                  </View>
                </ImageBackground>
              </ScrollView>
           </View>
        );
    }
}

