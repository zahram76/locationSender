
import SQLite from "react-native-sqlite-storage";

  export function initDatabase(){
    SQLite.openDatabase(
      {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
      console.log("Database OPEN");
        DB.transaction((tx) => {
          tx.executeSql('PRAGMA foreign_keys = ON', [], (tx, results) => {
        });
          console.log("execute transaction");
          tx.executeSql('CREATE TABLE IF NOT EXISTS TrackingUsers(user_id INTEGER PRIMARY KEY AUTOINCREMENT, phone_no VARCHAR(12) unique not null , first_name VARCHAR(20) not null, last_name VARCKAR(20) not null, age text not null, marker_color text not null, user_image blob, sending_setting text not null, interval text not null, marker_image text)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n Tracking Users ");
            console.log(JSON.stringify(results) + ' ' + len);
        });
          tx.executeSql('CREATE TABLE IF NOT EXISTS Locations(loc_id integer primary key autoincrement, user_id INTEGER not null, datatime text not null, latitude text not null, longitude text not null, FOREIGN KEY (user_id) REFERENCES TrackingUsers (user_id) ON DELETE CASCADE)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n Locations ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
          tx.executeSql('CREATE TABLE IF NOT EXISTS CurrentUser(user_id integer primary key autoincrement, username text not null, password text not null, phone_no text not null, user_image blob)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n CurrentUser ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
          tx.executeSql('CREATE TABLE IF NOT EXISTS Settings(setting_name text primary key, value text not null)', [], (tx, results) => {
            var len = results.rows.length;
            console.log("\n Settings ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
          console.log("\n insert into settings mappppppppppp ");
          tx.executeSql('insert into Settings(setting_name, value) values(?,?)', ['mapType','standard'], (tx, results) => {
            var len = results.rowsAffected;
            console.log("\n insert maptype ");
            console.log(JSON.stringify(results) + ' ' + len);
          });
      });
    });
  }