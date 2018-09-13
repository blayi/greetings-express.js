'use strict'
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetmeFunction =require('./greeting');

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

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/',async function (req, res ) {
  res.render('index');
})

app.post('/greet', async function (req, res) {
  try{
    let enteredName = req.body.personName;
    let selectedLang = req.body.languageType;
    let greetPerson = await greetFun.greet(enteredName, selectedLang);
    let counter =await greetFun.counter();
    // console.log(req.body);
      res.render('index',{
        greetPerson,
        counter
      });
  }
  catch(err){
    res.send(err.stack)
  }
  

});


// app.get('/greet/:enteredName/:selectedLang', function(req, res) {
//   let enteredName = req.params.enteredName;
//   let selectedLang = req.params.selectedLang;
//   let greetPerson = greetPeople.greet(selectedLang, enteredName);
//   let greetCount = greetFun.counter();
//
//   res.render('greeting', {
//     greetPerson,
//     greetCount
//   });
// });

// app.post('/greets', function (req, res) {
//   let greetName = req.body.greeted_names;
//   res.render('greets');
// });
//
// app.post('/', function(req, res){
//   greetPerson.reset();
//
// });

let PORT = process.env.PORT || 3008;
console.log(PORT)
app.listen(PORT, function(error){
  if (error){
    console.log(error)
  }
  console.log('App starting on port', PORT);
});
