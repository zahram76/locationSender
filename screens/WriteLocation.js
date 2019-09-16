import SQLite from "react-native-sqlite-storage";
import Geohash from 'latlon-geohash';

export function insertLocation(user_id, latitude, longitude, lastlat, lastlong){
  var geo = Geohash.encode(latitude, longitude, 7);
  var lastgeo = Geohash.encode(lastlat, lastlong, 7);
  console.log('location are not equl then is save: ' , geo, lastgeo,latitude, lastlat, longitude, lastlong )
  if(geo != lastgeo){
    console.log('location are not equl then is save: ' , geo, lastgeo,latitude, lastlat, longitude, lastlong )

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1<10? '0'+(today.getMonth()+1) : today.getMonth()+1)+
      '-'+(today.getDate()<10? '0'+(today.getDate()) : today.getDate());
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log('in insert location ', user_id, dateTime, latitude, longitude)
      SQLite.openDatabase(
        {name : "database", createFromLocation : "~database.sqlite"}).then(DB => {
        DB.transaction((tx) => {
          tx.executeSql('insert into Locations(user_id, datatime, latitude, longitude) values (?,?,?,?)', 
            [user_id, dateTime, latitude, longitude],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
          })})});
    } else {
      console.log('location are equl then is not save: ' , geo, lastgeo )
    }
  }