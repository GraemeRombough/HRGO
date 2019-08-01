var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
var buttonModule = require("ui/button");
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
const FormattedString = require("tns-core-modules/text/formatted-string").FormattedString;
const Span = require("tns-core-modules/text/span").Span;
const pageData = new observable.Observable();
const HtmlView = require("tns-core-modules/ui/html-view").HtmlView;
const webViewModule = require("tns-core-modules/ui/web-view");
var articleReference;
var pageObject;
const email = require("nativescript-email");
var phone = require("nativescript-phone");

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    articleReference=page.navigationContext;
    pageObject = page;
    page.bindingContext = pageData;
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
        if(articleTitle == null && articles[i].Ref == aID){
            articleTitle = articles[i].Title;
        }
        if(articleBusinessLine == null && articles[i].Ref == aID){
            articleBusinessLine = articles[i].BusinessLine;
        }
        if(articles[i].Ref == aID){
            articleText = articles[i].Content;
            break;
        }
    }
    var articleReturn = {Title:articleTitle, Text:articleText, BusinessLine:articleBusinessLine};
    return articleReturn;
    //return articleText;
}
exports.onLoadStarted = function(args){
    checkURL = args.url.split(":");
    if(checkURL.length > 1){
        if(checkURL[0] == "mailto:"){
            console.log(checkURL[1]);
            args.object.stopLoading();
            emailLink(checkURL[1]);
            
        }else if(checkURL[0] == "tel:"){
            console.log(checkURL[1]);
            args.object.stopLoading();
            callLink(checkURL[1]);  
        }
        console.log(args.url);
    }
}
var callLink = function(phoneNumber){
    console.log("call number:" + phoneNumber);
    phone.dial(phoneNumber,true);

};
var emailLink = function(emailText){
    console.log("send email to:" + emailText);
    var toAddress = [];
    toAddress.push(emailText);
    if (email.available()){
        email.compose({
            subject: "",
            body: "",
            to: toAddress
        });
    } else {
        console.log("Email Not Available");
    }
};
var createArticle = function()
{   

    //STYLE HTML STRINGS
    var bodyStyle = `.Article_Body{ height:auto; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 25px; margin-right: 25px; margin-top: 28px; margin-bottom:14px; padding-bottom:0px; white-space: normal; color: #333;}`;
    var h1Style = `.Article_H1{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 14px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var h2Style = `.Article_H2{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 24px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 14px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var h3Style = `.Article_H3{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 20px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 25px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var noteStyle = `.Article_Note{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; font-style: italic; margin-left: 25px; margin-right: 25px; margin-top: 5px; margin-bottom:5px; white-space: normal; color: #333;}`;
    var listStyle = `.Article_List{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 50px; margin-right: 25px; margin-top: 18px; margin-bottom:5px; white-space: normal; color: #333;}`;
    var allStyles = bodyStyle + h1Style + h2Style + h3Style + noteStyle + listStyle;
    var headerHTML = `<html><head><style>${allStyles}</style></head><body>`;
    var footerHTML = "</body></html>"
    var totalHTML;
    totalHTML = headerHTML;
    var webView = new webViewModule.WebView();
    const contentStack = new StackLayout();
    const myScroller = new ScrollView();
    const articleStack = new StackLayout();
    // Set the orientation property
    articleStack.orientation = "vertical";
    articleStack.col = 1;
    articleStack.className = "Article_MainStack";

    contentStack.orientation = "vertical";
    contentStack.row = 0;
    
    var headerLabel = new Label();
    headerLabel.text = articleReference.ArticleTitle;
    headerLabel.className = "HeaderLabel";

    var LabelArray = [];
    console.log("Create Article: ");   
    var curArticleText = getArticleText(articleReference.ArticleID);
    var articleItemSplit;

    var articleComponents = curArticleText.Text.split("<*");
    var articleSlide = pageObject.getViewById("articleContent");
    //articleSlide.removeChildren();
    for (z=0; z<articleComponents.length; z++){
        var currentHTML;
        articleItemSplit = articleComponents[z].split("*>");
        var articleLabel = new Label();
        var textString = "";
        if(articleItemSplit[0] == "Article_List"){
            textString = "\u2022 ";
        }
        if(articleItemSplit[1]){
            textString += articleItemSplit[1]
        }
        if(textString.includes("::external::")){
            var textWithExternal = textString.split("::external::");
            console.log("TextWithExternal: " + textWithExternal.length);
            var htmlString = `<div class="${articleItemSplit[0]}">`;
            for(i=0; i < textWithExternal.length; i++){
                if(textWithExternal[i].includes("||")){
                    var linkText = textWithExternal[i].split("||");
                    htmlString += `<a href="${linkText[1]}">${linkText[0]}</a>`;      
                }else{
                    
                    htmlString += `${textWithExternal[i]}`;
                }
            }
            articleLabel.className = articleItemSplit[0];
            var htmlParagraph = new HtmlView();
            htmlString += "</div>";
            totalHTML += htmlString;
        }else{
            totalHTML += `<div class="${articleItemSplit[0]}">${textString}</div>`;   
        }    
    }
    totalHTML += footerHTML;
    console.log(totalHTML);
    pageData.set("ArticleHTML", totalHTML);
    pageData.set("HeaderTitle", curArticleText.Title);

}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Phoenix", Title:"Phoenix Compensation Agreement", Type:"Notification", PublishDate:"July 23, 2019 07:00:00", Content:"<*Article_H1*>Phoenix compensation agreement<*Article_Note*>July 23, 2019<*Article_Body*>The Phoenix pay system has caused a lot of stress and frustration for DND employees and their families.<*Article_Body*>To compensate current and former employees impacted by Phoenix, the Government and 15 public service unions have finalized a ::external::joint agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/damages-caused-phoenix-pay-system.html::external:: that was first announced last month.<*Article_Body*>This agreement, co-developed by unions and the federal government, applies to employees, former employees and the estates of deceased employees represented by the following DND bargaining agents:<*Article_List*>Association of Canadian Financial Officers<*Article_List*>Canadian Association of Professional Employees<*Article_List*>Canadian Merchants Service Guild<*Article_List*>Canadian Military Colleges Faculty Association<*Article_List*>Federal Government Dockyard Trades and Labour Council (East)<*Article_List*>Federal Government Dockyard Trades and Labour Council (West)<*Article_List*>Federal Government Dockyard Chargehands Association<*Article_List*>International Brotherhood of Electrical Workers<*Article_List*>Professional Institute of the Public Service of Canada<*Article_Body*>The agreement will also extend to excluded employees from the bargaining agents above as well as unrepresented employees and executives. Separate agencies are expected to reach similar agreements shortly with their unions. While the Public Service Alliance of Canada (PSAC) has rejected this offer, the government remains open to extending this agreement to PSAC at any time.<*Article_H2*>Eligibility<*Article_Body*>If you’re a current employee, you’ll receive the associated entitlement as long as you were on strength for at least one working day in the corresponding FY.<*Article_Body*>For fiscal years 2016/2017 to 2018/2019, you can expect to have the additional vacation hours in your leave bank by 12 November 2019. For FY 2019/2020, you can expect to have them in your leave bank by 29 August 2020. You do not have to initiate a claim; it will be automatically credited to you.<*Article_Body*>If you’re a casual, student, or term employee of less than 3 months, you are not eligible for this entitlement leave.<*Article_Body*>This leave provides baseline compensation for eligible employees. It does not diminish their right to make claims for expenses, damages, and financial losses.<*Article_Body*>The first phase of implementation is to allocate additional annual leave to current employees. Specifically, employees who qualify will receive:<*Article_List*>2 days of leave for 2016–17<*Article_List*>1 day of leave for 2017–18<*Article_List*>1 day of leave for 2018–19<*Article_Body*>In addition, eligible employees will receive one day of leave for 2019–20, which will be allocated after the end of this fiscal year. The agreement is designed this way to ensure that new employees who join the public service between now and March 31, 2020, are also compensated.<*Article_Body*>Your entitlement will be automatically added to your leave banks and you will be notified when you it is ready to be credited. More information on when and how to submit a claim for the additional compensation outlined in this agreement will also be shared with you in the coming months.<*Article_Body*>You are encouraged to read the ::external::section of the agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: that spells out the eligibility requirements and the other types of compensation that will be implemented in the months to come. Full details on the agreement, including ::external::FAQs||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system/faq-phoenix-pay-system-damages-agreement.html::external::, are now available on the ::external::Canada.ca||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: website.<*Article_Body*>The government continues to take action on all fronts to stabilize the Phoenix pay system and to work with public service unions to develop the Next Generation HR & Pay System, the long-term replacement to Phoenix.<*Article_Body*>Contact your union representative for any questions related to the agreement, or HR Connect RH (1-833-RHR-MDND) on the implementation of the new leave entitlements"};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"2", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"Message from the DM, CDS regarding the CAF/DND Sexual Misconduct Class Actions", Type:"Notification", PublishDate:"July 19, 2019 05:00:00", Content:`<*Article_H1*>Message from the DM, CDS regarding the CAF/DND Sexual Misconduct Class Actions<*Article_Note*>July 19, 2019<*Article_Body*>The Government of Canada has agreed to a settlement relating to several class action lawsuits regarding sexual misconduct that were brought on behalf of current and former Canadian Armed Forces (CAF) members.<*Article_Body*>The proposed settlement would include current and former CAF members, Department of National Defence (DND) employees, and Staff of the Non-Public Funds (NPF), Canadian Forces employees, who experienced sexual misconduct – including sexual harassment, sexual assault or discrimination based on sex, gender, gender identity or sexual orientation – in connection with their military service or civilian employment. To learn more about the Class Actions and how the proposed settlement may impact you, please visit the CAF/DND Sexual Misconduct Class Actions website ::external::caf-dnd-sexualmisconductclassaction.com||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx::external:: or call ::external::1-888-626-2611||tel:1-888-626-2611::external::.<*Article_Body*>As your senior leaders, nothing is more important to us than creating a work environment where you feel safe, respected and included. Since Operation HONOUR began four years ago, we have begun the work of creating a lasting culture change – not only with a mandate, but with a movement. We are listening to and learning from those who have experienced various forms of sexual misconduct and are continuing to evolve our policies and programs. We are committed to putting effective prevention measures in place, and understanding why incidents of sexual misconduct occur. Responding to sexual misconduct appropriately with compassionate support is central to our efforts.<*Article_Body*>This culture change is not solely focused on the CAF, but across the Defence Team and our workplace. We are working towards a better future for everyone in the Defence Team, through victim centered support for CAF members through the Sexual Misconduct Response Centre, as well as through wellness and assistance programs for DND and NPF employees. If you have experienced sexual misconduct, we encourage you to reach out to the resources listed at the close of this message, and to report incidents so we can ensure you are provided with support.<*Article_Body*>The success of the Defence Team and the mission of the CAF depend on the unwavering trust and teamwork of our people: military and civilian alike, regardless of gender or background. To all those who have had the courage to come forward as part of these class actions – and to those who will come forward – we offer our sincere regret that you experienced sexual misconduct in our workplace. The settlement offers financial compensation, as well as unique policy measures to advance the culture change initiatives already underway, and opportunities for individuals to share their experiences through restorative engagement and consultation. Please know that by sharing your experiences, you are leading the way and pushing for real and lasting change.`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"CAF-DND Sexual Misconduct Class Action", Type:"Notification", PublishDate:"July 19, 2019 05:00:00", Content:`<*Article_H1*>CAF-DND Sexual Misconduct Class Action<*Article_Note*>July 19, 2019<*Article_H3*>Important Update<*Article_Note*>The hearing to approve the proposed settlement agreement is scheduled for September 19 and 20, 2019 at 10:00am at the Federal Court in Ottawa, 90 Sparks Street.<*Article_H2*>Intro​du​ction<*Article_Body*>Are you a current or former member of the Canadian Armed Forces, or a current or former employee of the Department of National Defence or Staff of the Non-Public Funds, Canadian Forces?<*Article_Body*>Have you experienced sexual harassment, sexual assault or discrimination based on your sex, gender, gender identity or sexual orientation in connection with your military service or DND or SNPF employment?<*Article_Body*>There is a proposed settlement between the Canadian Federal Government and certain current and former members the Canadian Armed Forces ("CAF"), and current and former employees of the Department of National Defence ("DND") and/or Staff of the Non-Public Funds, Canadian Forces ("SNPF") who experienced sexual harassment, sexual assault or discrimination based on sex, gender, gender identity or sexual orientation ("Sexual Misconduct") in connection with their military service and/or employment with the DND/SNPF.<*Article_Body*>More information about the proposed settlement is available in the court-approved notice. A copy of the notice is available ::external::here||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Court%20Documents::external::. A copy of the Final Settlement Agreement is available ::external::here||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Court%20Documents::external::.<*Article_Body*>If you support the proposed settlement or if you object to the proposed settlement, you can submit a Participation Form. The Participation Form can be found ::external::here||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Court%20Documents::external::. You must mail this Form to CAF DND Sexual Misconduct Class Action c/o Deloitte, Bay Adelaide Centre, East Tower, 8 Adelaide Street West, Toronto, ON M5H 0A9, or email it to cafdndmisconduct@deloitte.ca and it must be received or postmarked no later than August 30, 2019.<*Article_Body*>You do not need to submit a Participation Form to share in the benefits of the proposed settlement. If the proposed settlement is approved by the Federal Court, more information will be available explaining how to obtain benefits from the settlement.<*Article_H2*>Contact Us​<*Article_Body*>If you have further questions regarding the administration of the Settlement, please contact the Interim Administrator at:<*Article_Body*>CAF DND Sexual Misconduct Class Action <br>c/o Deloitte <br>Bay Adelaide Centre, East Tower <br>8 Adelaide Street West, Toronto ON  M5H 0A9 <br>Telephone: ::external::1-888-626-2611||tel:1-888-626-2611::external:: <br>Email: ::external::cafdndmisconduct@deloitte.ca||mailto:cafdndmisconduct@deloitte.ca::external::`};
    contentData.push(returnedItem);

    // 
       
    
    return contentData;
}
