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

  render() {
    var bgColor = '#DCE3F4';
    return (
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
     
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
      <View style={styles.btnView}>
          <TouchableOpacity style={styles.button}
              onPress={()=> this.props.navigation.navigate('Map')}>
                  <Text style={styles.text}> Map </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
              onPress={()=> {
                   AsyncStorage.clear()
                  this.props.navigation.navigate('Auth')
                 }}>
                  <Text style={styles.text}> sign out </Text>
          </TouchableOpacity> 
      </View>
    </View>
    );
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
