var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
const fromObject = require("tns-core-modules/data/observable").fromObject;

exports.onNavigatingTo = function(args){
    const classifications = ["STDNT00", "AS   01", "AS   02", "AS   03", "AS   04"];
    const page = args.object;
    const vm = fromObject({
        pickerItems: classifications,
        index: 2
    });
    page.bindingContext = vm;

}
exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
    //args.object.bindingContext = pageData;
    
};
exports.onListPickerLoaded = function(args){
    
}
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};

