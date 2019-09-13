import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList} from "react-native";
import SQLite from "react-native-sqlite-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {deleteLacationByTime} from '../functions/deleteLocation.js';

const color = '#349e9f';

export default class History extends Component {
  constructor(){
    super();
    this.state = {
      FlatListItems: []
    }
    this.user_id;
  }
//-------------------------------------------------------------------------------------------
FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#DBDBDB"}}/>);
  }
//-------------------------------------------------------------------------------------------
locationDataInit(){
  var lastDate = '';
  var a = []
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
        console.log("execute transaction", this.user_id);
          tx.executeSql('select * from Locations', [], (tx, results) => {
                console.log('Results', results.rows.item(0).latitude);
                if (results.rows.length > 0) {
                  for(let i=0; i<results.rows.length; ++i){  
                    var date = results.rows.item(i).datatime.split(' ')[0]
                    if(date != lastDate){
                      a.push({
                        key: `date_${i}`,
                        datetime: results.rows.item(i).datatime,
                        date: date
                      })
                      lastDate = date
                    }  
                  }
                  this.setState({FlatListItems: a})
                  console.log('Resultsss', JSON.stringify(this.state.FlatListItems));
                  console.log('select location to flat list Successfully');
                } else { console.log('no location'); }  
          });
        }); 
    });   
}
//-------------------------------------------------------------------------------------------
componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log('in TrackingUserSettings  navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        JSON.parse(str, (key,value) => {
          if(key == 'user_id'){ 
            this.user_id = value;
            this.locationDataInit();
        }
          console.log(value);
        })  
      } else { console.log( ' is nul ')} 
    });
}
//-------------------------------------------------------------------------------------------
deletHistoryByTime = (item) => {
    deleteLacationByTime(item.date, this.user_id);
    const index = this.state.FlatListItems.findIndex(
        data => data.key === item.key
     );
    this.setState({FlatListItems: this.state.FlatListItems.slice(0,index).concat(this.state.FlatListItems.slice(index+1))})
    // this.state.FlatListItems[index] = item;
    // this.setState({
    // FlatListItems: this.state.FlatListItems
    // });
} 
//-------------------------------------------------------------------------------------------
  render(){
    return (
    <View style={style.MainContainer}>
    <FlatList
      data={ this.state.FlatListItems }   
      ItemSeparatorComponent = {this.FlatListItemSeparator}
      renderItem={({item}) => 
      <TouchableOpacity onPress={() => {
        console.log('in history for user : nimired :((((')
          this.props.navigation.navigate('HistoryShowOnMap',{date: item.datetime, user_id: this.user_id})}}> 
        <View key={item.key} style={style.itemContainer}>
          <View style={{flex: 1}}>
              <Image source={require('../asset/day.png')} style={style.userImage}/>
          </View>
          <View style={{flexDirection: 'column', flex: 5, marginTop: 13}}>
            <Text style={{ marginHorizontal: 20, fontSize: 18}}>{item.date}</Text>
          </View>
          <View style={{flex: 1, alignSelf: 'center'}}>
            <MaterialCommunityIcons name={'delete'} style={style.iconImage} 
                color={'gray'} size={25} onPress={() => this.deletHistoryByTime(item)}/>
          </View>
        </View>
      </TouchableOpacity>
      }
    />
  </View>   
  );
}
//-------------------------------------------------------------------------------------------
}

const style = StyleSheet.create({
  MainContainer :{
  // Setting up View inside content in Vertically center.
    justifyContent: 'center',
    flex:1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    position: 'absolute',
    width: 45,
    backgroundColor: '#ffffff',
},
itemContainer: {
  flex: 1, flexDirection: 'row', 
  backgroundColor: 'white', padding: 15
},
userImage: {
  height: 55, width: 55, 
    borderRadius: 50, borderColor: 'white', borderWidth: 2, alignSelf: 'center'
},
iconImage:{height: 30, width: 30, alignSelf: 'center', alignContent: 'center'}
});
