
import SQLite from "react-native-sqlite-storage";

  export function initDatabase(){
    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      console.log("Database OPEN");
        DB.transaction((tx) => {
          console.log("execute transaction");
          tx.executeSql('CREATE TABLE IF NOT EXISTS TrackingUsers(user_id INTEGER PRIMARY KEY AUTOINCREMENT, phone_no VARCHAR(12) unique not null , first_name VARCHAR(20) not null, last_name VARCKAR(20) not null, age integer not null, marker_color text not null )', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n Tracking Users ");
            console.log(JSON.stringify(results) + ' ' + len);
        });
          tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(loc_id integer primary key autoincrement, user_id INTEGER not null, datatime text not null, latitude text not null, longitude text not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n Locations ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
          tx.executeSql('CREATE TABLE IF NOT EXISTS CurrentUser(user_id integer primary key autoincrement, username text not null, password text not null, phone_no text not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n CurrentUser ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
          tx.executeSql('CREATE TABLE IF NOT EXISTS Settings(setting_name text primary key, value text not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n Settings ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
      });
      });
  }