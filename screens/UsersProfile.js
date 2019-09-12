import React ,{ Component } from 'react';  
import {
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
} from "react-native"; 
import SQLite from "react-native-sqlite-storage";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNSimData from 'react-native-sim-data';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {styles} from '../style.js';
var RNFS = require('react-native-fs');

const color = '#349e9f';
SQLite.DEBUG(true);
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const ImageOptions = [
  require('../asset/error.png'),
  require('../asset/verified.png')
]
const imageOptions = [
    require('../images/defaultMap.png'),
    require('../images/sateliteMap.png'),
    require('../images/terrianMap.png')
];

export default class AccountSetting extends Component {
constructor(){
    super();
    this.state =  {
       first_name: '',
       last_name: '',
       bordercolor: '#DBDBDB',
       bordercolor1: '#DBDBDB',
       bordercolor2: '#DBDBDB',
       bordercolor3: '#DBDBDB',
       FlatListItems: [],
       resizedImageUri: null,
       avatarSource: require('../asset/defaultProfile.png'),
       isReady: false,
       uriFlag: false,
       image: '',
       saveImage: null,
       error: false, 
       message: '',
       color: 'red',
   };
   imageUri = '';
   savedImageUri ='';
   flagIsRepeat = true;
   this.user_id;   
   this.saveImageForMarker;
}

init(){
  console.log(' init profile');
  var a = [];
  var image = null ;
  SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
  DB.transaction((tx) => {
    console.log("execute transaction");
      tx.executeSql('select phone_no, user_id, first_name, last_name, user_image, marker_image, age from TrackingUsers where user_id=? ', [this.user_id], (tx, results) => {
            console.log('Results', results.rows.length);
            if (results.rows.length > 0) {
              for(let i=0; i<results.rows.length; ++i){
                console.log('Resultsss', JSON.stringify(results.rows.item(i)));
                  JSON.parse(results.rows.item(i).user_image, (key,value) => {
                    if(key == 'uri') {
                      this.setState({uriFlag: true})
                      image = {uri : value}}
                    else if (key == 'require')
                      image = require('../asset/defaultProfile.png')
                  });
                  this.setState({
                    user_id : results.rows.item(i).user_id,
                    first_name : results.rows.item(i).first_name,
                    last_name : results.rows.item(i).last_name,
                    age : results.rows.item(i).age,
                    phone_no : results.rows.item(i).phone_no,
                    avatarSource: image == null ? this.state.avatarSource : image
                  })
                  console.log('pohone: '+ JSON.stringify(this.state))
                  if(results.rows.item(0).marker_image[0] == '.'){
                      this.saveImageForMarker = false;
                  } else this.saveImageForMarker = true;
              }
              console.log('Success'+'\n'+'select users Successfully');
            } else {
              console.log('no user');
            }  
      })
  });
});
}

updateAccount(phone_no,first_name,last_name,age,image, user_id){
   console.log(' update user account setting');
   console.log(phone_no+ first_name+ last_name+ JSON.stringify(image));
   SQLite.openDatabase({name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
    DB.transaction((tx) => {
      console.log("execute transaction");
        tx.executeSql('update TrackingUsers set first_name=?, last_name=? age=? where user_id=?',
         [first_name,last_name,age,user_id], 
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('user account update : ' + results.rowsAffected)
                this.setState({message: 'Success'+'\n'+'Your account update Successfully'}); 
                this.setState({error: false});
                this.setState({isReady: true});
              } else { console.log('can not find map type setting ') }  
        });
        tx.executeSql('update TrackingUsers set user_image=? where phone_no=?',
        [JSON.stringify(image),phone_no], 
           (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('image update : ' + results.rowsAffected)
            } else { console.log('can not find image setting ') }  
        });
        if(this.saveImageForMarker)
            tx.executeSql('update TrackingUsers set marker_image=? where phone_no=?',
            [JSON.stringify(image),phone_no], 
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                console.log('image update : ' + results.rowsAffected)
                } else { console.log('can not find image setting ') }  
            });
    });
  });
}

AddButtonPress() {
  var flag = false;
    if (this.state.phone_no == '' ){ 
      this.setState({bordercolor2 : '#B30000'}); flag = true}
    if (this.state.first_name == ''){
       this.setState({bordercolor : '#B30000'}); flag = true}
    if (this.state.last_name == ''){ 
      this.setState({bordercolor1 : '#B30000'}); flag = true}
    if (this.state.age == ''){ 
      this.setState({bordercolor1 : '#B30000'}); flag = true}

    if(flag){
      this.setState({message: 'Please fill in the blanks!'});
      this.setState({error: true});
      this.setState({isReady: true});
    } else {
      this.isRepeatedUser();
    }
}

componentDidMount(){
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

getImage(){ 
  console.log('image picker');
  this.setState({isReady: false})
  ImagePicker.launchImageLibrary(options, (response) => {
     const uri = 'data:image/jpeg;base64,' + response.data ;
     this.imageUri = uri
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      ImageResizer.createResizedImage(uri, 300, 300, 'JPEG', 80,1, RNFS.DocumentDirectoryPath+'/images/')
      .then(({uri}) => {
        this.setState({avatarSource: {uri: uri}})
        this.setState({uriFlag: true})
      }).catch((err) => {
        console.log(err);
      });
    }
  });
}

saveImageToDevice(name,data){
  var image;
  console.log('uri flag: '+this.state.uriFlag + JSON.stringify(data))
  if(this.state.uriFlag == false) {image = {require : this.state.avatarSource}; }
  else { image = data; }
  console.log(JSON.stringify(image))
  this.updateAccount(this.state.phone_no, this.state.first_name, this.state.last_name, this.state.age, image, this.user_id);
}

changePass(){
  // var no = JSON.stringify(RNSimData.getSimInfo().phoneNumber0)
  // console.log(no)
}

isRepeatedUser(){
  this.flagIsRepeat = false;
  this.insert(this.flagIsRepeat)
}

insert(){
  this.saveImageToDevice(this.state.phone_no.split(' ')[0], this.state.avatarSource)
}

render(){
return (  
  <View style={styles.scrolStyle}>
            <ScrollView style={styles.scrolStyle} scrollEnabled contentContainerStyle={styles.scrollview}>
              <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
                <View style={style.avatarContainer} >
                  <TouchableOpacity onPress={() => this.getImage()}>
                      <Image source={this.state.avatarSource}
                              style={style.avatarImage} resizeMode={'cover'}/>
                  </TouchableOpacity> 
                </View>
              <View style={{flex: 1, marginTop: 55,marginBottom: 20}}>
                <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor, width: '85%'}]}
                      onFocus={() => {this.setState({bordercolor : color}); 
                        this.setState({bordercolor1 : "#DBDBDB"});
                        this.setState({bordercolor2 : "#DBDBDB"}); 
                        this.setState({bordercolor3 : "#DBDBDB"}); 
                        this.setState({isReady: false}); }}
                      onBlur={() => {this.setState({bordercolor : "#DBDBDB"});}}
                      placeholder={'first name'}
                      placeholderTextColor={'#8D8D8D'}
                      underlineColorAndroid='transparent'
                      fontSize={16}
                      defaultValue={this.state.first_name}
                      keyboardType={'default'}
                      onChangeText={txt => {
                        this.setState({first_name: txt})}}/>
                  </View>
                </View>
                <View style={{flex: 1,marginBottom: 20, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor1, width: '85%'}]}
                      onFocus={() => {this.setState({bordercolor1 : color});
                          this.setState({bordercolor2 : "#DBDBDB"});
                          this.setState({bordercolor : "#DBDBDB"}); 
                          this.setState({bordercolor3 : "#DBDBDB"}); 
                          this.setState({isReady: false})}}
                      placeholder={'last name'}
                      placeholderTextColor={'#8D8D8D'}     
                      onBlur={() => {this.setState({bordercolor1 : "#DBDBDB"})}}
                      underlineColorAndroid='transparent'
                      defaultValue={this.state.last_name}
                      keyboardType={'default'}
                      onChangeText={txt => {
                        this.setState({last_name: txt})}}/>
                  </View>
                </View>
                <View style={{flex: 1,marginBottom: 20, flexDirection: 'row'}}>
                  <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor3, width: '85%'}]}
                      onFocus={() => {this.setState({bordercolor1 : color});
                          this.setState({bordercolor2 : "#DBDBDB"});
                          this.setState({bordercolor : "#DBDBDB"}); 
                          this.setState({bordercolor1 : "#DBDBDB"}); 
                          this.setState({isReady: false})}}
                      placeholder={'age'}
                      placeholderTextColor={'#8D8D8D'}     
                      onBlur={() => {this.setState({bordercolor1 : "#DBDBDB"})}}
                      underlineColorAndroid='transparent'
                      defaultValue={String(this.state.age)}
                      keyboardType={'number-pad'}
                      onChangeText={txt => {
                        this.setState({age: parseInt(txt)})}}/>
                  </View>
                </View>
              <View style={{flex: 1, marginBottom: 20}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 5}}>
                    <TextInput 
                      style={[styles.addinput,{borderBottomColor : this.state.bordercolor2, width: '85%', marginRight: 10}]}
                      onFocus={() =>{this.setState({bordercolor2 : color});
                        this.setState({bordercolor1 : "#DBDBDB"});
                        this.setState({bordercolor : "#DBDBDB"}); 
                        this.setState({bordercolor3 : "#DBDBDB"}); 
                        this.setState({isReady: false})}}
                      onBlur={() => {this.setState({bordercolor2 : "#DBDBDB"})}}
                      placeholder={this.state.phone_no}
                      placeholderTextColor={'#8D8D8D'}
                      defaultValue={this.state.phone_no}
                      underlineColorAndroid='transparent'
                      keyboardType={'phone-pad'}
                      onChangeText={txt => {
                        this.setState({phone_no: txt.split(' ')[0]})
                        console.log('after : ' + this.state.phone_no)}}/>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{marginTop: 1, flex: 1}}>
                  <TouchableOpacity style={[styles.btn,{marginTop: 10, marginRight: 20, marginLeft: 30}]}>
                    <Image source={this.state.isReady ? (this.state.error ? ImageOptions[0]: ImageOptions[1]): null}
                        style={{height: 30, width: 30}} />
                  </TouchableOpacity> 
                </View>
                <View style={{flex: 4}}>
                  <Text style={[{marginTop: 20}]}> {this.state.isReady ? this.state.message : null} </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                  <TouchableOpacity style={[styles.btn,{alignSelf:'center', width: 100, 
                    height: 40, marginTop: 10, marginRight: 20, backgroundColor: color}]}
                    onPress={this.AddButtonPress.bind(this)}>
                    <Text style={{color: '#ffffff'}}>save</Text>
                  </TouchableOpacity> 
                </View>
            </View>
          {/* </ImageBackground> */}
        </ScrollView>
     </View>
    );
}
}

const style = StyleSheet.create({
  MainContainer :{
    justifyContent: 'center',
    flex:1,
    margin: 10,
    marginTop: 40
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
  avatarContainer:{
    backgroundColor: color,
    height:110,
  },
  btn1:{
    borderRadius: 15,
    //color: color,
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
    marginRight: 7, 
    backgroundColor: '#ffffff',
    borderColor: color, 
    borderWidth: 1
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: color,
    marginBottom:10,
    alignSelf: "center",
    backgroundColor: color,
    marginTop:20
  },
  labelStyle: {
    marginLeft: 15,
    marginTop: 10,
    color: '#000000',
  }

});