var frameModule = require("ui/frame");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "";
var page;
exports.pageLoaded = function(args) {
    page = args.object;
    args.object.bindingContext = pageData;
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_landing-page");
}
exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_" + args.object.pageName);
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
    topmost.navigate("FR_calculators-landing-page");
};
exports.goToConnect = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_connect-landing-page");
};
exports.goToWalkthroughs = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_walkthroughs-landing-page");
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
    topmost.navigate("FR_landing-page");
    
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
exports.searchLanding = function(){
    var searchField = page.getViewById("SearchBox").text;
    
    var navigationOptions={
        moduleName:'FR_search-page',
        context:{SearchTerm: searchField
                }
            }

    var topmost = frameModule.topmost();
    topmost.navigate(navigationOptions);
}
