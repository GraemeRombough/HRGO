var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var selectedClass, selectedStep;
var classDD;
var classSteps;
var pageObject;
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
const fromObject = require("tns-core-modules/data/observable").fromObject;
var pageVM;

exports.onNavigatingTo = function(args){
    selectedClass = null;
    selectedStep = null;
    classDD = getClassList();
    classSteps = getStepCount();
    //const classifications = getClassList();
    var steps = [1];
    const page = args.object;
    pageObject = page;
    pageData = fromObject({
        classItems: classDD,
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
        selectedClass = [listPicker.selectedIndex, listPicker.selectedValue];
        selectedStep = null;
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
        selectedStep = [listPicker.selectedIndex, listPicker.selectedValue];
        
        
        //loadSteps(listPicker.selectedValue,args);
    });
}
exports.getSalaryInfo = function(args){
    //pageData.set("showInfo", true);
    //args.object.bindingContext = pageData;
    console.log("getSalaryInfo");
    
    pageData.set("infoVisible", false);
    if(selectedClass != null && selectedStep !=null){
        var salaryData = returnSalary(selectedClass[1], selectedStep[1]);
        pageData.set("annualRate", "$" + Math.round(salaryData.annually * 100 + Number.EPSILON ) / 100);
        pageData.set("biweeklyRate", "$" + Math.round(salaryData.biweekly * 100 + Number.EPSILON ) / 100);
        pageData.set("dailyRate", "$" + Math.round(salaryData.daily * 100 + Number.EPSILON ) / 100);
        pageData.set("hourlyRate", "$" + Math.round(salaryData.hourly * 100 + Number.EPSILON ) / 100);
        pageData.set("overtime1Rate", "$" + Math.round((salaryData.hourly * 1.5) * 100 + Number.EPSILON ) / 100);
        pageData.set("salaryVisible", true);
    }
};
var loadSteps = function(selection,inputArg){
    console.log(`loadSteps selectedClass = ${selectedClass}`);
    var numOfSteps;
    var steps = [];
    console.log(classSteps.length);
    for(x=0; x < classSteps.length; x++){
        if(classSteps[x].class == selectedClass[1]){
            numOfSteps = classSteps[x].steps;   
        }
    }

    for(i = 0; i < numOfSteps; i++){
        steps.push(i+1);
    }
    //console.log(`steps: ${steps.length}`);
    console.log(`steps: ${numOfSteps}`);
    pageData.stepItems = steps;
    pageData.stepIndex = 1;

};
exports.getCalculatedInfo = function(){
    var overtimeCalc, hourlyCalc, dailyCalc, biweeklyCalc, annuallyCalc;
    var totalValue = 0;
    var salaryData = returnSalary(selectedClass[1], selectedStep[1]);
    if(pageData.get("overtime1Number")){
        overtimeCalc = pageData.get("overtime1Number");
        totalValue += overtimeCalc * salaryData.hourly * 1.5;
    };
    if(pageData.get("hourlyNumber")){
        hourlyCalc = pageData.get("hourlyNumber");
        totalValue += hourlyCalc * salaryData.hourly;
    };
    if(pageData.get("dailyNumber")){
        dailyCalc = pageData.get("dailyNumber");
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
var getClassList = function(){
    var databasePull = getFromDataBase();
    var classList = [];
    var itemIsDuplicate = false;
    for(i = 0; i < databasePull.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < classList.length; x++){
            if (databasePull[i].classCode == classList[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            classList.push(databasePull[i].classCode);
            console.log(databasePull[i].classCode);
        }
    }
    return classList;
}
var getStepCount = function(){
    var databaseReturn = getFromDataBase();
    var numOfSteps = 0;
    var returnClassSteps = [];
    
    for(i = 0; i < classDD.length; i++){
        numOfSteps = 0;
        var stepItem = {};
        for(x=0; x < databaseReturn.length; x++){
            if (classDD[i] == databaseReturn[x].classCode){
                numOfSteps++;
            }
        }
        stepItem = {class:classDD[i], steps:numOfSteps};
        returnClassSteps.push(stepItem);
        console.log("class: " + classDD[i] +  "steps: " + numOfSteps);
    }
    return returnClassSteps;
}
var returnSalary = function(selectedClassX, selectedStepX){
    var salaryList = getFromDataBase();    
    console.log("returnSalary");
    for(i=0; i < salaryList.length; i++){
        if(salaryList[i].classCode == selectedClass[1] && salaryList[i].step == selectedStep[1]){
            return salaryList[i];
            break;
        }
    }
};
var getFromDataBase = function(){
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

    return databaseReturn;
}

