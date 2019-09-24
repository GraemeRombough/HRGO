var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var pageObject;
const Label = require("tns-core-modules/ui/label/").Label;
const fromObject = require("tns-core-modules/data/observable").fromObject;
const email = require("nativescript-email");
var utils = require("utils/utils");
var clipboard = require("nativescript-clipboard");
var dialogs = require("ui/dialogs");
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
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.clearKeyboard = function(args){
    var textInput = pageObject.getViewById("feedBackText");
    textInput.dismissSoftInput();
}

function emailFeedback(emailText) {
    const TODAY = new Date();
    var eSubject = "Commentaires de GORH";
    var eBody = `Page: ${feedbackPage.PageName}, Date: ${TODAY} -- \n\n`;
    eBody += pageData.get("feedbackBody");
    var toAddress = [];
    toAddress.push("HRGO-GORH@forces.gc.ca");

    email.available().then((success) => {
        if(success) {
            email.compose({
                subject: eSubject,
                body: eBody,
                to: toAddress
            });

            pageData.set("feedbackBody", "");
        } else {
            console.log("try url email");
            var recipients = encodeURI("HRGO-GORH@forces.gc.ca");

            var subject = encodeURI(eSubject);
            var body = encodeURI(eBody);
            if( utils.openUrl("mailto:" + recipients + "?subject=" + subject + "&body=" + body)) {
                console.log("email success");
                pageData.set("feedbackBody", "");
            } else {
                console.log("Email Not Available");
                clipboard.setText(`Envoyez à: HRGO-GORH@forces.gc.ca \nSujet: Commentaires de GORH \nCommentaires: ${eBody}`).then(function() {
                    console.log("OK, copied to the clipboard");
                })
                dialogs.alert({
                    title: "Courriel n'est pas disponible",
                    message: "GO RH ne peux pas ouvrir votre client de courriel.  Votre message a mis dans le presse papier pour mettre dans votre client de courriel.  S'il vous plait, Envoyez à HRGO-GORH@forces.gc.ca (trouvez l'address dans le message copié)",
                    okButtonText: "OK"});
            }
        }
    });
};

exports.sendEmail   = emailFeedback;
