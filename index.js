const express =require ('express')
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetmeFunction =require('./greeting');

const app = express();

const greetFun = GreetmeFunction();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/greet', function (req, res) {
let enteredName = req.body.enteredName;
let selectedLang = req.body.selectedLang;
let greetPerson = greetFun.greet(enteredName, selectedLang);
let greetCount = greetFun.counter();

  res.render('greeting');
  greetPerson,
  greetCount
})

app.get('/greet/:enteredName/:selectedLang', function(req, res) {
  let enteredName = req.params.enteredName;
  let selectedLang = req.params.selectedLang;
  let greetPerson = greetPeople.greet(selectedLang, enteredName);
  let greetCount = greetFun.counter();

  res.render('greeting', {
    greetPerson,
    greetCount
  });
});


let PORT = process.env.PORT || 3008;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});
