import React, {Component} from "react";
import{AppRegistry,StyleSheet,View} from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import SignIn from './screens/SignIn.js';
import Map from './screens/Map.js';
import SignUp from './screens/SignUp.js';
import Profile from './screens/Profile.js';
import ForgotPass from './screens/ForgotPass.js';
import AuthLoadingScreen from './screens/AuthLoading.js';
import Icon from "react-native-vector-icons/Ionicons";
import { Button } from 'react-native-elements';


const AppStack = createStackNavigator({
  Map: {
    screen: Map,
    navigationOptions: {
      title: 'Map',
      headerStyle: {
        backgroundColor: '#16A085',
        barStyle: "light-content", // or directly
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <View style={{
          flexDirection: "row-reverse",
          }}>
            
        <Button
         icon={<Icon name={'ios-menu'} size={25} color={'white'} 
          style={{
            paddingLeft: 5,
            paddingRight: 5,
          }}/>
        }
          onPress={() => alert('This is a button!')}
          type="clear"
        />
        <Button
         icon={<Icon name={'ios-person-add'} size={24} color={'white'}
          style={{
            paddingLeft: 5,
            paddingRight: 5,
          }}
        />}
          onPress={() => alert('This is a button!')}
          type="clear"
        />
        </View>
      ),
    },
   // icon={<Icon name={'ios-menu'} size={25} color={'white'}/>}
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
      headerStyle: {
        backgroundColor: '#16A085',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
   },
});
const AuthStack = createStackNavigator({ 
  SignIn: { screen: SignIn ,
    navigationOptions: {
      header: null, //this will hide the header
    },
  },
  SignUp: { screen: SignUp ,
    navigationOptions: {
      header: null,
    },
  },
  ForgotPass: { screen: ForgotPass ,
    navigationOptions: {
      title: 'ForgotPass',
    },
  },
 });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

const styles = StyleSheet.create({
  menuBtnStyle: {
    marginHorizontal: 10,
  }
});

//AppRegistry.registerHeadlessTask('backgroundTask', () => require('backgroundTask'));
AppRegistry.registerComponent('sender', () => App);