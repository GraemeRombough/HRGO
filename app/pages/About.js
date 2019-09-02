var observable          = require("data/observable");
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");
var platformModule      = require("tns-core-modules/platform");
var app                 = require("application");
var utils               = require("utils/utils");

var pageData = new observable.Observable();
var page;
var termsPage;

exports.pageLoaded = function(args) {
    page = args.object;
    args.object.bindingContext = pageData;
    pageObject = page;

    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        pageData.set("HeaderTitle", "À propos GO RH");
        pageData.set("appName", "GO RH");
        pageData.set("lblTAC", "Termes et conditions");
        termsPage   = "https://www.canada.ca/fr/transparence/avis.html";
    } else {
        pageData.set("HeaderTitle", "About HR GO");
        pageData.set("appName", "HR GO");
        pageData.set("lblTAC", "Terms and Conditions");
        termsPage   = "https://www.canada.ca/en/transparency/terms.html";
    }
    
    var versionNumber;
    if ( platformModule.isAndroid ) {
        var packageManager = app.android.context.getPackageManager();
        versionNumber   = packageManager.getPackageInfo(app.android.context.getPackageName(), 0).versionName;
    } else {
        versionNumber   = NSBundle.mainBundle.infoDictionary.objectForKey("CFBundleShortVersionString");
    }

    pageData.set("versionString", "Version " + versionNumber);
};

exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
};

exports.openTAC = function(args) {
    utils.openUrl( termsPage );
}
