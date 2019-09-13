import React, {Component} from 'react';  
import {Image, StyleSheet, Text, View, Animated, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";  
import SQLite from "react-native-sqlite-storage";
import {deleteUser} from './deleteUser.js';
import {styles} from '../style.js';

const color = '#349e9f';

export default class FlatListComponent extends Component {  
  constructor(){
      super()
      this.state = {
        FlatListItems: [],
        users: [],
        isReady: false,
      }
      this.init();
  }

  removePeople(str) {
    console.log('ini remove people '+JSON.stringify(this.state.FlatListItems))
    var array = [...this.state.FlatListItems]; // make a separate copy of the array
    var index = -1;
    for(let i=0; i<array.length; ++i){
      if(array[i].key == str)
        index = i;
    }
    console.log('index '+ index)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({FlatListItems: array});
      console.log('after remove people '+JSON.stringify(this.state.FlatListItems))
    }
  }

  DeleteButton(str){
    if (str == ''){
      alert("Please fill in the blanks!")
    } else {
      console.log('delete user by phone : '+ str);
      deleteUser(str);
      console.log(JSON.stringify(this.state.FlatListItems))
      this.removePeople(str);
      //console.log(JSON.stringify(this.state.FlatListItems))
    }
  }

  init(){
    console.log(' init flat list');
    var a = [];
    var image = null ;
    SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('select phone_no, user_id, first_name, last_name from TrackingUsers ', [], (tx, results) => {
              console.log('Results', results.rows.length);
              if (results.rows.length > 0) {
                
                for(let i=0; i<results.rows.length; ++i){
                  console.log('Resultsss', JSON.stringify(results.rows.item(i)));
                    a.push({
                        user_id : results.rows.item(i).user_id,
                        key : results.rows.item(i).phone_no,
                        first_name : results.rows.item(i).first_name,
                        last_name : results.rows.item(i).last_name,
                        image: {uri: 'asset:/images/defaultProfile.png'}
                    });
                } 
                console.log('select users to flat list Successfully' + JSON.stringify(this.state.FlatListItems));
              } else { console.log('no user'); }  
        });
        tx.executeSql('select user_image from TrackingUsers', [], (tx, results) => {
          console.log('Results', results.rows.length);
          if (results.rows.length > 0) {
            var b = a;
            for(let j=0; j<results.rows.length; ++j){
              console.log(results.rows.item(j).user_image)
              JSON.parse(results.rows.item(j).user_image, (key,value) => {
                if(key == 'uri') 
                  image = {uri : value}
                else if (key == 'require')
                  image = {uri: 'asset:/images/defaultProfile.png'}
              });
              b[j].image = image; 
              console.log('select images to flat list Successfully ' + image);
            }
            this.setState({FlatListItems: b})
          } else { console.log('can not get image'); }  
        })
    });
  });
}

componentDidMount(){
  const { navigation } = this.props;
  this.focusListener = navigation.addListener('didFocus', () => {
    this.init()
    if(this.props.navigation.state.params != null){
    //   console.log('in flat list  navigation param : ' + JSON.stringify(this.props.navigation.state.params));
    //   const str = JSON.stringify(this.props.navigation.state.params);
    //   JSON.parse(str, (key,value) => {
    //     if(key == 'name' && value == 'TrackingUserSettings'){ this.init();}
    //     console.log(value);
    //   })  
     
     } else { console.log( ' is nul ')}
  });
}

FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#DBDBDB"}}/>);
  }

  static navigationOptions = ({ navigation }) => {
    return {
        title: 'Users',
        headerStyle: {
          backgroundColor: color,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: (
          <View style={{marginLeft: 15}}>
            <MaterialCommunityIcons name={'arrow-left'} size={25} style={{color: 'white'}}
              onPress={ () => { navigation.navigate('Profile') }} />
            </View>
        ),
      }
    }

  render() {  
   return (  
    <View style={style.MainContainer}>
    <FlatList
      data={ this.state.FlatListItems }   
      ItemSeparatorComponent = {this.FlatListItemSeparator}
      renderItem={({item}) => 
      <TouchableOpacity onPress={() => this.props.navigation.navigate("TrackingUserSettings",{user_id: item.user_id})}>
      <View key={String(item.key).split(' ')[0]} style={style.container}>
          <View style={{flex: 1}}>
              <Image source={item.image} style={style.photo}/>
          </View>
          <View style={style.container_text}>
            <Text style={style.title}>{item.first_name} {item.last_name}</Text>
            <Text style={style.description}>{item.key}</Text>
          </View>
          <View style={{flex: 1, alignSelf: 'center'}}>
            <TouchableOpacity onPress={() =>{
              this.setState({delete_phone_no: String(item.key)})
              console.log('delete phone number: '+this.state.delete_phone_no)
              this.DeleteButton(String(item.key))
              }}>
                <MaterialCommunityIcons size={25} name={'account-minus'} style={style.iconImage}/>
            </TouchableOpacity>
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
    flex: 2,
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
});
