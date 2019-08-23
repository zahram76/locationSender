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
import {styles} from '../style.js';

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state={
            imageLogo: require('../images/logo1.png'),
            showPass: true,
            press: false,
            TextInput_Username: '',
            TextInput_Pass: '',
            username: '',     
            password: ''  ,
            checked: true
          };
    }

    showPass = () => {
        if(this.state.press == false){
          this.setState({showPass:false, press:true});
        } else {
          this.setState({showPass:true, press:false});
        }
      }

    signInOnPress() {
        if (this.state.TextInput_Username == ''
        || this.state.TextInput_Pass == ''){
          alert("Please fill the blanks!")
      } else {
          if(this.state.checked == true){
            try {
              AsyncStorage.setItem('username', this.state.TextInput_Username)// ba this.state.username kar nemikone
            }
            catch(e){
              alert(e)
            }
          }
          this.props.navigation.navigate('App')       
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
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      onChangeText={txt => {
                        this.setState({ TextInput_Username: txt });
                      }}
                      placeholder={'Username'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'Password'}
                      onChangeText={txt => {
                        this.setState({ TextInput_Pass: txt });
                      }}
                      secureTextEntry={this.state.showPass}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                    />
                    <TouchableOpacity style={styles.btnEye}
                      onPress={this.showPass.bind(this)}>
                      <Icon name={this.state.press==false ? 'ios-eye' : 'ios-eye-off'} 
                        size={28} color={'gray'}/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.checkboxContainer}>
                  <CheckBox
                    title='Do you want to save this session ?'
                    checked={this.state.checked}
                    checkedColor='#16A085'
                    containerStyle={styles.checkboxContainer}
                    onIconPress={() => this.setState({checked: !this.state.checked})}
                    onPress={() => this.setState({checked: !this.state.checked})}
                    />
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btnLogin}
                      onPress={this.signInOnPress.bind(this) }>
                      <Text style={styles.text}>SIGN IN</Text>
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

