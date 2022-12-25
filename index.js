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
// const path = require('path')
// app.set('views', path.join(__dirname, 'views'));

//Templating Engine
app.set('view engine', 'ejs');

//Middlewre
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/assets',express.static('assets'));
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
  database: 'testdb'
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
  res.render('room.ejs');
})

app.get('/bookingadmin', (req,res)=>{
  res.render('booking_table.ejs');
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
  res.render('customer.ejs');
})

app.get("/about", (req,res)=>{
  res.render('about.ejs');
})

app.get("/account", (req,res)=>{
  if(!req.session.email){
    res.redirect('/login');
  }
  else{
    res.render('account.ejs');
  }
  
})

//ADMIN GET REQUESTS
app.get("/adminhome", (req,res)=>{
  if(!req.session.admin_email){
    let message = "Access Denied";
      let redirPath = "/home";
      res.render('error_page.ejs', {message, redirPath} );
  }
  else{
    res.render("booking_table.ejs");
  }
 
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
      let redirPath = "/adminlogin";
      res.render('error_page.ejs', {message, redirPath} );
    }
    else if(admin_pass != result[0].password){
      let message = "Incorrect Credentials";
      let redirPath = "/adminlogin";
      res.render('error_page.ejs', {message, redirPath} );
    }

    else{
      req.session.admin_email = result[0].email;
      res.redirect("/adminhome");
    }

  })
})

app.post('/booking', (req,res)=>{
  
  let bookingID = uuid();
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;
  let adult_num = req.body.adult_num;
  let child_num = req.body.child_num;

  const sQry = `Insert into booking(Start_Date, End_Date, Adult_num, Child_Num, Booking_ID, CID, email, RoomNum) values ('${start_date}', '${end_date}', '${adult_num}', '${child_num}', '${bookingID}', '${req.session.cid}', '${req.session.email}', 1 )`

  db.query(sQry, (error, result)=>{
    if(error) throw error;
    console.log("Inserted into booking");
    res.redirect("/home");
  })

})




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

