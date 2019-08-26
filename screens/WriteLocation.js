import SQLite from "react-native-sqlite-storage";

export function insertLocation(user_id, latitude, longitude){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      DB.transaction((tx) => {
        tx.executeSql('insert into Locations(user_id, datatime, latitude, longitude) values (?,?,?,?)', 
          [user_id, dateTime, latitude, longitude,],
             (tx, results) => {
              console.log('Results', results.rowsAffected);
        })})});
  }