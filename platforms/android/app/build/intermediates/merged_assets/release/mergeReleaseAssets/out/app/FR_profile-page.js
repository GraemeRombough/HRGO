var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var pageData = new observable.Observable();
var applicationSettings = require("application-settings");
var subNavTitle = "YourPayInformation";
var navList = [];
var pageObject


exports.pageLoaded = function(args) {
    const page = args.object;
    //vm = new Observable();
    pageObject = page;
    page.bindingContext = pageData;
    checkLanguage();
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page"); 
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_profile-page");
    
}
exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    //topmost.navigate("feedback-page");
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:'FR_feedback-page',
        context:{Language: "ENG",
                PageName: pageDetails[1].split("/")[1].split(".")[0],
                DateTime: TODAY
                }
            }
    topmost.navigate(navigationOptions); 
}
exports.footer5 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_POC-page");
}
exports.viewTerms = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_TOS-page");
}
exports.setToEng = function(args){
    var freButton = pageObject.getViewById("FrenchButton");
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";
    
    freButton.style.backgroundColor = "#DDD";
    freButton.style.color = "#222";
    applicationSettings.setString("PreferredLanguage", "English");

    exports.saveProfile();
    var topmost = frameModule.topmost();
    topmost.navigate("profile-page");
}
exports.setToFre = function(args){
    var engButton = pageObject.getViewById("EnglishButton");
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";
    engButton.style.backgroundColor = "#DDD";
    engButton.style.color = "#222";
    applicationSettings.setString("PreferredLanguage", "French");
}
exports.saveProfile = function(){
    
    
    
    if(pageData.get("workEmail")){
        applicationSettings.setString("WorkEmail", pageData.get("workEmail"));
    }
};
var checkLanguage = function(){   
    if(applicationSettings.hasKey("PreferredLanguage")){
        console.log(applicationSettings.getString("PreferredLanguage"));
        var existingLanguage;
        if(applicationSettings.getString("PreferredLanguage") == "French"){
            var freButton = pageObject.getViewById("FrenchButton");
            freButton.style.backgroundColor = "rgb(0,31,91)";
            freButton.style.color = "#FFF";
        }
        if(applicationSettings.getString("PreferredLanguage") == "English"){
            var engButton = pageObject.getViewById("EnglishButton");
            engButton.style.backgroundColor = "rgb(0,31,91)";
            engButton.style.color = "#FFF";
        }   
    }
    
    if(applicationSettings.hasKey("WorkEmail")){
        pageData.set("workEmail", applicationSettings.getString("WorkEmail"));
    }
};

