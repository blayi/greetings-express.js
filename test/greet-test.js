const assert = require("assert");
let greetings = require("../greeting");
const pg = require("pg");
const Pool = pg.Pool;


// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greetings';


const pool = new Pool({
    connectionString,
  
  });

  const greetFunc = greetings(pool);
describe('The Greeting Function', function() {

  beforeEach(async function(){
    await pool.query("delete from users;");
});

  it('should return Greeting in English and the name of the person greeted',async function() {
    let greeter = await greetFunc.greet('Aya','English');  
    assert.equal(greeter, 'Good day, Aya');
  });

  it('should return Greeting in Xhosa and the name of the person greeted',async function() {
    let greeter =await greetFunc.greet("Lihle", 'Xhosa');
    assert.equal(greeter, 'Molo, Lihle');
  });

  it('should return Greeting in Afrikaans and the name of the person greeted',async function() {
    var greeter =await greetFunc.greet("Siya", 'Afrikaans');
    assert.equal(greeter, 'Goeie dag, Siya');
  });
  it('should return Greeting undefined if name is not defined', async function() {
    let greeter = await greetFunc.greet("");
    assert.equal(greeter, undefined);
  });
  it('should be able to count different names of people greeted in the same language',async function(){

      await greetFunc.greet("Phindi", 'Xhosa');
      await greetFunc.greet("Shaun", 'Xhosa');
      await greetFunc.greet("Banele", 'Xhosa');
      await greetFunc.greet("lwando", 'iXhosa');

      assert.equal(await greetFunc.counter(), 4)
    });

    it('should count once for the same name entered despite the language entered', async function(){

      await greetFunc.greet("siya", 'Afrikaans')
      await greetFunc.greet("siya", 'English')
      await greetFunc.greet("siya", 'IsiXhosa')

      assert.equal( await greetFunc.counter(), 1);
    });


     after(function(){
        pool.end();
    })



});
