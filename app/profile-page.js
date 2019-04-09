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

