var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
const fromObject = require("tns-core-modules/data/observable").fromObject;


exports.onNavigatingTo = function(args){
    const page = args.object;
    page.bindingContext = pageData;  
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
    
};

