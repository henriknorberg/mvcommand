var Mediator = require('mediator'),
	mediator = new Mediator() ,
		util = require('util');

Mvc = function(){
	var self = this;
	this.className = "MVC";
	
};

Mvc.prototype.toString = function (){
	return "::MVC::";
};

Mvc.prototype.Context = function (p){
	//className = "CONTEXT";
	var self = this;
	this.parent = p || undefined;

	// automaticly set up mediators
	this.modelMediator = new Mediator();
	this.viewMediator = new Mediator();
	//this.commandMediator = new Mediator();

	//this.eventBus = new Mediator();

	this.toString = function(){
		return "::CONTEXT::"; //Does not work Why!?
	};
};

Mvc.prototype.Context.prototype.addModel = function (n){
	var model = new Model(n);

	this.modelMediator.add(model,"onModelUpdate");

	return model;
};

Mvc.prototype.Context.prototype.addView = function (n){
	var view = new View(n);

	//console.log(this.viewMediator)

	//adding views events
	//this.modelMediator.add(view,"onModelUpdate", view.onModelUpdate);
	this.viewMediator.add(view,"onRender");

	return view;
};


View = function (n){
	this.name = n;
	that = this;
};

/*
View.prototype.onModelUpdate = function(){
	//console.log("ModelUpdated");
};
*/

Model = function (){
	that = this;
};


Mvc.prototype.Context.prototype.mapCommand = function (cmd,event,tp){
	var type =  tp || "view";

	//adding views events
	try{
		//Fix this
		//this[type].add(cmd, event, cmd); //one to set data
		this[type].add(cmd, event, cmd); //this one broadcast

	} catch (err) {
		console.warning("Context.map type " + tp + "Mediator does not exists");
	}
};


Mvc.prototype.Command = function (){

	this.execute = function(){
		console.log("Executing command...");
	};

	this.toString = function(){
		return "::COMMAND::"; //Does not work Why!?
	};
};


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
CommandMediator = new Mediator();


module.exports = function(){
	return new Mvc();
};