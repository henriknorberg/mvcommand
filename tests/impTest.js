var assert = require('assert'),
       Mvc = require('../index'),
       mvc =  new Mvc();


//Add a few commands
var commandHello = {};
commandHello.execute = function (e){
  if (e) console.log("Hello, " + e.msg);
  return "Hello";
}
assert.equal(typeof commandHello.execute, "function");

var commandYo = function (){};
commandYo.execute = function (e){
   if (e) console.log("Yo, " + e.msg);
  return "Yo";
}

assert.equal(typeof commandYo.execute, "function");

/*

//Command Map
var commandMapTest = new mvc.CommandMap();

commandMapTest.map("commandHello",commandHello);

assert.equal(commandMapTest.getMap("commandHello").execute(), "Hello");
assert.equal(commandMapTest.getMap("commandHello"), "::COMMAND::");

*/


//////////////////
//Add a context
//////////////////
var pageContext = new mvc.Context();
assert.equal(pageContext.toString(), "::CONTEXT::");

//////////////////
//Add a model
//////////////////
var testModel = pageContext.addModel();

testModel.update = function(data){
	this.data = data;

	//broadcast event
	this.emit("onUpdate",{msg:"Model updated", data:data});
}


//Subscribe commands to pageContext model
pageContext.modelMediator.add(commandHello,"onUpdate",commandHello.execute);

//////////////////
//Add a view
//////////////////

var testView = pageContext.addView();

testView.render = function(e){
	var self = this;
	console.log("Test view is rendering: ");

	//broadcast event
	this.emit("onRender",{msg:" testView rendering"});

	this.open();
};


testView.open = function(){
	var self = this
	setTimeout(function(){self.close()},1000);
	//broadcast event
	this.emit("onOpen",{msg:"Iam opening"});
};
testView.close = function(){

	//broadcast event
	this.emit("onClosed",{msg:"Iam closing"});
	
	console.log("All test passed");
};



//Subscribe commands to pageContext views
pageContext.viewMediator.add(commandHello,"onRender","execute");
pageContext.viewMediator.add(commandYo,"onClosed","execute");


var testView2 = pageContext.addView();
testView2.name = "ghost";
testView2.render = function(e){
	var self = this;

	//broadcast event
	this.emit("onRender",{msg:" THIS SHOULD NOT SHOW UP "});

	this.open();
};

testView2.destroy();




testView2 = pageContext.addView();

testView2.render = function(e){
	var self = this;
	console.log("Test view 2 is rendering: ");

	//broadcast event
	this.emit("onRender",{msg:" testView2 rendering"});
	this.emit("onSpecialRender",{msg:" testView2 special rendering"});

	this.open();
};



//Subscribe commands to pageContext views
pageContext.viewMediator.add(commandHello,"onSpecialRender",commandHello.execute);


var headerContext = new mvc.Context(pageContext);
var mainContext = new mvc.Context(pageContext);

//var footerContext = pageContext.addContext();


//////////////////
//Add Context in context
//////////////////

/**/


//////////////////
//Shorthand version
//////////////////

/*
var shortContext = new mvc.Context();


pageView.bind(resizeCommand).to("onResize").guardWith(isDesktop);



*/

////////////////////////////////////
//Kick it: Update model.data
////////////////////////////////////


testModel.update({name:"henrik"});





