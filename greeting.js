module.exports = function GreetmeFunction(pool) {

  var greet = async function (enteredName, selectedLang) {

        let userData = await pool.query('select * from users where name=$1', [enteredName.toUpperCase()])
        
        if (userData.rows.length === 0) {
          if(enteredName !=="" && selectedLang !== undefined){
            await pool.query('insert into users (name, counter) values ($1, $2)', [enteredName.toUpperCase(), 1])
          }
        } else {
          let increment = userData.rows[0].counter + 1;
          console.log(increment);
          await pool.query('update users set counter=$1 where name =$2', [increment, enteredName.toUpperCase()])
        }
        if (enteredName !== undefined || enteredName !== "") {
        if (selectedLang === 'Xhosa') {
          return "Molo, " + enteredName;
        } else if (selectedLang === 'English') {
          return "Good day, " + enteredName;
        } else if (selectedLang === 'Afrikaans') {
          return "Goeie dag, " + enteredName;
        }
       
      }
  }

  var getNames = async function (names) {
    let userData = await pool.query('select * from users where name =$1', [names])
    return userData.rows;
  }

  var counter = async function () {
    let result = await pool.query('select count(*) from users ');
    return result.rows[0].count;
  }
var returnNames = async function(){
let username = await pool.query('select * from users');
return username.rows;
}
  var clear = async function () {
    let reset = await pool.query('delete from users');
  return reset ;

  }

  return {
    greet,
    getNames,
    counter,
    returnNames,
    clear

  }
}
