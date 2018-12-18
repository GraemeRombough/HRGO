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
    
    pageData.set("infoVisible", false);
    var salaryData = returnSalary("AS   01", "3");
    pageData.set("annualRate", "$" + Math.round(salaryData.annually * 100 + Number.EPSILON ) / 100);
    pageData.set("biweeklyRate", "$" + Math.round(salaryData.biweekly * 100 + Number.EPSILON ) / 100);
    pageData.set("dailyRate", "$" + Math.round(salaryData.daily * 100 + Number.EPSILON ) / 100);
    pageData.set("hourlyRate", "$" + Math.round(salaryData.hourly * 100 + Number.EPSILON ) / 100);
    pageData.set("overtime1Rate", "$" + Math.round((salaryData.hourly * 1.5) * 100 + Number.EPSILON ) / 100);

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
exports.getCalculatedInfo = function(){
    var overtimeCalc, hourlyCalc, dailyCalc, biweeklyCalc, annuallyCalc;
    var totalValue = 0;
    var salaryData = returnSalary("AS   01", "3");
    if(pageData.get("overtime1Number")){
        overtimeCalc = pageData.get("overtime1Number");
        totalValue += overtimeCalc * salaryData.hourly * 1.5;
    };
    if(pageData.get("hourlyNumber")){
        hourlyCalc = pageData.get("hourlyNumber");
        totalValue += hourlyCalc * salaryData.hourly;
    };
    if(pageData.get("dailyNumber")){
        hourlyCalc = pageData.get("dailyNumber");
        totalValue += dailyCalc * salaryData.daily;
    };
    if(pageData.get("biweeklyNumber")){
        biweeklyCalc = pageData.get("biweeklyNumber");
        totalValue += biweeklyCalc * salaryData.biweekly;
    };
    if(pageData.get("annuallyNumber")){
        anuallyCalc = pageData.get("annuallyNumber");
        totalValue += annuallyCalc * salaryData.annually;
    };

    pageData.set("calculatedMoney", "Gross Salary Calculation: $" + Math.round(totalValue * 100 + Number.EPSILON ) / 100);
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};
var returnSalary = function(selectedClass, selectedStep){
    var databaseReturn = [];
    var databaseLine = {};
    databaseLine = {classCode:"STDNT", step:"1", hourly:13.47, daily:101.025, biweekly:1010.25, annually:26266.5};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"2", hourly:14.43, daily:108.225, biweekly:1082.25, annually:28138.5};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"3", hourly:15.42, daily:115.65, biweekly:1156.5, annually:30069};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"4", hourly:16.49, daily:123.675, biweekly:1236.75, annually:32155.5};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"5", hourly:17.64, daily:132.3, biweekly:1323, annually:34398};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"6", hourly:18.91, daily:141.825, biweekly:1418.25, annually:36874.5};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"7", hourly:20.19, daily:151.425, biweekly:1514.25, annually:39370.5};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"STDNT", step:"8", hourly:21.64, daily:162.3, biweekly:1623, annually:42198};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"AS   01", step:"1", hourly:26.4297435897436, daily:198.223076923077, biweekly:1982.23076923077, annually:51538};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"AS   01", step:"2", hourly:27.4348717948718, daily:205.761538461538, biweekly:2057.61538461538, annually:53498};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"AS   01", step:"3", hourly:28.4769230769231, daily:213.576923076923, biweekly:2135.76923076923, annually:55530};
    databaseReturn.push(databaseLine);
    databaseLine = {classCode:"AS   01", step:"4", hourly:29.5605128205128, daily:221.703846153846, biweekly:2217.03846153846, annually:57643};

    for(i=0; i < databaseReturn.length; i++){
        if(databaseReturn[i].classCode == selectedClass && databaseReturn[i].step == selectedStep){
            return databaseReturn[i];
            break;
        }
    }
};

