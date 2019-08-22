var frameModule = require("ui/frame");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "";
var applicationSettings = require("application-settings");
var firebase = require("nativescript-plugin-firebase/app");
var page;
var pageObject;
exports.pageLoaded = function(args) {
    
    page = args.object;
    args.object.bindingContext = pageData;
    pageObject = page;

    checkFirebaseData();

    if(applicationSettings.hasKey("PreferredLanguage")){
        if(applicationSettings.getString("PreferredLanguage") == "French") {
            var topmost = frameModule.topmost();
            topmost.navigate("FR_main-page");
        }
    }else{
        var langSection = pageObject.getViewById("languageSelection");
        langSection.visibility = "visible";
    }
};

var checkFirebaseData = function() {
    var TODAY                   = new Date();
    var lastSyncCheckDate    = new Date('January 1, 2018 01:00:00');
    if( applicationSettings.hasKey("LastFirebaseSyncCheck") ) {
        lastSyncCheckDate    = new Date( applicationSettings.getNumber("LastFirebaseSyncCheck"));
    }

    if( ((TODAY - lastSyncCheckDate) / (1000 * 60 * 60 * 24)) > 1 ) {

        var lastSyncDate    = new Date('January 1, 2018 01:00:00');
        if( applicationSettings.hasKey("LastFirebaseSync") ) {
            lastSyncDate    = new Date( applicationSettings.getNumber("LastFirebaseSync"));
        }

        console.log( "Last Sync Date = " + (lastSyncDate));

        const notificationCollection = firebase.firestore().collection("TableUpdates");

        const query = notificationCollection.where( "Updated", ">", lastSyncDate ).orderBy("Updated");

        query.get({ source: "server" }).then( querySnapshot => {
            querySnapshot.forEach( colDoc => {
                firebase.firestore().collection(colDoc.data().TableName).get({ source: "server" }).then( refreshSnapshot => {
                    if( colDoc.data().Updated.getTime() > applicationSettings.getNumber("LastFirebaseSync") ) {
                        applicationSettings.setNumber("LastFirebaseSync", colDoc.data().Updated.getTime());
                    }
                },
                (errorMessage) => {

                });
            });
        },
        (errorMesage) => {
            console.log("Error getting query results: " + errorMessage)
        });

        applicationSettings.setNumber("LastFirebaseSyncCheck", TODAY.getTime());
    }
};

exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate(args.object.pageName);
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log("nav toggle");
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
exports.goToRefCalc = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("calculators-landing-page");
};
exports.goToConnect = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("connect-landing-page");
};
exports.goToWalkthroughs = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("walkthroughs-landing-page");
}
exports.switchToFrench = function(){
    var topmost = frameModule.topmost();
    var pageDetails = String(topmost.currentPage).split("///");
    var frenchPageTitle = pageDetails[1].split("/")[1].split(".")[0] + "_FR";
    console.log(frenchPageTitle);
    topmost.navigate(frenchPageTitle);
};
exports.goToTest = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
    
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
exports.setToEng = function(args){
    var freButton = pageObject.getViewById("FrenchButton");
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";
    
    freButton.style.backgroundColor = "#DDD";
    freButton.style.color = "#222";
    applicationSettings.setString("PreferredLanguage", "English");
    var langSection = pageObject.getViewById("languageSelection");
        langSection.visibility = "collapsed";
}
exports.setToFre = function(args){
    var engButton = pageObject.getViewById("EnglishButton");
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";
    engButton.style.backgroundColor = "#DDD";
    engButton.style.color = "#222";
    applicationSettings.setString("PreferredLanguage", "French");
    var langSection = pageObject.getViewById("languageSelection");
    langSection.visibility = "collapsed";
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page");
}

exports.setLanguage = function(args) {
    console.log( "args = " + args.object.data );
    
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";

    applicationSettings.setString("PreferredLanguage", args.object.data);

    var topmost = frameModule.topmost();
    if( args.object.data == "French" ) {
        topmost.navigate("FR_main-page");
    } else {
        topmost.navigate("main-page");
    }
}

exports.searchLanding = function(){
    var searchField = page.getViewById("SearchBox").text;
    
    var navigationOptions={
        moduleName:'search-page',
        context:{SearchTerm: searchField
                }
            }

    var topmost = frameModule.topmost();
    topmost.navigate(navigationOptions);
}
