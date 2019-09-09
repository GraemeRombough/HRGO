var uiFrame = require('ui/frame');
var applicationSettings = require("application-settings");

exports.goToHome = function() {
    uiFrame.topmost().navigate( "main-page" );
};

exports.loadAbout = function(args) {
    uiFrame.topmost().navigate( "./pages/About" );
}

exports.footer3 = function() {
    uiFrame.topmost().navigate( "profile-page" );
};

exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = uiFrame.topmost();
    //topmost.navigate("feedback-page");
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:(applicationSettings.getString("PreferredLanguage") == "French" ? "FR_" : "") + 'feedback-page',
        context:{Language: "ENG",
                PageName: pageDetails[1].split("/")[1].split(".")[0],
                DateTime: TODAY
                }
            }
    topmost.navigate(navigationOptions); 
};

exports.footer5 = function() {
    uiFrame.topmost().navigate( "POC-page" );
};