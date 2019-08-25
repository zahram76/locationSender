import React from "react";
import {
  View, 
  Text, 
  Image,
} from "react-native";
import { Menu as Menu1, MenuProvider,renderers,
   MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";

//onBackdropPress={() => }
const { ContextMenu, SlideInMenu, Popover } = renderers;

export const MapTypeMenu= ({onChange}) => { // onchange for pass value to map
    console.log('in map type menu');
    
    return(
      <MenuProvider style={{paddingLeft: 12, paddingRight: 8, paddingBottom: 220 }}>
      <Menu1 
        renderer={ContextMenu}
        onSelect={onChange}>

        <MenuTrigger  >
          <View style={{ 
              backgroundColor: "rgba(255,255,255,0.8)",
              paddingHorizontal: 7,
              paddingVertical: 7,
              borderRadius: 20,
              color: 'transparent',
            }}>
            <Image style={{
              width: 28, height: 28
            }}
              source={require('../images/iconLayer.png')}/>
          </View>
        </MenuTrigger >

        <MenuOptions style={{flexDirection: "column",
          backgroundColor: "rgba(255,255,255,0.8)",color: 'transparent',}} >
          <MenuOption value={"standard"} style={{ alignContent: 'center',}}>
          <Image style={{ height: 50, width: 50}} 
              resizeMode='contain'
              source={require('../images/defaultMap.png')}/>
          <Text style={{color: 'gray', fontSize: 11, marginVertical: 3}}> Default </Text>
          </MenuOption>
          <MenuOption value={"satellite"}>
            <Image style={{height: 50, width: 50}} 
              resizeMode='contain'
              source={require('../images/sateliteMap.png')}/>
          <Text style={{color: 'gray', fontSize: 11, marginVertical: 3}}> Satellite </Text>
          </MenuOption>
          <MenuOption value={"terrain"}>
            <Image style={{height: 50, width: 50}} 
              resizeMode='contain'
              source={require('../images/terrianMap.png')}/>
          <Text style={{color: 'gray', fontSize: 11, marginVertical: 3}}> Terrain </Text>
          </MenuOption>
        </MenuOptions>
      </Menu1>
    </MenuProvider>);
  }
  