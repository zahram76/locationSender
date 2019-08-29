import SQLite from "react-native-sqlite-storage";
  
export function deleteUser(phone_no){
 SQLite.openDatabase(
    {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      DB.transaction((tx) => {
        tx.executeSql('DELETE FROM TrackingUsers where phone_no=?', [phone_no], (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                alert(
                  'Success'+'\n'+'user deleted successfully') 
                } else {
                    alert(
                        'no user to delete') 
                }

                  
        })})});
  }