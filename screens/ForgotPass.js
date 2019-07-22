import React from "react";
import {StyleSheet,
  View, 
  Text, 
  Button} from "react-native";


export default class ForgotPass  extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View>
            <Text>ForgotPass screen</Text>
            <Button title="in ForgotPass. go to signin screen" onPress={()=> this.props.navigation.navigate('Map')}></Button>
        </View>
    );
  }
}

