import React from "react";
import {
  View, 
  Text, 
  TouchableOpacity} from "react-native";
import {styles} from '../style.js';

export default class ForgotPass  extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View>
            <Text style={styles.text} > ForgotPass screen </Text>
            <TouchableOpacity  style={styles.BubbleStyle}
              onPress={()=> this.props.navigation.navigate('Map')}>
                <Text style={styles.text} > in ForgotPass. go to signin screen </Text>
            </TouchableOpacity>
        </View>
    );
  }
}

