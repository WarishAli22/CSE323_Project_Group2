//REQUIRING DEPENDENCIES
const express = require('express');
const app = express();
const sql = require('mysql');
const {v4 : uuidv4} = require('uuid'); //Generates Unique ids

//PORT VARIABLE
const port = 3000;

//SERVING STATIC FILES
// app.use(express.static('assets/bootstrap-5.2.3/css'));
// app.use(express.static('assets/bootstrap-5.2.3/js'));
// app.use(express.static('assets/css'));
 app.use('/assets', express.static('assets'));




//Gives access to views folder from any path
// const path = require('path')
// app.set('views', path.join(__dirname, 'views'));

//Templating Engine
app.set('view engine', 'ejs');

//Middlewre
app.use(express.urlencoded({extended:true}));

//Database Connection
const db = sql.createPool({
  connectionLimit:10,
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'hotel_database'
});

db.getConnection((error, connection)=>{
  if(error) throw error;
  console.log('Database Connected');
})

//GET REQUESTS
app.get('/signin', (req,res)=>{
  res.render('signin.ejs');
})

app.get('/signup', (req,res)=>{
  res.render('signup.ejs');
})


//POST REQUESTS

app.listen(port, ()=>{
  console.log("Listening");
})

