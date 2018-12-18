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
exports.goToTest = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("my-team");
    
}
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("workdays-utility-page");
    
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
