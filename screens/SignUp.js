import React, {Component} from "react";
import {StyleSheet,
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    Dimensions,
    TextInput,
    Image,
    ScrollView,
    Button} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-community/async-storage';
//import styles from './style.js';

const {width : WIDTH} = Dimensions.get('window'); 
const {height : HEIGHT} = Dimensions.get('window'); 

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state={
            showPass: true,
            press: false,
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
          const uname = AsyncStorage.getItem('username')
          alert(uname)
          if (this.state.username != uname){
            try {
              AsyncStorage.setItem('username', this.state.username)
              AsyncStorage.setItem('pasword', this.state.password)
              alert("you signed up! :))")
              this.props.navigation.navigate('Profile')
            } catch (e) {
              // saving error
              alert("can not to save item.");
            }
          } else {
            alert(":( This username is not available. ")
          }
        }
    }

    render() {
      // const { navigation } = this.props;
      // this.setState.username = navigation.getParam('username', '');
      // this.setState.password = navigation.getParam('password', '');
      // for get param from another page
        return ( 
          <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <ImageBackground source={require('../images/background.png')} style={styles.backcontainer}> 
                <View style={styles.logoContainer}>
                  <Image source={require('../images/logo.png')} style={styles.logo}/>
                </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      value={this.state.username}
                      placeholder={'Username'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={(txt => this.setState({username: txt}))}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
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
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'Re Password'}
                      secureTextEntry={this.state.showPass}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({rePassword: txt})}
                    />
                    <TouchableOpacity style={styles.btnEye}
                      onPress={this.showPass.bind(this)}>
                      <Icon name={this.state.press==false ? 'ios-eye' : 'ios-eye-off'} 
                        size={28} color={'gray'}/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'src phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({src_phone: txt})}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'md-phone-portrait'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
                      placeholder={'dest phone number'}
                      placeholderTextColor={'rgba(255,255,255,255)'}
                      underlineColorAndroid='transparent'
                      onChangeText={txt => this.setState({dest_phone: txt})}
                     />
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btnLogin}
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

const styles = StyleSheet.create({
    backcontainer:{
        flex: 1,
        alignItems: "center",
        width: null,
        height: null,
        justifyContent: "center",
        backgroundColor: '#ffffff',
      },
      scrolStyle: {
       flex: 1,
       backgroundColor: 'white',
      },
      inputContainer: {
        marginTop: 7
      },
      input: {
        width: WIDTH-55,
        height: 45,
        borderRadius: 25,
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(0,0,0,0.28)',
        color: 'rgba(255,255,255,0.7)',
        marginHorizontal: 25
      },
      inputIcon: {
        position: 'absolute',
        top: 14,
        left: 42
      },
      btnEye: {
        position: 'absolute',
        top: 10,
        right: 42
      },
      btnContainer:{
        flexDirection: "row",
      },
      btnLogin: { 
        width: WIDTH*(0.4),
        height: 45,
        borderRadius: 25,
        backgroundColor: '#16A085',
        justifyContent: "center",
        marginTop: 20,
        alignItems: "center",
        marginHorizontal: 7
      },
      text: {
        color: 'rgba(255,255,255,255)',
        fontSize: 16,
        textAlign: "center"
      },
      logo: {
        width: 100,
        height: 100
      },
      logoContainer: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 30
      },
      imageContainer: {
        marginTop: 10,
        justifyContent: "flex-end",
        flexDirection: "row-reverse",
        alignContent: "space-between",
      },
      grandmother: {
        marginTop: 26,
        width: 90,
        height: 165,
        position: "relative",
      },
      grandfather: {
        width: 110,
        height: 195,
        position: "relative",
      },
});
