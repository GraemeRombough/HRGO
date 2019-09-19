var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var pageData;// = new observable.Observable();
var applicationSettings = require("application-settings");
const fromObject = require("tns-core-modules/data/observable").fromObject;
var subNavTitle = "YourPayInformation";
var navList = [];
var pageObject


exports.pageLoaded = function(args) {
    pageData = fromObject({
        selectedLanguage: ((applicationSettings.getString("PreferredLanguage") == "French") ? 1 : 0),
        lblFormTitle: ["SETTINGS", "PARAMÈTRES"],
        lblLanguageLabel: ["Preferred Language", "Langue"],
        lblWorkEmail: ["Work Email", "Courriel de travail"],
        lblSave: ["Save Profile", "Enregistrer le profil"],
        saveMessage: ["Your settings have been saved.", "Vos paramètres ont été sauvegardés"],
        okButtonText: ["Continue", "Continuez"],
        lblEnableEmail: ["Allow email to intern.mil.ca","Autoriser le courrier électronique à intern.mil.ca"],
        lblEnableHyperlinks: ["Allow web links to mil.ca","Autoriser les liens Web vers mil.ca"],
        lblEnableWarnings: ["Show mil.ca link warnings","Afficher les avertissements relatifs au lien mil.ca"],
        enableMilEmail: applicationSettings.getBoolean("EnableMilEmails", false),
        enableMilHyperlinks: applicationSettings.getBoolean("EnableMilHyperlinks", false),
        enableMilWarnings: applicationSettings.getBoolean("EnableMilWarnings", true),
        workEmail: ""
    });

    const page = args.object;
    //vm = new Observable();
    pageObject = page;
    page.bindingContext = pageData;

    checkLanguage();

    page.getViewById("toggleAllowEmail").on( "checkedChange" , (args) => {
        console.log(args.object.checked);
        applicationSettings.setBoolean( "EnableMilEmails" , args.object.checked );
    });

    page.getViewById("toggleAllowWeb").on( "checkedChange" , (args) => {
        console.log(args.object.checked);
        applicationSettings.setBoolean( "EnableMilHyperlinks" , args.object.checked );
    });

    page.getViewById("toggleWarnings").on( "checkedChange" , (args) => {
        console.log(args.object.checked);
        applicationSettings.setBoolean( "EnableMilWarnings" , args.object.checked );
    });
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page"); 
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}

exports.viewTerms = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("TOS-page");
}
exports.setToEng = function(args){
    var freButton = pageObject.getViewById("FrenchButton");
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";
    
    freButton.style.backgroundColor = "#DDD";
    freButton.style.color = "#222";
    applicationSettings.setString("PreferredLanguage", "English");

    pageData.set( "selectedLanguage" , 0 );
}

exports.setToFre = function(args){
    var engButton = pageObject.getViewById("EnglishButton");
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";

    engButton.style.backgroundColor = "#DDD";
    engButton.style.color = "#222";
    applicationSettings.setString("PreferredLanguage", "French");

    pageData.set( "selectedLanguage" , 1 );
    //exports.saveProfile();
    //var topmost = frameModule.topmost();
    //topmost.navigate("FR_profile-page");
}

exports.saveProfile = function(){
    console.log(pageData.get("workEmail"));
    if(pageData.get("workEmail") != ""){  
        console.log("Saving Email");  
        applicationSettings.setString("WorkEmail", pageData.get("workEmail"));
    }else{
        if(applicationSettings.hasKey("WorkEmail") == true){
        applicationSettings.remove("WorkEmail");
        }
    }
    var lang = pageData.get( "selectedLanguage" );
        dialogs.alert({
            title: pageData.get("lblFormTitle")[lang],
            message: pageData.get("saveMessage")[lang],
            okButtonText: pageData.get("okButtonText")[lang]
        }).then(function () {
            console.log("Dialog closed!");
        });
        //alert("Your settings have been saved.");
    //}
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
        console.log(applicationSettings.hasKey("WorkEmail"));
        pageData.set("workEmail", applicationSettings.getString("WorkEmail"));
    }
};
