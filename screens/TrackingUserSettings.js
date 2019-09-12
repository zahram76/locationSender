import React ,{ Component } from 'react';  
import {Image, StyleSheet, Text, View, Animated, FlatList, TouchableOpacity, Dimensions} from 'react-native';  
import SQLite from "react-native-sqlite-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons'
import { CheckBox } from 'react-native-elements';
import {styles} from '../style.js';
 
const color = '#349e9f';
SQLite.DEBUG(true);

export default class TrackingUserSettings extends Component {
constructor(){
    super();
    this.state =  {
        FlatListItems: [{
            key: 'Profile',
            name: 'Profile',
            screen: 'UsersProfile',
            checked: false, 
            icon_name: 'account-card-details-outline' //MaterialCommunityIcons
        },{
            key: 'Marker',
            name: 'Marker',
            screen: 'UsersMarker',
            checked: false,
            icon_name: "map-marker-radius", //MaterialCommunityIcons
        },{
            key: 'Interval',
            name: 'Interval',
            screen: 'UsersInterval',
            checked: false,
            icon_name: 'timer', //MaterialCommunityIcons
        },{
            key: 'History',
            name: 'History',
            screen: 'UsersHistory',
            checked: false,
            icon_name: 'history', //MaterialCommunityIcons
        }],
    }
    this.user_id;
}

FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#DBDBDB"}}/>);
  }

changeType(name){
   this.setState({maptype: name}); 
   console.log(' update map type setting');
   SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('update Settings set value=? where setting_name=?', [this.state.maptype,'mapType'], 
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('map type update : ' + results.rowsAffected)
              } else { console.log('can not find map type setting ') }  
        });
    });
   });
}

componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log('in TrackingUserSettings  navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        JSON.parse(str, (key,value) => {
          if(key == 'user_id'){ this.user_id = value}
          console.log(value);
        })  
      } else { console.log( ' is nul ')}
    });
}

render(){
return (  
  <View style={style.MainContainer}>
    <FlatList
      data={ this.state.FlatListItems }   
      ItemSeparatorComponent = {this.FlatListItemSeparator}
      renderItem={({item}) => 
      <TouchableOpacity onPress={()=> this.props.navigation.navigate(item.screen,{user_id: this.user_id})}>
      <View key={item.key} 
        style={style.itemContainer}>
          <View style={{flex: 1}}>
              <MaterialCommunityIcons name={item.icon_name} size={30} style={style.iconImage}/>
          </View>
          <View style={{ flex: 5, marginTop: 6, marginHorizontal: 10}}>
            <Text style={style.text}>{item.name}</Text>
          </View>
          <View style={{flex: 1, alignSelf: 'center'}}>
            <Icon name={'ios-arrow-forward'} size={20} style={style.iconImage} color={'gray'}/>
          </View>
      </View>
      </TouchableOpacity>
      }
    /> 
  </View>   
    );
}
}
    
const style = StyleSheet.create({
    MainContainer :{
      justifyContent: 'center',
      flexDirection: 'column',
      flex:1,
    },
  container: {
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      marginLeft:16,
      marginRight:16,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 5,
      backgroundColor: '#FFF',
      elevation: 2,
  },
  title: {
      fontSize: 16,
      color: '#000',
  },
  container_text: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 5,
      justifyContent: 'center',
  },
  description: {
      fontSize: 11,
      fontStyle: 'italic',
  },
  photo: {
      height: 55,
      width: 55,
      borderRadius: 30
  },
  iconImage: {alignSelf: 'center', alignContent: 'center'},
  selected: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft:16,
    marginRight:16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: "#ffffff",
    borderColor: 'green',
    borderWidth: 1    
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  itemContainer: {
    flex: 1, flexDirection: 'row', 
    backgroundColor: 'white', padding: 15,
    justifyContent: 'center'
  },
  userImage: {
    height: 55, width: 55, 
      borderRadius: 10, borderColor: '#ffffff', borderWidth: 2, alignSelf: 'center'
  },
  iconImage:{height: 30, width: 30, alignSelf: 'center', alignContent: 'center'}
  
  });