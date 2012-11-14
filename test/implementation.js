var assert = require('assert'),
       Mvc = require('../index'),
       mvc =  new Mvc();



/////////////////////
//	Add a few commands
/////////////////////

// a simple guard to avoid conditionals and for reuse
var mustBeObjectGuard = function(e){
	if (!e.msg) throw new TypeError('Options must an object!')// use in instead!
	return e;
}

//simple object command
var commandHello = {};
commandHello.execute = function (e){
  this.e = mustBeObjectGuard(e);
  console.log("Hello, " + this.e.msg);
  return "Hello";
}

assert.equal(typeof commandHello.execute, "function");

//simple function command
var commandYo = function (){};
commandYo.execute = function (e){
   if (e) console.log("Yo, " + e.msg);
   return "Yo";
}

assert.equal(typeof commandYo.execute, "function");



//Add to Command Map for global commands
var commandMapTest = new mvc.CommandMap();
commandMapTest.map("commandHello",commandHello);

assert.equal(commandMapTest.get("commandHello").execute({msg:"Halla"}), "Hello");
// THIS SHOULD FAIL  // assert.equal(commandMapTest.get("commandHello"), "::COMMAND::");


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

//or maybe synbtactic sugar like this in the future:
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


////////////////////////////////////
//Kick it: Update model.data
////////////////////////////////////


pageModel.update({name:"henrik"});





///////////////////////////////////////////////////
// Future Shorthand versions and syntactic sugar //
//////////////////////////////////////////////////

/*
var shortContext = new mvc.Context().addModel(m).addView(v).guardWith(g);

pageView.bind(resizeCommand).to("onResize").guardWith(isDesktop);
pageModel.bind(updateCommand).to("onUpdate").guardWith(nameIsUpdated);

//simple stream
pageModel().pipe(pageView)

//stream with guards and modiufiers
pageModel().pipe(isString).pipe(makeUpperCase).pipe(pageView);

*/