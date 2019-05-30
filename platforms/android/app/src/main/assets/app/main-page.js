var frameModule = require("ui/frame");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "";
var applicationSettings = require("application-settings");
var page;
exports.pageLoaded = function(args) {
    if(applicationSettings.hasKey("PreferredLanguage")){
        if(applicationSettings.getString("PreferredLanguage") == "French"){
            var topmost = frameModule.topmost();
            topmost.navigate("FR_main-page");
        }
    }
    page = args.object;
    args.object.bindingContext = pageData;
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
