var Mediator = require('mediator'),
	mediator = new Mediator() ,
		util = require('util');

Mvc = function(){
	var self = this;
	this.className = "::MVCommand::";
	
};

Mvc.prototype.toString = function (){
	return "::MVC::";
};

Mvc.prototype.Context = function (p){
	//A simple facade wrapper and container
	var self = this;
	this.parent = p || undefined;

	// automaticly set up mediators
	this.contextMediator = new Mediator();
	this.modelMediator = new Mediator();
	this.viewMediator = new Mediator();

	//this.eventBus = new Mediator();

	this.toString = function(){
		return "::CONTEXT::"; //Does not work Why!?
	};
};


Mvc.prototype.Context.prototype.addContext = function (){
	console.log(this);
	var model = new this.Context(this);

	this.modelMediator.add(model,"onUpdate");

	return model;
};

Mvc.prototype.Context.prototype.addModel = function (n){
	var model;
	if (n instanceof Mvc.prototype.Model){
		model = n;
	} else {
		model = new Mvc.prototype.Model;
	}
	
	this.modelMediator.add(model,"onUpdate");
	return model;
};

Mvc.prototype.Context.prototype.addView = function (n){

//WATCH OUT FOR GARBAGE COLLECTION OF OLD VALUES
//-> check to see if view all ready exists

	var view = new Mvc.prototype.View(n);

	view.context = this;

	// Should be overridden
	view.render = function(e){};

	//Subscribe view to model
	this.modelMediator.add(view,"onUpdate", "render");

	//adding views events
	this.viewMediator.add(view,"onRender");


	return view;
};


Mvc.prototype.View = function (n){
	this.name = n;
	that = this;

	//Add destroy func for garbage collection

	this.destroy = function(){
		//console.log("Crash and BURN" + this.context);
		this.context.modelMediator.removeFromAll(this);
		this.context.viewMediator.removeFromAll(this);

		//delete this;
	}
};


//Just a mock model for now
Mvc.prototype.Model = function (d){

	that = this;
	this.data = d;
};


Mvc.prototype.Context.prototype.mapCommand = function (cmd,event,tp){
	var type =  tp || "view";

	//adding views events
	try{
		this[type].add(cmd, event, cmd); //this one broadcast

	} catch (err) {
		console.warning("Context.map type " + tp + "Mediator does not exists");
	}
};


/*
// Unnescacery
Mvc.prototype.Command = function (){

	this.execute = function(){
		console.log("Executing command...");
	};

	this.toString = function(){
		return "::COMMAND::";
	};
};
*/

Mvc.prototype.CommandMap = function (){

	this.maps = {};

	this.map  = function (name,cmd){
		this.maps[name] = cmd;
	};

	this.unmap  = function (){

	};

	this.getMap  = function (name){
		return this.maps[name];
	};
	
};


//should write new Mediator
// Should be singleton?
//CommandMediator = new Mediator();


module.exports = function(){
	return new Mvc();
};