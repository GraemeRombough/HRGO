var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var pageObject;
const Label = require("tns-core-modules/ui/label/").Label;
const fromObject = require("tns-core-modules/data/observable").fromObject;
const email = require("nativescript-email");
var feedbackPage;


exports.onNavigatingTo = function(args){
    const page = args.object;
    page.bindingContext = pageData;  
    feedbackPage=page.navigationContext;
    pageObject = page;
    console.log(feedbackPage.PageName);
    
    
};
exports.pageLoaded = function(args) {
    
};
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
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.sendEmail = function(args){
    const TODAY = new Date();
    email.available().then(function(avail){
        console.log("Email available? " + avail);
    });
    var eSubject = "HRGO Feedback Submission";
    var eBody = `Page: ${feedbackPage.PageName}, Date: ${TODAY} -- `;
    eBody += pageData.get("feedbackBody");
    var toAddress = [];
    toAddress.push("graeme.rombough@forces.gc.ca");
    if(eSubject){
        if (email.available()){
            email.compose({
                subject: eSubject,
                body: eBody,
                to: toAddress
            });
        } else {
            console.log("Email Not Available");
        }
    } else {
        console.log("Subject field blank");
    }
    //console.log(toAddress);
};

