var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
const fromObject = require("tns-core-modules/data/observable").fromObject;
var pageVM;

exports.onNavigatingTo = function(args){
    const classifications = ["STDNT00", "AS   01", "AS   02", "AS   03", "AS   04"];
    var steps = [1,2,3,4,5,6,7,8];
    const page = args.object;
    pageData = fromObject({
        classItems: classifications,
        classIndex: 1,
        stepItems: steps,
        stepIndex:1,
        infoVisible: true,
        salaryVisible: false
    }); 
    page.bindingContext = pageData;
    
}
exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
    //args.object.bindingContext = pageData;
    //pageData.set("infoVisible", true);
    console.log(pageData.get("infoVisible"));
    //args.object.bindingContext = pageData;
};
exports.onClassListPickerLoaded = function(args){
    const listPicker = args.object;
    const vm = listPicker.page.bindingContext;
    listPicker.on("selectedIndexChange", (lpargs) => {
        vm.set("classIndex", listPicker.selectedIndex);
        console.log(`ListPicker selected value: ${listPicker.selectedValue}`);
        console.log(`ListPicker selected index: ${listPicker.selectedIndex}`);
        loadSteps(listPicker.selectedValue,args);
    });
}
exports.onStepListPickerLoaded = function(args){
    const listPicker = args.object;
    const vm = listPicker.page.bindingContext;
    listPicker.on("selectedIndexChange", (lpargs) => {
        vm.set("stepIndex", listPicker.selectedIndex);
        console.log(`ListPicker selected value: ${listPicker.selectedValue}`);
        console.log(`ListPicker selected index: ${listPicker.selectedIndex}`);
        loadSteps(listPicker.selectedValue,args);
    });
}
exports.getSalaryInfo = function(args){
    //pageData.set("showInfo", true);
    //args.object.bindingContext = pageData;
    console.log("getSalaryInfo");
    pageData.set("annualRate", "100,000");
    pageData.set("infoVisible", false);
    pageData.set("salaryVisible", true);
};
var loadSteps = function(selectedClass,inputArg){
    console.log('loadSteps');
    var numOfSteps;
    var steps = [];
    switch(selectedClass){
        case "STDNT00":
        numOfSteps = 8;
        break;
        case "AS   01":
        numOfSteps = 4;
        break;
    };
    for(i = 0; i < numOfSteps; i++){
        steps.push(i+1);
    }
    console.log(`steps: ${steps.length}`);
    

};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};
var returnSalary = function(){
    var databaseReturn = [];
    var databaseLine = {};
    databaseLine = {classCode:"STDNT", step:"1", hourly:13.47, daily:101.025, biweekly:1010.25, annually:26266.5};
    databaseLine = {classCode:"STDNT", step:"2", hourly:14.43, daily:108.225, biweekly:1082.25, annually:28138.5};
    databaseLine = {classCode:"STDNT", step:"3", hourly:15.42, daily:115.65, biweekly:1156.5, annually:30069};
    databaseLine = {classCode:"STDNT", step:"4", hourly:16.49, daily:123.675, biweekly:1236.75, annually:32155.5};
    databaseLine = {classCode:"STDNT", step:"5", hourly:17.64, daily:132.3, biweekly:1323, annually:34398};
    databaseLine = {classCode:"STDNT", step:"6", hourly:18.91, daily:141.825, biweekly:1418.25, annually:36874.5};
    databaseLine = {classCode:"STDNT", step:"7", hourly:20.19, daily:151.425, biweekly:1514.25, annually:39370.5};
    databaseLine = {classCode:"STDNT", step:"1", hourly:21.64, daily:162.3, biweekly:1623, annually:42198};
    databaseReturn.push(databaseLine);


};

