var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
var buttonModule = require("ui/button");
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
const HtmlView = require("tns-core-modules/ui/html-view").HtmlView;
const webViewModule = require("tns-core-modules/ui/web-view");
const pageData = new observable.Observable();
var articleReference;
var pageObject;

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    articleReference=page.navigationContext;
    pageObject = page;
    page.bindingContext = pageData;
    pageData.set("videoHTML", "<p>loading</p>");
    createArticle();
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
exports.goToHome = function(eventData){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
}
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
var getArticleText = function(aID, aLang)
{
    //.findIndex(value)
    var articles = getFromDatabase();
    var articleText;
    var articleTitle;
    var articleBusinessLine;
    for (i = 0; i < articles.length; i++){
        if(articles[i].Ref == aID){
            articleText = articles[i].Content;
            articleTitle = articles[i].Title;
            break;
        }
    }
    var articleReturn = {Title:articleTitle, Text:articleText};
    return articleReturn;
    //return articleText;
}
var createArticle = function()
{   
    var curArticleText = getArticleText(articleReference.ArticleID);
    console.log(curArticleText);
    pageData.set("videoTitle", curArticleText.Title);
    pageData.set("videoHTML", curArticleText.Text);

}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"9", Title:"Faire le suivi dune demande relative à la paye", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/KC1nQNYo9qM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"8", Title:"Soumettre une demande de création ou de vérification d'un cidp", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/BazZqr7aqik" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"7", Title:"Soumettre d'autres demandes liées aux ressources humaines", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/c6ViMQhIiKw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"6", Title:"Soumettre une demande aux responsables de la comptabilisation du temps", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/zgaYsi-bEBk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"5", Title:"Acheminer une demande relative à la paye", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/ZmwCh0ss_LM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"4", Title:"Envoyer un formulaire de rétroaction phénix", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/qAwl_yebOtU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", Title:"Effectuer une soumission en bloc de demandes d'intervention de paye", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/ETnAaIqsq8E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"2", Title:"Soumettre une demande d'intervention de payé ssrh", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/I-vajhmxhOo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"1", Title:"Processus d'ouverture de session d'inscription", Content:`<iframe width="100%" height="auto" src="https://www.youtube.com/embed/5HwXXdMDWbw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`};
    contentData.push(returnedItem);
  

    return contentData;
}
