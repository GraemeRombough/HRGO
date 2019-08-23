var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "YourPayInformation";
var navList = [];

exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
    getNavList();
    args.object.bindingContext = pageData;

};
exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_" + args.object.pageName);
};
exports.goToWorkingDay = function(args){
    var topmost = frameModule.topmost();
    console.log(args.object.pageName);
    topmost.navigate("FR_workdays-utility-page");
};
exports.goToSalary = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("pay-info");
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
    topmost.navigate("POC-page");
}
exports.goToArticle = function(args){
    var navigationOptions={
        moduleName:'FR_dynamic-article-page',
        context:{Language: "ENG",
                ArticleID: args.object.id,
                ArticleTitle: args.object.text
                }
            }
    console.log(args.object.id);
    var topmost = frameModule.topmost();
    topmost.navigate(navigationOptions);
};
exports.goToWalkthrough = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_walkthrough-page");
};

exports.switchToFrench = function(){
    var topmost = frameModule.topmost();
    var pageDetails = String(topmost.currentPage).split("///");
    var frenchPageTitle = pageDetails[1].split("/")[1].split(".")[0];
    console.log(frenchPageTitle);
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log("nav toggle");
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
var getNavList = function(){
    var navItem = {};
    navItem = {title:"Emergency Salary Advance", ref:"1"};
    navList.push(navItem);
    navItem = {title:"Overtime", ref:"0"};
    navList.push(navItem);
    console.log(navList[0].title);
}
