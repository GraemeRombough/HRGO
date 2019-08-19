var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "YourPayInformation";
var buttonModule = require("tns-core-modules/ui/button");
const Button = require("tns-core-modules/ui/button/").Button;

var firebase = require("nativescript-plugin-firebase/app");


exports.pageLoaded = function(args) {
    //pageData.set(subNavTitle, true);
    //getNavList();
    const page = args.object;
    pageObject = page;
    page.bindingContext = pageData;
    console.log(new Date());
    //displayNotifications();
    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        pageData.set("HeaderTitle", "Nouvelles" );
    } else {
        pageData.set("HeaderTitle", "Announcements" );
    }

    buildListFromFirestore();
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
        moduleName:'dynamic-notification-page',
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
/*
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
            
        }
    }
}

var getNotificationList = function(){
    var navItem = {};
    var navList = [];
    navItem = {title:"Phoenix Compensation Agreement", ref:"1", publishDate:"July 23, 2019 07:00:00"};
    navList.push(navItem);
    navItem = {title:"Statement from the Department of National Defence and the Canadian Armed Forces", ref:"2", publishDate:"July 18, 2019 05:00:00"};
    navList.push(navItem);
    navItem = {title:"CAF-DND Sexual Misconduct Class Action", ref:"3", publishDate:"July 18, 2019 05:00:00"};
    navList.push(navItem);
    return navList;
};
*/

// Build the list of available articles from the Firestore database.  Only retreve the ones where the PublishDate value is before now.
//  Retrieve the articles from the network by default, or fall back onto cached data if necessary
var buildListFromFirestore = function() {
    console.log("***** buildListFromFirestore   - enter");
    var notificationStack = pageObject.getViewById("NewsList");
    notificationStack.removeChildren();

    const notificationCollection = firebase.firestore().collection("Notifications");

    const query = notificationCollection.where( "PublishDate", "<=", new Date() ).orderBy("PublishDate", "desc"); // firebase.firestore().FieldValue().serverTimestamp() );
    notificationCollection.onSnapshot( docSnapshot => {
        console.log("Document notification: " + JSON.stringify(docSnapshot));
    }, error => {
        console.log("listener error: ${error}");
    });
    console.log("      buildListFromFirestore   - fetch records");

    query.get({ source: "cache" }).then( querySnapshot => {
        querySnapshot.forEach( colDoc => {
            console.log( "      buildListFromFirestore   - from cache = " + ((colDoc.metadata.fromCache)?("true"):("false")));
            var newsButton = new Button();
            newsButton.className = "Main_Nav_SubLine";
            newsButton.text = colDoc.data().TitleEN;
            newsButton.id = colDoc.data().Ref;
            newsButton.on(buttonModule.Button.tapEvent, goToNotification, this);
            notificationStack.addChild(newsButton);
        });
       //buildListFromCache();
    },
    (errorMesage) => {
        console.log("Error getting query results: " + errorMessage)
    });
};
