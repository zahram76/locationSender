import React from "react";
import {
  View, 
  Text, 
  Image,
} from "react-native";
import { Menu as Menu1, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";

export const MapTypeMenu= () => {
    console.log('in map type menu');
    return(
      <MenuProvider style={{position: 'relative', flexDirection: 'column', padding: 20}}>
      <Menu1 style={{ paddingHorizontal: 100}}
        onSelect={value => alert(`You Clicked : ${value}`)}>
        <MenuTrigger  >
          <View style={{ 
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,1)",
              paddingHorizontal: 7,
              paddingVertical: 7,
              borderRadius: 20,
              color: 'transparent' }}>
            <Image style={{
              width: 25, height: 25
            }}
              source={require('../images/iconLayer.png')}/>
          </View>
        </MenuTrigger  >
        <MenuOptions style={{flexDirection: "row", flex: 1, justifyContent: 'center', alignContent: 'center', borderRadius: 20}} >
          <MenuOption value={"standard"}>
          <Image style={{ height: 50, width: 50}} 
              resizeMode='contain'
              source={require('../images/defaultMap.png')}/>
          <Text style={{alignContent: 'center', color: 'gray', fontSize: 13, marginVertical: 3}}> Default </Text>
          </MenuOption>
          <MenuOption value={"satellite"}>
            <Image style={{height: 50, width: 50}} 
              resizeMode='contain'
              source={require('../images/sateliteMap.png')}/>
          <Text style={{alignContent: 'center', color: 'gray', fontSize: 13, marginVertical: 3}}> Satellite </Text>
          </MenuOption>
          <MenuOption value={"terrian"}>
            <Image style={{height: 50, width: 50}} 
              resizeMode='contain'
              source={require('../images/terrianMap.png')}/>
          <Text style={{alignContent: 'center', color: 'gray', fontSize: 13, marginVertical: 3}}> Terrian </Text>
          </MenuOption>
        </MenuOptions>
      </Menu1>
    </MenuProvider>);
  }
  