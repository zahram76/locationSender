import SQLite from "react-native-sqlite-storage";

  export function InsertUser(phone_no,first_name,last_name,age,color,image){
    console.log('image : '+ image)
        SQLite.openDatabase(
          {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
          DB.transaction((tx) => {
          console.log("execute transaction");
          tx.executeSql('insert into TrackingUsers(phone_no, first_name, last_name, age, marker_color, user_image) values (?,?,?,?,?,?)', 
            [phone_no,first_name, last_name, age, color, image],
               (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  this.setState({modalVisible: false})
                  alert('Success'+'\n'+'You are Registered Successfully');
                  //this.back();
                } else {
                  alert('Registration Failed');
                }
     });});});
    }