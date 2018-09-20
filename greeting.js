module.exports = function GreetmeFunction(pool) {

  var names = {};

  //   var getName =  async function(value) {
  //     if (value !== undefined && value !== "") {

  //       if (names[value] === undefined) {
  //         names[value] = 0;
  //       }
  //     }
  // return value
  //   }


  var greet = async function (enteredName, selectedLang) {

      // send enteredName to be validated by the getName function
      // var name = getName(enteredName);
     
       
        let userData = await pool.query('select * from users where name =$1', [enteredName])
       
        if (userData.rows.length === 0) {
          if(enteredName !=="" && selectedLang !== undefined){
            await pool.query('insert into users (name, counter) values ($1, $2)', [enteredName, 1])

          }
        } else {
          let increment = userData.rows[0].counter + 1;
          await pool.query('update users set counter=$1 where name =$2', [increment, enteredName])
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

  var getNames = function () {
    return names;
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
