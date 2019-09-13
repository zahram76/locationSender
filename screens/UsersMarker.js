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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const color = '#349e9f';
SQLite.DEBUG(true);

export default class UsersMarker extends Component {
constructor(){
    super();
    this.state =  {
        checked: false,
        FlatListItems: [{
            key: 'Marker_1',
            value: true, 
            image: 'asset:/images/marker1.png'
        },{
            key: 'MapType_2',
            value: false,
            image: 'asset:/images/marker2.png'
        },{
            key: 'Marker_3',
            value: false,
            image: 'asset:/images/marker3.png'
        },{
          key: 'Marker_4',
          value: true, 
          image: 'asset:/images/marker4.png'
        },{
            key: 'MapType_5',
            value: false,
            image: 'asset:/images/border-marker.png'
        },{
            key: 'Marker_6',
            value: false,
            image: 'asset:/images/border-marker1.png'
        }],
        selectedImage : '',
        showingImage : '',
        imageuri: '',
        lastImage: '',
        modalVisible: false,
        imageReady: false
    }
    this.user_id;
    
}
   
init(){
    console.log(' marker type setting');
    var a = this.state.FlatListItems;
    SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('select user_image, marker_image from TrackingUsers where user_id=?', [this.user_id], (tx, results) => {
              console.log('Results', results.rows.length);
              if (results.rows.length > 0) {
                JSON.parse(JSON.stringify(results.rows.item(0).marker_image), (key,value) => {
                  console.log('Results marker in marker setting ghable if first ', key, value);
                 // if(key == 'uri') {
                    this.setState({lastImage: value})
                    this.setState({showingImage:value})
                      console.log('marker image : ' + this.state.lastImage)
                    if(this.state.showingImage[0] != 'a' && this.state.showingImage[0] != '.' )
                      this.setState({checked: true})
                    this.setState({modalVisible: false})
                    this.setState({imageReady: true})
                    
                 // } else console.log('image is null')
              }); 
              } else { console.log('can not find marker setting ') }  

          console.log('Results marker in marker setting', results.rows.item(0).user_image);
          if (results.rows.length > 0) {
            console.log('Results marker in marker setting', ' lentgh > 0');
            JSON.parse(results.rows.item(0).user_image, (key,value) => {
              console.log('Results marker in marker setting ghable if', key, value);
              if(key == 'uri') {
                console.log('Results marker in marker setting', key, value);
                this.setState({imageuri : value}); }
            }); 
              console.log(' dddddddddddddddddddddddd11111111111111111111: ', JSON.stringify(this.state.imageuri))
              console.log('Success'+'\n'+'select users Successfully');
          } else {
            this.setState({imageuri : 'asset:/images/defaultProfile.png'})
            console.log(' dddddddddddddddddddddddd: ', JSON.stringify(this.state.imageuri))
            console.log('no user');
          }  
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

  changeMarkerImage(name){
   console.log(' update markerImage setting');
   SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('update TrackingUsers set marker_image=? where user_id=?', 
            [this.state.showingImage, this.user_id], 
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('markerImageupdate : ' + results.rowsAffected)
              } else { console.log('can not find markerImage setting ') }  
        });
    });
});
}


ifChecked(ItemImage, checked){
  console.log(' dddddddddddddddddddddddd2222: ', JSON.stringify(this.state.imageuri))
  var image = checked ? this.state.imageuri : ItemImage 
  this.setState({showingImage : image})
  console.log('in if checked : ' + checked + this.state.imageuri + JSON.stringify(image))
  this.changeMarkerImage(this.state.showingImage)
}

render(){
return (  
  <View style={style.MainContainer}>
    <View style={{flex: 1, marginTop: 50, marginBottom: 30}}>    
      <View style={styles.checkboxContainer}>
        <CheckBox
          title='Do you want to use your image insted ?'
          checked={this.state.checked}
          checkedColor='#16A085'
          containerStyle={styles.checkboxContainer}
          onIconPress={() => {
            this.ifChecked(this.state.showingImage, !this.state.checked)
            console.log('checcccccccccccccccccccccck: ',!this.state.checked)
            this.setState({checked: !this.state.checked});
          }}
          onPress={() => {
            this.ifChecked(this.state.showingImage, !this.state.checked)
            console.log('checcccccccccccccccccccccckaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: ',!this.state.checked)
            this.setState({checked: !this.state.checked});
          }}
        />
      </View> 
    </View>   
    
    <View style={{flex: 4}}>
      <Text> Select image : </Text>
      <FlatList
        data={ this.state.FlatListItems }   
        ItemSeparatorComponent = {this.FlatListItemSeparator}
        numColumns={4}
        renderItem={({item}) => 
        <View key={item.key} style={style.container}>
          <TouchableOpacity onPress={()=> {
            this.setState({checked: false});
            this.ifChecked(item.image, false);
          }}>
            <View style={{flex: 1}}>
                <Image source={{uri: item.image}} style={style.photo} resizeMode={'contain'}/>
            </View>
          </TouchableOpacity>
        </View>
        }
      />
    </View> 
    <View style={{flex: 2, justifyContent : 'center', alignItems: 'center', alignSelf: 'center'}}>
      <Image source={this.state.imageReady? {uri : this.state.showingImage} : '../images/background.png'} style={{width: 150, height: 150, borderRadius: 80}}  resizeMode={'cover'}/>
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
      borderWidth: 1,
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
      borderRadius: 30,
      alignSelf: 'center'
  },
  iconImage: {alignSelf: 'center', alignContent: 'center'}
});
