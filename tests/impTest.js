var assert = require('assert'),
       Mvc = require('../index'),
       mvc =  new Mvc();


//Add a few commands
var commandHello = new mvc.Command();
commandHello.execute = function (e){
  if (e) console.log("Hello, " + e.msg);
  return "Hello";
}
assert.equal(commandHello.toString(), "::COMMAND::");

var commandYo = new mvc.Command();
commandYo.execute = function (e){
   if (e) console.log("Yo, " + e.msg);
  return "Yo";
}

assert.equal(commandYo.toString(), "::COMMAND::");

/*

//Command Map
var commandMapTest = new mvc.CommandMap();

commandMapTest.map("commandHello",commandHello);

assert.equal(commandMapTest.getMap("commandHello").execute(), "Hello");
assert.equal(commandMapTest.getMap("commandHello"), "::COMMAND::");

*/

//Add a context
var testContext = new mvc.Context();
assert.equal(testContext.toString(), "::CONTEXT::");

//Add a model
var testModel = testContext.addModel();

testModel.update = function(data){
	console.log("Updating testModel...");
	this.data = data;

	//broadcast event
	this.emit("onUpdate",{msg:"Model updated", data:data});
}

//Add a view
var testView = testContext.addView();

testView.render = function(e){
	var self = this;
	console.log("Test view is rendering: ");
	console.log(e.data);

	//broadcast event
	this.member.emit("onRender",{msg:"Iam rendering"});
};

//Subscribe view to model
testContext.modelMediator.add(testView,"onUpdate",testView.render);

testView.open = function(){

	//broadcast event
	this.emit("onClosed",{msg:"Iam closing"});
};
testView.close = function(){

	//broadcast event
	this.emit("onClosed",{msg:"Iam closing"});
};

//Subscribe commands to testContext model
//testContext.modelMediator.add(commandHello,"onUpdate",commandHello.execute);

//Subscribe commands to testContext views
testContext.viewMediator.add(commandHello,"onRender",commandHello.execute);
testContext.viewMediator.add(commandYo,"onClosed",commandYo.execute);

//Update model.data
testModel.update({name:"henrik"});


console.log("All test passed");