var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var pageData = new observable.Observable();
var applicationSettings = require("application-settings");
var subNavTitle = "YourPayInformation";
var navList = [];


exports.pageLoaded = function(args) {
    const page = args.object;
    //vm = new Observable();
    page.bindingContext = pageData;
    checkLanguage();
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page"); 
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("profile-page");
    
}
exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    //topmost.navigate("feedback-page");
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:'feedback-page',
        context:{Language: "ENG",
                PageName: pageDetails[1].split("/")[1].split(".")[0],
                DateTime: TODAY
                }
            }
    topmost.navigate(navigationOptions); 
}
exports.footer5 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("POC-page");
}
exports.saveProfile = function(){
    console.log(pageData.get("preferredLanguage"));    
    var selectedLanguage;
    if(pageData.get("preferredLanguage") == true){
        selectedLanguage = "French";
    }else{
        selectedLanguage = "English";
    };
    console.log("SaveProfile: " + selectedLanguage);
    if(pageData.get("preferredLanguage")){
        applicationSettings.setString("PreferredLanguage", selectedLanguage);
    }
    if(pageData.get("workEmail")){
        applicationSettings.setString("WorkEmail", pageData.get("workEmail"));
    }
};
var checkLanguage = function(){   
    if(applicationSettings.hasKey("PreferredLanguage")){
        console.log(applicationSettings.getString("PreferredLanguage"));
        var existingLanguage;
        if(applicationSettings.getString("PreferredLanguage") == "French"){
            existingLanguage = true;
        }else{
            existingLanguage = false;
        }
        pageData.set("preferredLanguage", existingLanguage);
    }else{
        pageData.set("preferredLanguage", false);
    }
    if(applicationSettings.hasKey("WorkEmail")){
        pageData.set("workEmail", applicationSettings.getString("WorkEmail"));
    }
};

