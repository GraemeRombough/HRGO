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
    pageVM = page;
    const vm = fromObject({
        classItems: classifications,
        classIndex: 1,
        stepItems: steps,
        stepIndex:1
    }); 
    page.bindingContext = vm;
}
exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
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

