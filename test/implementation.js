var assert = require('assert'),
       Mvc = require('../index'),
       mvc =  new Mvc();

//a simple guard
var noMsgGuard = function(e){
	if (!e.msg) throw new TypeError('Options must an object!');
	return e;
}

//Add a few commands
var commandHello = {};
commandHello.execute = function (e){
  e = noMsgGuard(e);
  console.log("Hello, " + e.msg);
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
var pageModel = pageContext.addModel();
pageModel.name = "pageModel";
pageModel.update = function(data){
	this.data = data;

	//broadcast event
	this.emit("onUpdate",{msg:"Model updated", data:data});
}


//Subscribe commands to pageContext model
pageContext.modelMediator.add(commandHello,"onUpdate",commandHello.execute);

//////////////////
//Add a view
//////////////////

var pageView = pageContext.addView();

pageView.render = function(e){
	var self = this;
	console.log("Test view is rendering: ");

	//broadcast event
	this.emit("onRender",{msg:" pageView rendering"});

	this.open();
};


pageView.open = function(){
	var self = this
	setTimeout(function(){self.close()},1000);
	//broadcast event
	this.emit("onOpen",{msg:"Iam opening"});
};
pageView.close = function(){

	//broadcast event
	this.emit("onClosed",{msg:"Iam closing"});
	
	console.log("All page passed");
};



//Subscribe commands to pageContext views
pageContext.viewMediator.add(commandHello,"onRender","execute");
pageContext.viewMediator.add(commandYo,"onClosed","execute");

//or maybe like this:
//pageView.bind(resizeCommand).to("onResize").guardWith(isDesktop);


var pageView2 = pageContext.addView();
pageView2.name = "ghost";
pageView2.render = function(e){
	var self = this;

	//broadcast event
	this.emit("onRender",{});

	this.open();
};

pageView2.destroy();




pageView2 = pageContext.addView();

pageView2.render = function(e){
	var self = this;
	console.log("Page view 2 is rendering: ");

	//broadcast event
	this.emit("onRender",{msg:" pageView2 rendering"});
	this.emit("onSpecialRender",{});

	this.open();
};

//Subscribe commands to pageContext views
pageContext.viewMediator.add(commandHello,"onSpecialRender",commandHello.execute);


/////////////////////////////////////////
//	Add Context in context
//- but try to consume the parent model
/////////////////////////////////////////

console.log(pageModel.mediators);

var headerContext = new mvc.Context(pageContext);
var headerModel = headerContext.addModel(pageModel);

var headerView = headerContext.addView();
headerView.render = function(e){
	var self = this;
	console.log("Head view is rendering: ");

	//broadcast event
	this.emit("onRender",{msg:" headView rendering"});

	this.open();
};

headerContext.viewMediator.add(commandHello,"onRender",commandHello.execute);

//var mainContext = new mvc.Context(pageContext);
//var footerContext = pageContext.addContext();




/**/


//////////////////
//Shorthand version
//////////////////

/*
var shortContext = new mvc.Context();

var shortContext = new mvc.Context().addModel().addView().guardWith().;

pageView.bind(resizeCommand).to("onResize").guardWith(isDesktop);
pageModel.bind(updateCommand).to("onUpdate").guardWith(nameIsUpdated);

//Example Guard
//http://javascriptweblog.wordpress.com/2010/07/19/a-javascript-function-guard/


*/

////////////////////////////////////
//Kick it: Update model.data
////////////////////////////////////


pageModel.update({name:"henrik"});





