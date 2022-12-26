//REQUIRING DEPENDENCIES
const express = require('express');
const Chance = require('chance');
var chance = new Chance();
const app = express();
const sql = require('mysql');
const {v4 : uuid} = require('uuid'); //Generates Unique ids
const session = require('express-session');




//PORT VARIABLE
const port = 3000;

//SERVING STATIC FILES
// app.use(express.static('assets/bootstrap-5.2.3/css'));
// app.use(express.static('assets/bootstrap-5.2.3/js'));
// app.use(express.static('assets/css'));





//Gives access to views folder from any path
const path = require('path')
app.set('views', path.join(__dirname, 'views'));

//Templating Engine
app.set('view engine', 'ejs');

//Middlewre
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

//Database Connection
const db = sql.createPool({
  connectionLimit:10,
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'testdb',
  dateStrings:true
});

db.getConnection((error, connection)=>{
  if(error) throw error;
  console.log('Database Connected');
})

//Test Requests
app.get("/bookhtml", (req,res)=>{
  res.render('G:/CSE311 Repo/CSE311_Project_Group2-Mir_Warish/views/testers/testBooking.ejs');
})

// app.get("/bookhtml", (req,res)=>{
//   res.render('testBooking');
// })


//GET REQUESTS
app.get('/login', (req,res)=>{
  res.render('signin.ejs');
})

app.get('/signup', (req,res)=>{
  res.render('signup.ejs');
})

app.get('/admin', (req,res)=>{
  res.render('admin_signin.ejs');
})


app.get('/home', (req,res)=>{
  let email = req.session.email;
  let login = "Login";
  let logout = "Logout";
  let loginPath = "/login";
  let logoutPath = "/logout";
  res.render("home.ejs", {email, login, logout, loginPath, logoutPath});
    
})

app.get('/logout', (req,res)=>{
  req.session.email = null;
  req.session.CID = null;
  res.redirect('/home');
})

app.get('/logoutadmin', (req,res)=>{
  req.session.admin_email = null;
  res.redirect('/admin');
})

app.get('/room', (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }

  else{
    const sQuery = "Select * from room";
    db.query(sQuery, (error,result)=>{
      res.render("room.ejs", {result});
    })
  }
})

app.get('/bookingadmin', (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    const sQuery = "Select * from booking";
    db.query(sQuery, (error,result)=>{
      res.render("booking_table.ejs", {result});
    })
  }
})

app.get('/booking', (req,res)=>{
  if(!req.session.email){
    res.redirect('/login');
  }
  else{
    res.render('booking.ejs');
  }
  
})

app.get('/customer', (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    const sQuery = "Select * from customer";
    db.query(sQuery, (error,result)=>{
      res.render("customer.ejs", {result});
    })
  }
})


app.get("/about", (req,res)=>{
  res.render('about.ejs');
})


//Admin Edit Requests
app.get("/edit/:bookid", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    const bookid = req.params.bookid;
    res.render("editbooking.ejs", {bookid});
  }
  
})

app.post("/bookingedit", (req,res)=>{
  console.log(req.body);
  const {Booking_ID, child_num, adult_num, start_date, end_date, Type} = req.body;
  const qry = `update booking set Start_Date = '${start_date}', End_Date = '${end_date}', Type = '${Type}', Adult_num='${adult_num}', Child_Num='${child_num}' where Booking_ID = '${Booking_ID}'`
  db.query(qry, (err,result)=>{
    if(err) throw err;
  })
})

app.get("/editcust/:cid", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    const cid = req.params.cid;
    res.render("editcustomer.ejs", {cid});
  }
  
})

app.post("/customeredit", (req,res)=>{
  const{CID, fname, lname, Contact, NID, DOB} = req.body;
  const sqry = `update customer set fname='${fname}', lname='${lname}', Contact='${Contact}', NID='${NID}', DOB='${DOB}' where CID = '${CID}'`;
  db.query(sqry, (err,res)=>{
    if(err) throw err;
  })
})

app.get("/delete/:bid", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    const{bid} = req.params;
    let qry = `Delete from booking where Booking_ID = '${bid}'`;
    db.query(qry, (err,res)=>{
      if(err) throw err;
  })
  res.redirect("/bookingadmin");
  }
  
})

app.get("/deletecust/:cid", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    const{cid} = req.params;
    let qry = `Delete from customer where CID = '${cid}'`;
    db.query(qry, (err,res)=>{
      if(err) throw err;
  })
  res.redirect("/customer");
  }
})


//ADMIN GET REQUESTS

app.get("/testq", (req,res)=>{
  res.render("signup2");
})

app.get("/staff", (req,res)=>{
  if(!req.session.admin_email){
      let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    let qry = "Select * from staff";
    db.query(qry, (err,result)=>{
      if(err) throw err;
      else{
        res.render("staff.ejs", {result});
      }
    })
    
  }
})

app.get("/createstaff", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
    let redirPath = "/home";
    res.render('error_page.ejs', {message, redirPath} );
}
else{
  res.render("createstaff.ejs");
}
})

app.get("/deletestaff/:sid", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
    let redirPath = "/home";
    res.render('error_page.ejs', {message, redirPath} );
}
else{
  const {sid} = req.params;
  let qry = `Delete from staff where sid='${sid}'`;
  db.query(qry,(err,result)=>{
    if(err) throw err;
  })
  res.redirect("/staff");
}
  
})

app.post("/createstaff", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
    let redirPath = "/home";
    res.render('error_page.ejs', {message, redirPath} );
}
else{
  const {fname,	lname,	email,	DOB,	Contact,	Designation,	NID} = req.body;
  let qry = `insert into staff(SID, fname,	lname,	email,	DOB,	contact,	Designation,	NID) values ('${SID=uuid()}', '${fname}', '${lname}', '${email}', '${DOB}', '${Contact}', '${Designation}', '${NID}')`;
  db.query(qry, (err,result)=>{
    if(err) throw err;
  })
  res.redirect("/createstaff");
}
  
})

app.get("/editstaff/:sid", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
    let redirPath = "/home";
    res.render('error_page.ejs', {message, redirPath} );
}

else{
  const {sid} = req.params;
  res.render("editstaff.ejs",{sid});
}
})

app.post("/editstaff", (req,res)=>{
  const {SID, fname,	lname,	email,	DOB,	Contact,	Designation,	NID} = req.body;
  let qry = `update staff set fname='${fname}', lname='${lname}', email='${email}', DOB='${DOB}', Contact='${Contact}', Designation='${Designation}', NID='${NID}' where SID='${SID}'`;
  db.query(qry, (err,result)=>{
    if(err) throw err;
  })
})

//POST REQUESTS
app.post('/signup', (req,res)=>{
  console.log(req.body);
  const {fname, lname, NID, contact, DOB, email, password} = req.body;

  if(fname==='' || NID === '' || contact === '' || DOB === '' || email === '' || password === ''){
    let message = "Fields cannot be left empty";
    let redirPath = "/signup";
    res.render('error_page.ejs', {message, redirPath});
  }

  else{
    db.query(`Select * from customer where email = "${email}"`, (error,result)=>{
      if(error) throw error;
  
      else if(result.length > 0){
        let message = "Email already in use";
        let redirPath = "/signup"
        return res.render('error_page.ejs', {message, redirPath});
      }
      else{
        //Pushing Data into database
        let sql_query = `INSERT INTO Customer(CID, fname, lname, NID, Contact, DOB, email, password) VALUES ('${id=uuid()}', '${fname}', '${lname}', '${NID}', '${contact}', '${DOB}', '${email}', '${password}')`;
        db.query(sql_query, (error, result)=>{
          if(error){
            console.log("Something went wrong");
          }
          else{
            res.redirect('/login');
            console.log("Inserted into table");
          }
        })
      }
    })
  }
})

app.post('/login', (req,res)=>{
  const {email, password} = req.body;
  db.query(`Select * from customer where email = '${email}'`, (error,result)=>{
    if(error) throw error;
    console.log(result);
    if(result.length === 0){
      let message = "User Not Found";
      let redirPath = "/login";
      res.render('error_page.ejs', {message, redirPath} );
    }
    else if(password != result[0].password){
      let message = "Incorrect Credentials";
      let redirPath = "/login";
      res.render('error_page.ejs', {message, redirPath} );
    }

    else{
      req.session.email = result[0].email;
      req.session.cid = result[0].CID;
      res.redirect("/home");
    }
  })


  console.log(req.body);
})

app.post("/adminlogin", (req,res)=>{
  const admin_email = req.body.admin_email;
  const admin_pass = req.body.admin_pass;
  db.query(`Select * from admin where email = '${admin_email}'`, (error,result)=>{
    if(error) throw error;
    console.log(result);
    if(result.length === 0){
      let message = "User Not Found";
      let redirPath = "/admin";
      res.render('error_page.ejs', {message, redirPath} );
    }
    else if(admin_pass != result[0].password){
      let message = "Incorrect Credentials";
      let redirPath = "/admin";
      res.render('error_page.ejs', {message, redirPath} );
    }

    else{
      req.session.admin_email = result[0].email;
      res.redirect("/bookingadmin");
    }

  })
})

app.post('/booking', (req,res)=>{
  
  let bookingID = uuid();
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;
  let adult_num = req.body.adult_num;
  let child_num = req.body.child_num;
  let type = req.body.Type;

  let standardNum = 10;
  let deluxeNum = 8;
  let suiteNum = 7;

  console.log(req.body.start_date);
  console.log(req.body.end_date);

  const q = `Select * from booking where type = '${type}' AND ((start_date between '${start_date}' and '${end_date}') OR (end_date between '${start_date}' and '${end_date}' ) OR (start_date<='${start_date}' AND end_date>='${end_date}'))`;

  db.query(q, (error, result)=>{
    console.log(result);
    if(type=== "Standard"){
      if(result.length < standardNum){
        const sQry = `Insert into booking(Start_Date, End_Date, Adult_num, Child_Num, Booking_ID, CID, email, Type) values ('${start_date}', '${end_date}', '${adult_num}', '${child_num}', '${bookingID}', '${req.session.cid}', '${req.session.email}', '${type}' )`;
        db.query(sQry, (error, result)=>{
          if(error) throw error;
          console.log("Inserted into booking");
          res.redirect("/booking");
        })
      }
      else{
        let message = `All ${type} rooms are booked at that time`;
        let redirPath = "/booking";
        res.render('error_page.ejs', {message, redirPath} )
      }
    }

    else if(type=== "Deluxe"){
      if(result.length < deluxeNum){
        const sQry = `Insert into booking(Start_Date, End_Date, Adult_num, Child_Num, Booking_ID, CID, email, Type) values ('${start_date}', '${end_date}', '${adult_num}', '${child_num}', '${bookingID}', '${req.session.cid}', '${req.session.email}', '${type}' )`;
        db.query(sQry, (error, result)=>{
          if(error) throw error;
          console.log("Inserted into booking");
          res.redirect("/booking");
        })
      }
      else{
        let message = `All ${type} rooms are booked at that time`;
        let redirPath = "/booking";
        res.render('error_page.ejs', {message, redirPath} )
      }
    }

    else if(type=== "Suite"){
      if(result.length < suiteNum){
        const sQry = `Insert into booking(Start_Date, End_Date, Adult_num, Child_Num, Booking_ID, CID, email, Type) values ('${start_date}', '${end_date}', '${adult_num}', '${child_num}', '${bookingID}', '${req.session.cid}', '${req.session.email}', '${type}' )`;
        db.query(sQry, (error, result)=>{
          if(error) throw error;
          console.log("Inserted into booking");
          res.redirect("/booking");
        })
      }
      else{
        let message = `All ${type} rooms are booked at that time`;
        let redirPath = "/booking";
        res.render('error_page.ejs', {message, redirPath,} )
      }
    }
  })
})

//ADMIN CRUD

app.get("/createaccount", (req,res)=>{
  if(!req.session.admin_email){
    res.send("Unauthorized");
  }
  else{
    res.render('account.ejs');
  }
})

app.get("/bookingcreate", (req,res)=>{
  if(!req.session.admin_email){
    res.send("Unauthorized");
  }
  else{
    res.render('createbooking.ejs');
  }
})
//CREATE

app.post("/usercreate", (req,res)=>{
    const {fname, lname, NID, Contact, DOB, email, password} = req.body;
    let sql_query = `INSERT INTO Customer(CID, fname, lname, NID, Contact, DOB, email, password) VALUES ('${id=uuid()}', '${fname}', '${lname}', '${NID}', '${Contact}', '${DOB}', '${email}', '${password}')`;
    db.query(sql_query, (error, result)=>{
      if(error){
        console.log("Something went wrong");
      }
      else{
        console.log(result);
        console.log("Inserted into table");
      } 
  })
  }
)

app.post("/bookingcreate", (req,res)=>{
  const {start_date, end_date, Type, adult_num, email, child_num, CID } = req.body; 
  const sQry = `Insert into booking(Start_Date, End_Date, Adult_num, Child_Num, Booking_ID, CID, email, Type) values ('${start_date}', '${end_date}', '${adult_num}', '${child_num}', '${bookingID = uuid()}', '${CID}', '${email}', '${Type}' )`;
  db.query(sQry, (error, result)=>{
    if(error){
      console.log("Something went wrong");
    }
    else{
      console.log(result);
      console.log("Inserted into table");
      res.redirect("/bookingcreate");
    } 
})
}
)





// app.get('/test', (req,res)=>{
//   res.send(user1);
// })

// let q = `INSERT INTO Customer(CID, fname, lname, NID, Contact, DOB, email, password) VALUES ('${id=uuid()}', '${chance.first()}', '${chance.last()}', '${NID}', '${contact}', '${DOB}', '${email}', '${password}')`;


// let year = chance.year({min:2000, max:2030});
// let month = chance.month({raw:true});


// let startMonth = parseInt(month.numeric);
// let endMonth = startMonth + Math.floor(Math.random() * (12 - startMonth));
// let startDay = Math.floor(Math.random()*29) + 1
// let endDay = startDay + Math.floor(Math.random() * (28-startDay));


// console.log('year: ' + year  );
// console.log('startMonth: ' + startMonth);
// console.log('endMonth: ' + endMonth);
// console.log('startDay: ' + startDay);
// console.log('endDay: ' + endDay);

// let startDate = `${year}-${startMonth}-${startDay}`;
// let endDate = `${year}-${endMonth}-${endDay}`;

// let q = `INSERT INTO datetest(start, end) VALUES ('${startDate}', '${endDate}')`;
// db.query(q, (error, result)=>{
//   if (error) throw error;
//   else console.log('Inserted');
// })


app.listen(port, ()=>{
  console.log("Listening");
})

