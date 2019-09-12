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
import AddNewPerson from './screens/AddNewPerson';
import FlatListComponent from './screens/FlatList.js'
import AccountSetting from './screens/AccountSetting.js';
import MapSetting from './screens/MapSetting.js';
import UsersProfile from './screens/UsersProfile.js';
import UsersMarker from './screens/UsersMarker.js';
import UsersInterval from './screens/UsersInterval.js';
import UsersHistory from './screens/UsersHistory.js';
import TrackingUserSettings from './screens/TrackingUserSettings.js';
import getDestPhone from './screens/getDestPhoneNumber';
import ImageResizer from "react-native-image-resizer";


const color = '#028687';
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

const AppStack = createStackNavigator({
  Map: {
    screen: Map,
  },
  Profile: {
    screen: Profile,  
   },
  AccountSetting: {
    screen: AccountSetting,  
   },
   TrackingUserSettings:{
    screen: TrackingUserSettings,
    navigationOptions: {
      title: 'Tracking User Settings',
      headerStyle: {
        backgroundColor: color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
   },
   UsersHistory:{
    screen: UsersHistory,
    navigationOptions: {
      title: 'History',
      headerStyle: {
        backgroundColor: color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
   },
   UsersInterval: {
    screen: UsersInterval,
    navigationOptions: {
      title: 'Sending Setting',
      headerStyle: {
        backgroundColor: color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
  UsersMarker: {
    screen: UsersMarker,
    navigationOptions: {
      title: 'User Marker',
      headerStyle: {
        backgroundColor: color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
  UsersProfile: {
    screen: UsersProfile,
    navigationOptions: {
      title: 'User Profile',
      headerStyle: {
        backgroundColor: color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
  MapSetting: {
    screen: MapSetting,
    navigationOptions: {
      title: 'Map Setting',
      headerStyle: {
        backgroundColor: color,
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
        backgroundColor: color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
   },
  FlatListComponent: {
    screen: FlatListComponent,
    
  },
   AddPerson: {
    screen: AddNewPerson,
   }
},
{
  // contentComponent: CustomeDrawerComponent,
  // drawerPosition: 'Right',
  // drawerLockMode: 'unlocked',
}
);

const AuthStack = createStackNavigator({ 
  SignIn: { 
    screen: SignIn ,
    navigationOptions: {
    header: null, //this will hide the header
    },
  },
  SignUp: { 
    screen: SignUp ,
    navigationOptions: {
    header: null, //this will hide the header
    },
  },
  ForgotPass: { 
    screen: ForgotPass ,
    navigationOptions: {
    title: 'ForgotPass',
    },
  },
 });

const AuthLoading = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
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
