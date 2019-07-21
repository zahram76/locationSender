import{AppRegistry} from "react-native";
import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import Home from './Home.js';
import Map from './Map.js';
import SignUp from './SignUp.js';

const AppNavigator = createStackNavigator({
  Home: { screen: Home ,
    navigationOptions: {
      header: null, //this will hide the header
    },
  },
  SignUp: { screen: SignUp ,
    navigationOptions: {
      header: null,
    },
  },
  Map: { screen: Map,
    navigationOptions: {
      title: 'Map',
    },
  },
});

const App = createAppContainer(AppNavigator);
export default App;
AppRegistry.registerComponent('sender', () => App);

