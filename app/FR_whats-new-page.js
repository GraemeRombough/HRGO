var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "YourPayInformation";
var buttonModule = require("tns-core-modules/ui/button");
const Button = require("tns-core-modules/ui/button/").Button;


exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
    //getNavList();
    const page = args.object;
    pageObject = page;
    page.bindingContext = pageData;
    console.log(new Date());
    displayNotifications();

};
exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate(args.object.pageName);
};
exports.goToWorkingDay = function(args){
    var topmost = frameModule.topmost();
    console.log(args.object.pageName);
    topmost.navigate("workdays-utility-page");
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
exports.goToArticle = function(args){
    var navigationOptions={
        moduleName:'dynamic-article-page',
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
    topmost.navigate("walkthrough-page");
};
exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate(args.object.pageName);
};
var goToNotification = function(args){
    var navigationOptions={
        moduleName:'FR_dynamic-notification-page',
        context:{Language: "ENG",
                ArticleID: args.object.id,
                ArticleTitle: args.object.text
                }
            }
    console.log(args.object.id);
    var topmost = frameModule.topmost();
    topmost.navigate(navigationOptions);
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
var displayNotifications = function(){
    var notificationList = getNotificationList();
    var TODAY = new Date();
    var notificationStack = pageObject.getViewById("NewsList");
    notificationStack.removeChildren();
    for(i=0; i < notificationList.length; i++){
        var checkDate = new Date(notificationList[i].publishDate);
        if(checkDate < TODAY){
            //console.log(notificationList[i].title);
            //<Button class="Main_Nav_SubLine" text="Phoenix Compensation Agreement" id="1" tap="goToNotification"/>
            var newsButton = new Button();
            newsButton.className = "Main_Nav_SubLine";
            newsButton.text = notificationList[i].title;
            newsButton.id = notificationList[i].ref;
            newsButton.on(buttonModule.Button.tapEvent, goToNotification, this);
            notificationStack.addChild(newsButton);
            console.log(newsButton.id);
            
        }
    }
}
var getNotificationList = function(){
    var navItem = {};
    var navList = [];
    navItem = {title:"Entente d’indemnisation liée à Phénix - Le 26 août, 2019", ref:"4", publishDate:"August 26, 2019 05:00:00"};
    navList.push(navItem);
    navItem = {title:"Entente d’indemnisation liée à Phénix - Le 23 juillet, 2019", ref:"3", publishDate:"July 23, 2019 07:00:00"};
    navList.push(navItem);
    navItem = {title:"Déclaration du ministère de la Défense nationale et des Forces armées canadiennes", ref:"2", publishDate:"July 18, 2019 05:00:00"};
    navList.push(navItem);
    navItem = {title:"CFAC-MDN Recours Collectif Inconduite Sexuelle", ref:"1", publishDate:"July 18, 2019 05:00:00"};
    navList.push(navItem);
    title:
    //console.log(navList[0].title);
    return navList;
}
