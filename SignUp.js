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
//import styles from './style.js';

const {width : WIDTH} = Dimensions.get('window'); 
const {height : HEIGHT} = Dimensions.get('window'); 

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state={
            showPass: true,
            press: false,
        };
    }

    showPass = () => {
        if(this.state.press == false){
          this.setState({showPass:false, press:true});
        } else {
          this.setState({showPass:true, press:false});
        }
      }

    render() {
        return ( 
          <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <ImageBackground source={require('./images/background.png')} style={styles.backcontainer}> 
                <View style={styles.logoContainer}>
                  <Image source={require('./images/logo.png')} style={styles.logo}/>
                </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={18} color={'gray'}
                      style={styles.inputIcon}/>
                    <TextInput 
                      style={styles.input}
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
                  <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btnLogin}
                      onPress={()=> this.props.navigation.navigate('Map')}>
                      <Text style={styles.text}>SIGN IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnLogin}
                      onPress={()=> this.props.navigation.navigate('Map')}>
                      <Text style={styles.text}>SIGN UP</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image source={require('./images/gmother.png')} style={styles.grandmother}/>
                    <Image source={require('./images/gfather.png')} style={styles.grandfather}/>
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
        marginTop: 60,
        justifyContent: "flex-end",
        flexDirection: "row-reverse",
        alignContent: "space-between",
      },
      grandmother: {
        marginTop: 26,
        width: 150,
        height: 225,
        position: "relative",
      },
      grandfather: {
        width: 170,
        height: 255,
        position: "relative",
      },
});
