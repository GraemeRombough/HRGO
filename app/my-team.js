var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var pageObject;
const Label = require("tns-core-modules/ui/label/").Label;
const fromObject = require("tns-core-modules/data/observable").fromObject;


exports.onNavigatingTo = function(args){
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    
};
exports.pageLoaded = function(args) {
    
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};
exports.addEmployee = function(args){
    var newEmployee = {empName: pageData.employeeName, empEmail: pageData.employeeEmail};
    var employeeString = JSON.stringify(newEmployee);
    console.log(employeeString);

    var layout = pageObject.getViewById("teamListStack");
    // create dynamic content
    var label = new Label();
    label.text = "dynamic";
    // connect to live view
    layout.addChild(label);
    
};

