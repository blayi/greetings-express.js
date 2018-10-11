'use strict'
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetmeFunction =require('./greeting');
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const pg = require("pg");
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greetings';

const pool = new Pool({
    connectionString,
    ssl : useSSL
  });

const greetFun = GreetmeFunction(pool);
  // initialise session middleware - flash-express depends on it
  app.use(session({
    secret : "displaying error message",
    resave: false,
    saveUninitialized: true
  }));

  // initialise the flash middleware
  app.use(flash());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/',async function (req, res ) {
  let counter =await greetFun.counter();
  res.render('index');
})

app.post('/index',async function (req, res ) {
  // let users= await greetFun.returnNames();
  // let counter =await greetFun.counter();
  res.render('index')
})
  
app.get('/reset',async function (req, res ) {
  let reset = await greetFun.clear();
  res.render('greeted',{reset});
})

app.post('/greet', async function (req, res) {
  try{
    let personName = req.body.personName;
    let selectedLang = req.body.languageType;
    let greetPerson;
    let counter;
    if (selectedLang === undefined){
      req.flash('info', 'select language');
    }
    if (personName === ""){
      req.flash('info', 'enter name');
    }
    else{
      greetPerson = await greetFun.greet(personName, selectedLang);
      counter =await greetFun.counter();
    }
      res.render('index',{
        greetPerson,
        counter
      });
  }
  catch(err){
    res.send(err.stack)
  }  
});

app.get("/greeted",async function(req, res){
 let users= await greetFun.returnNames();
 let counter =await greetFun.counter();
 console.log(users);
 
    res.render('greeted',{
      users,
      counter
    })
  
})



app.get("/counter/:personName",async function(req, res ,next){
  try {
    let name =req.params.personName;
    let Retur = await greetFun.returnNames(name);
      let counter = Retur[0].counter;
      console.log(Retur)
         res.render('greetings',{
          counter,
          name
         })


  } catch (error) {
    
    next(error)
  }

    })


let PORT = process.env.PORT || 3008;
console.log(PORT)
app.listen(PORT, function(error){
  if (error){
    console.log(error)
  }
});
