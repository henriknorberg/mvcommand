/* EXAMPLE IMPLEMENTATION OF MVCC */

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
	//this.emit("viewRendered", this);
  this.emit("onRender", "Done rendering view...");
  this.emit("onHello", "Allo");
};

pageView.onCustomEvent = function (){
	//console.log(that);
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
		//console.log(this.member);
		//pageModel.update(that.data);

		request('http://www.google.com', function (error, response, body) {
		if (!error && response.statusCode == 200){
				// console.log(body); // Print the google web page.
				// pageModel.update();
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
	//pageView.render();

//});

