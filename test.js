const Chance = require('chance');
var chance = new Chance()
const sql = require('mysql');
const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();
const {v4 : uuid} = require('uuid');

// var dateObj = new Date();
// var cmonth = dateObj.getUTCMonth() + 1; //months from 1-12
// var cday = dateObj.getUTCDate();
// var cyear = dateObj.getUTCFullYear();
// let fname = chance.first();
// let lname = chance.last();
// let NID = chance.string({length: 13, pool:'123456789'})
// let contact = chance.string({length: 11, pool:'0123456789'})
// let email = chance.email({domain: 'gmail.com'});
// let password = chance.string({length:8, pool:'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*'});


// // console.log(fname);
// // console.log(lname);
// // console.log(NID);
// // console.log(contact);
// // console.log(email);
// // console.log(password);

// // function currentDate(){
// //   console.log(cmonth);
// //   console.log(cday);
// //   console.log(cyear);
// // }

// let year = chance.year({min:2000, max:2030});
// let month = chance.month({raw:true});



// let startMonth = parseInt(month.numeric);
// let endMonth = startMonth + Math.floor(Math.random() * (12 - startMonth));
// let startDay = Math.floor(Math.random()*29) + 1
// let endDay = startDay + Math.floor(Math.random() * (28-startDay));

// // let year = 2022;
// // let startMonth = 12;
// // let endMonth = 12;
// // let startDay = 1;
// // let endDay = 28;


// console.log('year: ' + year  );
// console.log('startMonth: ' + startMonth);
// console.log('endMonth: ' + endMonth);
// console.log('startDay: ' + startDay);
// console.log('endDay: ' + endDay);


// console.log('Current Month: ' + cmonth);
// console.log('Current Day: ' + cday);
// console.log('Current year: ' + cyear);


// let startDate = `${year}-${startMonth}-${startDay}`;
// let endDate = `${year}-${endMonth}-${endDay}`;

// console.log(startDate);
// console.log(endDate);

// function ongoing(){
//   if(year != cyear){
//     return false;
//   }
//   else if(startMonth > cmonth || endMonth < cmonth){
//     return false;
//   }
//   else if(startDay > cday || endDay < cday){
//     return false;
//   }
//    else return true;
// }

// let roomnumArray = [101,102,103,104,105, 201,202,203,204,205, 301,302,303,304,305, 401,402,403,404,405, 501,502,503,504,505];
// function roomNum(){
//   let r = Math.floor(Math.random() * 24);
//   return roomnumArray[r];
// }

// // console.log(roomNum());

// let designation_array = ['floor staff', 'front desk', 'janitor', 'hospitality', 'pool'];
// function randomDesignation(){
//   let s = Math.floor(Math.random() * 4);
//   return designation_array[s];
// }

// console.log(randomDesignation());

const db = sql.createPool({
  connectionLimit:10,
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'testdb',
  dateStrings: true
})



db.getConnection((error, connection)=>{
  if(error) throw error;
  console.log('Database Connected');
})

// for(let i=1; i<=10; i++){

  //Getting Current Date
  // var dateObj = new Date();
  // var cmonth = dateObj.getUTCMonth() + 1; //months from 1-12
  // var cday = dateObj.getUTCDate();
  // var cyear = dateObj.getUTCFullYear();
  // const currentdate = `${cyear}-${cmonth}-${cday}`;
  
  // let year = chance.year({min:2000, max:2030});
  // let month = chance.month({raw:true});
  
  // let startMonth = parseInt(month.numeric);
  // let endMonth = startMonth + Math.floor(Math.random() * (12 - startMonth));
  // let startDay = Math.floor(Math.random()*29) + 1
  // let endDay = startDay + Math.floor(Math.random() * (28-startDay));
  
  // console.log(currentdate);
  // where Start_date < '${currentdate}' AND End_date > '${currentdate}'
  


















  // //Utility Functions
  // function ongoing(){
  //   if(year != cyear){
  //     return false;
  //   }
  //   else if(startMonth > cmonth || endMonth < cmonth){
  //     return false;
  //   }
  //   else if(startDay > cday || endDay < cday){
  //     return false;
  //   }
  //    else return true;
  // }
  
  // let roomNumArray = [101,102,103,104,105, 201,202,203,204,205, 301,302,303,304,305, 401,402,403,404,405, 501,502,503,504,505];
  // function randomRoomNum(){
  //   let r = Math.floor(Math.random() * 24);
  //   return roomNumArray[r];
  // }
  
  // let designation_array = ['floor staff', 'front desk', 'janitor', 'hospitality', 'pool'];
  // function randomDesignation(){
  //   let s = Math.floor(Math.random() * 4);
  //   return designation_array[s];
  // }
  
  
  // //Customer Table
  // let cid = uuid(); // *Booking, *BookingStart, *BookingEnd
  // let fname = chance.first();
  // let lname = chance.last();
  // let NID = chance.string({length: 13, pool:'123456789'})
  // let contact = chance.string({length: 11, pool:'0123456789'})
  // let email = chance.email({domain: 'gmail.com'}); // *Booking, *BookingStart, *BookingEnd
  // let dob = chance.birthday({string:true});
  // let plainPass = chance.string({length:8, pool:'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*'});
  //  // **Hash Before storing


  
  // //Booking Table
  // let bookingID = uuid(); // *BookingStart, *BookingEnd
  // let adultNum = Math.floor(Math.random() * 5) + 1;
  // let childNum = Math.floor(Math.random() * 5);
  // let startDate = `${year}-${startMonth}-${startDay}`;
  // let endDate = `${year}-${endMonth}-${endDay}`;
  // let RoomNum = randomRoomNum();
  
  // //Staff Table
  // let SID = uuid();
  // let sFname = chance.first();
  // let sLname = chance.last();
  // let sAge = Math.floor(Math.random() * 40) + 18;
  // let designation = randomDesignation();
  // let custQuery = `INSERT into Customer(CID, fname, lname, NID, Contact, DOB, email, password) VALUES ('${cid}', '${fname}', '${lname}', '${NID}', '${contact}', '${dob}', '${email}', '${hash})`;
  // let bookQuery = `INSERT into Booking(Start_Date, End_Date, Adult_num, Child_Num, Booking_ID, CID, email, RoomNum) VALUES ('${startDate}', '${endDate}', '${adultNum}', '${childNum}', '${bookingID}', '${cid}', '${email}', '${RoomNum}')`;
  // db.query(custQuery, (error, result)=>{
  //   if(error){
  //     console.log("Error Cust");
  //      throw error;
  //     }
  //     else{
  //       console.log("Success customer");
  //       db.query(bookQuery, (error, result)=>{
  //          if(error){
  //            console.log("Error book");
  //            throw error;
  //          }
  //          console.log("Success booking");
  //        })
  //      }
    
  //     })
    


  
  
  
  // db.query(custQuery, (error, result)=>{
  //   if(error){
  //     console.log("Error Cust");
  //     throw error;
  //   }
  //   else{
  //     console.log("Success customer");
  //     db.query(bookQuery, (error, result)=>{
  //       if(error){
  //         console.log("Error book");
  //         throw error;
  //       }
  //       console.log("Success booking");
  //     })
  //   }

  // })
  // }}


