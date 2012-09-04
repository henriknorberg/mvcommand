MVCCommand
=========
A Minimal agnostic MVCCommand micro-architecture for node.js and the browser. 

Features:

*No databindings. 
*No templates. 
*No routers. 
*Just wiring.

In production, not ready to be used!
========


Example
=======

````javascript

/*
 
-EXAMPLE IMPLEMENTATION OF MVCC 

 */

var Mvc = require('../index'),
    mvc =  new Mvc(),
   page = new mvc.Context(),
request = require('request');

//var domready = require('domready');

/////////////
// MODEL ///
///////////

var pageModel = page.addModel("pageModel");

pageModel.update = function (data){
	//this.emit("viewRendered", this);
	this.emit("onModelUpdate", "Model Updated");
	this.emit("onCustomEvent", "CustomEvent");
};

////////////
// VIEW ///
//////////

var pageView = page.addView("pageView");

pageView.render = function (){
  this.emit("onRender", "Done rendering view...");
  this.emit("onHello", "Allo");
};

pageView.onCustomEvent = function (){
	that.render();
};

page.modelMediator.add(pageView,"onCustomEvent", pageView.onCustomEvent);

pageView.onModelUpdate = function(data){
	console.log("pageView.onModelUpdate triggered");
	that.render();
};
page.modelMediator.add(pageView,"onModelUpdate", pageView.onModelUpdate);

///////////////
// COMMANDS //
/////////////

//*
var HelloCommand = function (d){
	var self = this;
	this.hello = d;
	this.name = "helloCommand";
	
	this.execute = function(){
		console.log("On dir "+ self.hello);
		request('http://www.google.com', function (error, response, body) {
		if (!error && response.statusCode == 200){
			}
		});
	};
};

page.mapCommand(new HelloCommand("Allo Allo").execute , "onHello", "viewMediator");
page.mapCommand(new HelloCommand("Hej Hej").execute , "onHello", "viewMediator");


///////////
// INIT //
/////////

//domready(function(){
	pageModel.update();
//});



````
                                                           

