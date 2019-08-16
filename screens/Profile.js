import React from "react";
import {StyleSheet,
  View, 
  Text, 
  Button,
  Image,
  Alert,
TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import SettingsList from 'react-native-settings-list';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from "react-native-vector-icons/Ionicons";

export default class Profile  extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const data = navigation.getParam('saveSession', true);    
    this.onValueChange = this.onValueChange.bind(this);
    this.state ={
        saveSession : data,
        switchValue: false
    };
  }
  
  _menu = null;

  render() {
    var bgColor = '#DCE3F4';
    return (     
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          <SettingsList.Item
            icon={
                <Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>
            }
            hasSwitch={true}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title='Background Geo'
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='Accountt'
            titleInfo=' '
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => Alert.alert('Route to add account Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='Markers'
            titleInfo=' '
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => Alert.alert('Route to markers Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='Distance filter'
            onPress={() => Alert.alert('Route To distance filter Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='Map'
            titleInfo=' '
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => Alert.alert('Route To map setting Page')}
          />
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='Notifications'
            onPress={() => Alert.alert('Route To Notifications Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='Theme'
            onPress={() => Alert.alert('Route To Theme Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cartoon-marker-48.png')}/>}
            title='General setting'
            onPress={() => Alert.alert('Route To Do Not Disturb Page')}
          />
        </SettingsList>
      </View>
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
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
            <Menu
                ref={(ref) => this._menu = ref}
                button={<TouchableOpacity onPress={() => this._menu.show()} 
                  style={{paddingHorizontal:16, height: '100%', alignItems:'center', 
                  justifyContent: 'center'}}>
                    <Icon name={'ios-menu'} size={25} color={'white'} 
                    style={{alignSelf:'center'}} resizeMode='contain'/></TouchableOpacity>}
            >
                <MenuItem onPress={() => {
                  this._menu.hide()
                  navigation.navigate('Map')
                  }} textStyle={{color: '#000',fontSize: 16}} >Map</MenuItem>
                <MenuItem onPress={() => {
                  this._menu.hide()
                  }} textStyle={{ fontSize: 16}} disabled>Setting</MenuItem>
                <MenuItem  onPress={() =>{
                  this._menu.hide()
                  navigation.navigate('database')
                  }} textStyle={{color: '#000',fontSize: 16}}>Database</MenuItem>
                <MenuItem onPress={() =>{
                  this._menu.hide()
                  navigation.navigate('Auth')
                  }}  textStyle={{color: '#000', fontSize: 16}}>Sign out</MenuItem>
            </Menu>
          </View>
        ),
      }
    }

  onValueChange(value){
    this.setState({switchValue: value});
  }
}

const styles = StyleSheet.create({
    button: { 
        width: 100,
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
      btnView: {
       // marginTop: 10,
        marginBottom: 20,
        justifyContent: "center",
        flexDirection: "row-reverse",
        alignContent: "space-between",
      }
});
