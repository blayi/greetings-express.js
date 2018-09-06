module.exports = function GreetmeFunction() {

  var names = {};

  var getName = function(value) {
    if (value !== undefined && value !== "") {

      if (names[value] === undefined) {
        names[value] = 0;
      }

      return value;
    }


  }

  var greet = function(enteredName, selectedLang) {
    // send enteredName to be validated by the getName function
    var name = getName(enteredName);

    if (name) {
      if (selectedLang === 'Xhosa') {
        return "Molo, " + name;
      } else if (selectedLang === 'English') {
        return "Good day, " + name;
      } else if (selectedLang === 'Afrikaans') {
        return "Goeie dag, " + name;
      }
    }
  }

  var getNames = function() {
    return names;
  }

  var counter = function() {
    return Object.keys(names).length;
  }
  var clear = function() {
    names = {};
  }

  return {
    greet,
    getNames,
    counter,
  }
}
