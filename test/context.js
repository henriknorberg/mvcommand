  var Mvcommand = require("../index"),
          mvc =  new Mvcommand(),
     Mediator = require("../node_modules/mediator"),
       assert = require("assert"),
       test = require("tap").test;

//Testing with tap for easy compile time results and CI
var context = new mvc.Context();


test("Check Context", function (t) {

  t.equal("object", typeof context, "context should be an Object");
  t.type(context,  mvc.Context, "context should be of type Context");

  t.end();
});

test("\nCheck if Context has models configured", function (t) {

  t.ok(context.contextMediator, "There is a contextMediator");
  t.ok(context.modelMediator, "There is a modelMediator");
  t.ok(context.viewMediator, "There is a viewMediator");

  t.end();
});

test("\nAdd addModel", function (t) {
  var model = context.addModel();
  t.type(model,  mvc.Model, "model should be of type Model");

  t.end();
});

test("\nAdd addView", function (t) {
  var view = context.addView();
  t.type(view,  mvc.View, "view should be of type View");
  t.ok(view.destroy, "view has a destroy method for garbage collection");

  t.end();
});


