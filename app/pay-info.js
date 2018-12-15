var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;


exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
    //args.object.bindingContext = pageData;
    const page = args.object;
    const vm = fromObject({
        classifications: [
            { id: 1, classification: "STDNT00", classCode: "STDNT00" },
            { id: 2, classification: "AS   01", classCode: "AS01" },
            { id: 3, classification: "AS   02", classCode: "AS02" },
            { id: 4, classification: "AS   03", classCode: "AS03" },
            
        ],
        index: 1,
        selectedItem: ""
    });
    page.bindingContext = vm;

};
exports.onListPickerLoaded = function(args){
        const listPicker = args.object;
        const vm = listPicker.page.bindingContext;
        listPicker.on("selectedIndexChange", (lpargs) => {
            vm.set("index", listPicker.selectedIndex);
            console.log(`ListPicker selected value: ${listPicker.selectedValue}`);
            console.log(`ListPicker selected index: ${listPicker.selectedIndex}`);
        });
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};

