import React, {Component} from "react";
import{
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  DrawerItems,
} from 'react-navigation';
import SignIn from './screens/SignIn.js';
import Map from './screens/Map.js';
import SignUp from './screens/SignUp.js';
import Profile from './screens/Profile.js';
import ForgotPass from './screens/ForgotPass.js';
import AuthLoadingScreen from './screens/AuthLoading.js';
import database from './screens/database.js';
import AddPerson from './screens/AddNewPerson';


// const AppDrawerNavigator = createDrawerNavigator({
//   Map: { screen: Map },
//   Profile: { screen: Profile },
//   database: { screen: database },
// },
//   {
//     contentComponent: CustomeDrawerComponent
//   })

const CustomeDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{
        height: 150, 
        backgroundColor: 'white', 
        alignItems: 'center', 
        justifyContent: 'center'}}>
      <Image source={require('./images/logo.png')} 
        style={{height: 120, width: 120, borderRadius: 20}}/>
    </View>
    <ScrollView>
      <DrawerItems {...props}/>
    </ScrollView>
  </SafeAreaView>
)

const AppDrawerNavigator = createStackNavigator({
  Map: {
    screen: Map,
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
   database: {
    screen: database,
    navigationOptions: {
      title: 'Database',
      headerStyle: {
        backgroundColor: '#16A085',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
   },
   AddPerson: {
    screen: AddPerson,
    navigationOptions: {
      title: 'Add Person',
      headerStyle: {
        backgroundColor: '#16A085',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
   }
},
// {
//   contentComponent: CustomeDrawerComponent,
//   drawerPosition: 'Right',
//   drawerLockMode: 'unlocked',
// }
);

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

const AuthLoading = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppDrawerNavigator,
    Auth: AuthStack,
    
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends Component {
  render(){
    return(
      <AuthLoading>
         
      </AuthLoading>
     
    )
  }
}

const styles = StyleSheet.create({
  menuBtnStyle: {
    marginHorizontal: 10,
  }
});

AppRegistry.registerComponent('sender', () => App);