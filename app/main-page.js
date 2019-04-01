var frameModule = require("ui/frame");
var observable = require("data/observable");
var pageData = new observable.Observable();
var page;
exports.pageLoaded = function(args) {
    page = args.object;
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
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
    topmost.navigate("dynamic-walkthrough-page");
    
}
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("profile-page");
    
}
exports.footer4 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("POC-page");
    
}
exports.footer5 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("pay-info");
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
