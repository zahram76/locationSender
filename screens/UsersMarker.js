import React ,{ Component } from 'react';  
import {
  Image, 
  Text, 
  View, 
  Animated, 
  FlatList, 
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  Dimensions} from 'react-native';  
import SQLite from "react-native-sqlite-storage";
import {styles} from '../style.js';
import { CheckBox } from 'react-native-elements';
import Icon from "react-native-vector-icons/AntDesign";

const color = '#349e9f';
SQLite.DEBUG(true);

export default class UsersMarker extends Component {
constructor(){
    super();
    this.state =  {
        checked: false,
        FlatListItems: [{
            key: 'Marker_1',
            value: false, 
            color: 'green',
        },{
            key: 'MapType_2',
            value: false,
            color: 'yellow',
        },{
            key: 'Marker_3',
            value: false,
            color: 'red',
        },{
          key: 'Marker_4',
          value: false, 
          color: 'black',
        },{
            key: 'MapType_5',
            value: false,
            color: 'purple',
        },{
            key: 'Marker_6',
            value: false,
            color: 'blue',
        },{
          key: 'Marker_7',
          value: false,
          color: 'orange',
      },{
        key: 'Marker_8',
        value: false,
        color: 'gray',
    }],
        selectedImage : '',
        showingImage : '',
        imageuri: '',
        lastImage: '',
        modalVisible: false,
        imageReady: false,
        borderColor: 'gray',
        marker_color: 'blue'
    }
    this.user_id;
    
}
   
init(){
    console.log(' marker type setting');
    var a = this.state.FlatListItems;
    SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('select marker_color from TrackingUsers where user_id=?', [this.user_id], (tx, results) => {
              console.log('Results', results.rows.length);
              if (results.rows.length > 0) {
                    this.setState({marker_color: results.rows.item(0).marker_color})
                    console.log(' marker color : ', this.state.marker_color)
                    this.setState({modalVisible: false})
              } else { console.log('can not find marker color ') }  
       })
    });
  });
}

componentDidMount(){
  this.setState({modalVisible: true})
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(this.props.navigation.state.params != null){
        console.log('in TrackingUserSettings  navigation param : ' + JSON.stringify(this.props.navigation.state.params));
        const str = JSON.stringify(this.props.navigation.state.params);
        JSON.parse(str, (key,value) => {
          if(key == 'user_id'){ 
            this.user_id = value;
            this.init();
        }
          console.log(value);
        })  
      } else { console.log( ' is nul ')}
    });
}

FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#ffffff"}}/>);
  }

  changeMarkerImage(){
   console.log(' update marker_color setting');
   SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('update TrackingUsers set marker_color=? where user_id=?', 
            [this.state.marker_color, this.user_id], 
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('markerImageupdate : ' + results.rowsAffected)
              } else { console.log('can not find markerImage setting ') }  
        });
    });
});
}

onSelect = (item) => {
  var a = [...this.state.FlatListItems]
  for(let i=0; i<this.state.FlatListItems.length; ++i){
    if(a[i].key != item.key)
      a[i].value = false
    else a[i].value = true
  }
  this.state.FlatListItems = a;
  this.setState({
   FlatListItems: this.state.FlatListItems
  });
  this.changeMarkerImage()
}

render(){
return (  
  <View style={style.MainContainer}>
    <View style={{flex: 1, marginTop: 50}}>
      <Text style={{fontSize : 15, marginBottom: 25}}> Select line color : </Text>
      <FlatList
        data={ this.state.FlatListItems }   
        ItemSeparatorComponent = {this.FlatListItemSeparator}
        numColumns={4}
        renderItem={({item}) => 
        <View key={item.key} style={style.container}>
          <TouchableOpacity onPress={()=> {
            console.log('pressed')
           this.onSelect(item)
          }}>
              <View style={[{backgroundColor : item.color, justifyContent: 'center'},style.photo]}>
                {item.value == true ? 
                  <View style= {style.overlay}>
                    <Icon name={'check'} color={'green'} size={40}/> 
                  </View> : null
                    }
              </View>
          </TouchableOpacity>
        </View>
        }
        extraData={this.state}  
      />
    </View> 
    <Modal
      animationType="fade"
      transparent={true}
      presentationStyle={"overFullScreen"}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      alert('Modal has been closed.');
                      this.setState({modalVisible: false})
                    }}>
                    <View style={{backgroundColor: "rgba(255,255,255,0.04)",
                      justifyContent: "center",
                      flex: 1, alignItems: 'center',}}>
                      <View style={{marginTop: 150}}>
                        <ActivityIndicator size="large" color="#0000ff" /> 
                        <TouchableHighlight
                          style={{margin: 30, backgroundColor: "rgba(255,255,255,0.4)",
                          justifyContent: "center", alignItems: 'center',}}
                          onPress={() => {
                            this.setState({modalVisible: false})
                          }}>
                          <Text>cancel ?</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>
  </View>   
    );
  }
}

const style = StyleSheet.create({
  MainContainer :{
      justifyContent: 'center',
      flexDirection: 'column',
      flex:1,
      paddingHorizontal: 16
    },
  container: {
      //flex: 1,
      flexDirection: 'row',
      padding: 10,
      marginLeft:3,
      marginRight:3,
      marginTop: 3,
      marginBottom: 3,
      borderRadius: 5,
      backgroundColor: '#FFF',
      elevation: 2,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      borderWidth: 0,
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
      height: 50,
      width: 50,
      //borderRadius: 30,
      alignSelf: 'center'
  },
  iconImage: {alignSelf: 'center', alignContent: 'center'},
  overlay:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'}
});
