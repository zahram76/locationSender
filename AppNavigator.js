import {
    createStackNavigator,
    createAppContainer
  } from 'react-navigation';
import Login from './Login';
import ShowOnMap from './ShowOnMap';

const AppNavigator = createStackNavigator({
    Login: { screen: Login },
    ShowOnMap: { screen: ShowOnMap},
  });


export default AppNavigator;
