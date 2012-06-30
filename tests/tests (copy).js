var assert = require('assert');
var Mvc = require('../index');

var mvc =  Mvc();

//Add a context
var testContext = new mvc.Context();
assert.equal(testContext.toString(), "::CONTEXT::");

//Add a few commands
var commandHello = new mvc.Command();
commandHello.execute = function (){
  console.log("Hello Yes");
  return "Hello Yes";
}
assert.equal(commandHello.toString(), "::COMMAND::");

var commandYo = new mvc.Command();
commandYo.execute = function (){
  console.log("Yo Yes");
  return "Yo Yes";
}
assert.equal(commandYo.toString(), "::COMMAND::");

//Add a Mediator so that views and models can find it
var commandMediatorTest = mvc.CommandMediator;
//commandMediatorTest.subscribe("hello",commandHello.execute);
//commandMediatorTest.subscribe("hello",commandYo.execute);
commandMediatorTest.on("hello", commandHello.execute)
commandMediatorTest.many("hello", 1, commandYo.execute)

commandMediatorTest.emit("hello");
commandMediatorTest.emit("*");

//Command Map
var commandMapTest = new mvc.CommandMap();

commandMapTest.map("commandHello",commandHello);

assert.equal(commandMapTest.getMap("commandHello").execute(), "Hello Yes");
assert.equal(commandMapTest.getMap("commandHello"), "::COMMAND::");


//Add a view
var testView = new mvc.View(){

  this.open = function(){
      
  }

  this.close = function(){

  }

}


//console.log(commandMediatorTest);

//console.log("All test passed ?? "+ commandMapTest.getMap("commandHello").execute());

console.log("All test passed");