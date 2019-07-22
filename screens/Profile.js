import React from "react";
import {StyleSheet,
  View, 
  Text, 
  Button} from "react-native";


export default class Profile  extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View>
            <Text>ForgotPass screen</Text>
            <Button title="in Profile. go to map screen" onPress={()=> this.props.navigation.navigate('Map')}></Button>
        </View>
    );
  }
}

