var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var pageObject;
const Label = require("tns-core-modules/ui/label/").Label;
const fromObject = require("tns-core-modules/data/observable").fromObject;
const email = require("nativescript-email");
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
    topmost.navigate("FR_POC-page");
}
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page");
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.clearKeyboard = function(args){
    var textInput = pageObject.getViewById("feedBackText");
    textInput.dismissSoftInput();
}
exports.sendEmail = function(args){
    const TODAY = new Date();
    email.available().then(function(avail){
        console.log("Email available? " + avail);
    });
    var eSubject = "Commentaires de GORH";
    var eBody = `Page: ${feedbackPage.PageName}, Date: ${TODAY} -- `;
    eBody += pageData.get("feedbackBody");
    var toAddress = [];
    toAddress.push("HRGO-GORH@forces.gc.ca");
    if(eSubject){
        if (email.available() == true){
            email.compose({
                subject: eSubject,
                body: eBody,
                to: toAddress
            });
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
    } else {
        console.log("Subject field blank");
    }
    //console.log(toAddress);
};

