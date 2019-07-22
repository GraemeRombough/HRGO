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
var articleReference;
var pageObject;

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
var createArticle = function()
{   
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
    articleSlide.removeChildren();
    for (z=0; z<articleComponents.length; z++){
        
        
        articleItemSplit = articleComponents[z].split("*>");
        var articleLabel = new Label();
        //LabelArray.push(new Label());
        var textString = "";
        if(articleItemSplit[0] == "Article_List"){
            textString = "\u2022 ";
        }
        if(articleItemSplit[1]){
            textString += articleItemSplit[1]
        }
        if(textString.includes("::external::")){
            var newFormattedText = new FormattedString();
//label.formattedText = formattedStringLabel;
            var textWithExternal = textString.split("::external::");
            console.log("TextWithExternal: " + textWithExternal.length);
            var inlineStyles = `style="height:auto; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 25px; margin-right: 25px; margin-top: 28px; margin-bottom:14px; padding-bottom:0px; white-space: normal; color: #333;"`;
            
            var htmlString = `<div ${inlineStyles}>`;
            for(i=0; i < textWithExternal.length; i++){
                if(textWithExternal[i].includes("||")){
                    var linkText = textWithExternal[i].split("||");
                    var labelSpan = new Span();
                   // console.log(linkText[1]);
                    labelSpan.text = linkText[0];
                    //labelSpan.text = `<a href="google.com> link here </a>`;
                    htmlString += `<a href="${linkText[1]}">${linkText[0]}</a>`;
                    //labelSpan.text = "<a href='http://google.com'>Hello World</a>";
                    labelSpan.url = linkText[1];
                    labelSpan.style.color = "rgb(0,31,91)";
                    newFormattedText.spans.push(labelSpan);
                }else{
                    var labelSpan = new Span();
                    labelSpan.text = textWithExternal[i];
                    newFormattedText.spans.push(labelSpan);
                    htmlString += `${textWithExternal[i]}`;
                }
            }
            articleLabel.className = articleItemSplit[0];
            articleLabel.formattedText = newFormattedText;
            //newFormattedText.className = articleItemSplit[0];
            var htmlParagraph = new HtmlView();
            //htmlParagraph.className = "Article_Body";
            htmlString += "</div>";

            htmlParagraph.html = htmlString;
            //articleSlide.addChild(articleLabel);
            //articleSlide.addChild(newFormattedText);
            articleSlide.addChild(htmlParagraph);
            
            //console.log(htmlString);
        }else{
            articleLabel.className = articleItemSplit[0];
            articleLabel.text = textString;
            articleSlide.addChild(articleLabel);
        }
        
    }
    pageData.set("HeaderTitle", curArticleText.Title);

}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Phoenix", Title:"Phoenix Compensation Agreement", Type:"Notification", PublishDate:"July 23, 2019 07:00:00", Content:"<*Article_H1*>Phoenix compensation agreement<*Article_Note*>July 23, 2019<*Article_Body*>The Phoenix pay system has caused a lot of stress and frustration for DND employees and their families.<*Article_Body*>To compensate current and former employees impacted by Phoenix, the Government and 15 public service unions have finalized a ::external::joint agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/damages-caused-phoenix-pay-system.html::external:: that was first announced last month.<*Article_Body*>This agreement, co-developed by unions and the federal government, applies to employees, former employees and the estates of deceased employees represented by the following DND bargaining agents:<*Article_List*>Association of Canadian Financial Officers<*Article_List*>Canadian Association of Professional Employees<*Article_List*>Canadian Merchants Service Guild<*Article_List*>Canadian Military Colleges Faculty Association<*Article_List*>Federal Government Dockyard Trades and Labour Council (East)<*Article_List*>Federal Government Dockyard Trades and Labour Council (West)<*Article_List*>Federal Government Dockyard Chargehands Association<*Article_List*>International Brotherhood of Electrical Workers<*Article_List*>Professional Institute of the Public Service of Canada<*Article_Body*>The agreement will also extend to excluded employees from the bargaining agents above as well as unrepresented employees and executives. Separate agencies are expected to reach similar agreements shortly with their unions. While the Public Service Alliance of Canada (PSAC) has rejected this offer, the government remains open to extending this agreement to PSAC at any time.<*Article_H2*>Eligibility<*Article_Body*>If you’re a current employee, you’ll receive the associated entitlement as long as you were on strength for at least one working day in the corresponding FY.<*Article_Body*>For fiscal years 2016/2017 to 2018/2019, you can expect to have the additional vacation hours in your leave bank by 12 November 2019. For FY 2019/2020, you can expect to have them in your leave bank by 29 August 2020. You do not have to initiate a claim; it will be automatically credited to you.<*Article_Body*>If you’re a casual, student, or term employee of less than 3 months, you are not eligible for this entitlement leave.<*Article_Body*>This leave provides baseline compensation for eligible employees. It does not diminish their right to make claims for expenses, damages, and financial losses.<*Article_Body*>The first phase of implementation is to allocate additional annual leave to current employees. Specifically, employees who qualify will receive:<*Article_List*>2 days of leave for 2016–17<*Article_List*>1 day of leave for 2017–18<*Article_List*>1 day of leave for 2018–19<*Article_Body*>In addition, eligible employees will receive one day of leave for 2019–20, which will be allocated after the end of this fiscal year. The agreement is designed this way to ensure that new employees who join the public service between now and March 31, 2020, are also compensated.<*Article_Body*>Your entitlement will be automatically added to your leave banks and you will be notified when you it is ready to be credited. More information on when and how to submit a claim for the additional compensation outlined in this agreement will also be shared with you in the coming months.<*Article_Body*>You are encouraged to read the ::external::section of the agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: that spells out the eligibility requirements and the other types of compensation that will be implemented in the months to come. Full details on the agreement, including ::external::FAQs||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system/faq-phoenix-pay-system-damages-agreement.html::external::, are now available on the ::external::Canada.ca||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: website.<*Article_Body*>The government continues to take action on all fronts to stabilize the Phoenix pay system and to work with public service unions to develop the Next Generation HR & Pay System, the long-term replacement to Phoenix.<*Article_Body*>Contact your union representative for any questions related to the agreement, or HR Connect RH (1-833-RHR-MDND) on the implementation of the new leave entitlements"};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"2", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"Statement from the Department of National Defence and the Canadian Armed Forces", Type:"Notification", PublishDate:"July 18, 2019 05:00:00", Content:`<*Article_H1*>Statement from the Department of National Defence and the Canadian Armed Forces<*Article_Note*>July 18, 2019<*Article_Body*>Deputy Minister Jody Thomas and Chief of the Defence Staff General Jonathan Vance issued the following statement:<*Article_Body*>“Today, the Government of Canada announced that a settlement has been reached between the Canadian Armed Forces/Department of National Defence/Staff of the Non-Public Funds and the plaintiffs in class action lawsuits initiated by seven former members of the CAF."<*Article_Body*>“The proposed settlement sets out financial compensation, the option to participate in a restorative engagement program, and several other measures aimed at addressing sexual misconduct in the CAF."<*Article_Body*>“We are pleased that the government and the plaintiffs have been able to reach a comprehensive settlement which will advance the project of real and lasting cultural change.  We recognize our obligation to ensure a safe work environment for all women and men in the Canadian Armed Forces, employees of the Department of National Defence and Staff of the Non-Public Funds, Canadian Forces, who experienced sexual misconduct – including sexual harassment, sexual assault or discrimination based on sex, gender, gender identity or sexual orientation – in connection with their military service or civilian employment."<*Article_Body*>“To all those who have had the courage to come forward as part of these class actions – and to those who will come forward – we offer our sincere regret that you experienced sexual misconduct in our workplace."<*Article_Body*>“We recognize that it takes a lot of courage to come forward to share difficult and painful experiences, and press for change."<*Article_Body*>"We hope that the settlement will help bring closure, healing, and acknowledgement to the victims and survivors of sexual assault, harassment, and discrimination. The settlement includes several measures that are aimed at ensuring the CAF and DND will continue to take the necessary steps to achieve lasting, positive change."`};
    contentData.push(returnedItem);
       
    
    return contentData;
}
