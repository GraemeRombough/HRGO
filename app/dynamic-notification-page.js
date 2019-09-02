var frameModule = require("ui/frame");
const observable = require("data/observable");
const pageData = new observable.Observable();
var articleReference;

var applicationSettings = require("application-settings");
const webViewEvents = require( "./utilities/WebViewExtender");
const htmlBuilder = require( "./utilities/HTMLBuilder");
//var firebase = require("nativescript-plugin-firebase/app");

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    articleReference=page.navigationContext;
    pageObject = page;
    page.bindingContext = pageData;

    console.log("article id = " + articleReference.ArticleID );
    
    // With Firebase, the data retrieval will be asynchronous, so that will need to be accounted for.
    //loadArticleFromFirestore( articleReference.ArticleID );


    var articleData = getArticleText( articleReference.ArticleID );
    pageData.set("ArticleHTML", htmlBuilder.buildHTML( articleData.Text ));
    pageData.set("HeaderTitle", articleData.Title);
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


// This should prevent the page from loading new http and https links, then send the link to be opened by the default app
// Unlike the documentation I found, the second parameter for shouldOverrideUrlLoading is not giving a string object.  It is giving a WebResourceRequest object.
exports.onWebViewLoaded = webViewEvents.onWebViewLoaded;

exports.onLoadStarted = webViewEvents.onLoadStarted;



// Load the specified article contents from Firestore, defaulting to the cache.  We should already have the articles cached from the article list generation.
//  When the text is loaded, it will be sent to createArticle in order to populate the page.
/*
var loadArticleFromFirestore = function (articleID) {
    const notificationCollection = firebase.firestore().collection("Notifications");

    const query = notificationCollection.where( "Ref", "==", articleID );

    query.get({ source: "cache" }).then( querySnapshot => {
        querySnapshot.forEach( colDoc => {
            console.log( "      buildListFromFirestore   - from cache = " + ((colDoc.metadata.fromCache)?("true"):("false")));
            console.log( colDoc.data().ContentEN );

            //pageData.set("HeaderTitle", colDoc.data().TitleEN);
            //pageData.set("ArticleHTML", htmlBuilder.buildHTML( colDoc.data().ContentEN ));
            if( applicationSettings.getString("PreferredLanguage", "English") == "French" ) {
                pageData.set("HeaderTitle", colDoc.data().TitleFR);
                pageData.set("ArticleHTML", htmlBuilder.buildHTML( colDoc.data().ContentFR ));
            } else {
                pageData.set("HeaderTitle", colDoc.data().TitleEN);
                pageData.set("ArticleHTML", htmlBuilder.buildHTML( colDoc.data().ContentEN ));
            }
        });
    },
    (errorMesage) => {
        console.log("Error getting query results: " + errorMessage)
    });
};
*/
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"4", BusinessLine:"Pay", Category:"Phoenix", Title:"Phoenix Compensation Agreement - August 26, 2019", Type:"Notification", PublishDate:"August 26, 2019 05:00:00", Content:`<*Article_H1*>Phoenix Compensation Agreement<*Article_Note*>August 26, 2019<*Article_Body*>As a result of the ::external::agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: on damages caused by Phoenix, additional annual leave has been added to leave balances of eligible employees.<*Article_Body*>This leave has been allocated over fiscal years 2016–17 to 2018–19, for a maximum of four days, to eligible employees in recognition of the direct or indirect impact experienced as a result of the implementation of the Phoenix pay system. Eligible employees will also receive one day of leave for 2019–20, which will be allocated after the end of this fiscal year.<*Article_Body*>This leave adjustment is subject to the terms and conditions of your collective agreement and therefore can be used as annual leave. Please consult the ::external::information online||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: for:<*Article_List*>details on the terms of the agreement<*Article_List*>eligibility to receive this compensation<*Article_List*>FAQs<*Article_List*>other types of compensation that will be implemented in the months to come<*Article_Body*>DND employees can review their Phoenix damages entitlement in HRMS by clicking the “Leave Self Service” tab, followed by “Employee Leave Summary”. The leave will be listed under code “100” and further information on the entitlement will be provided under the “adjustment reason” column of the leave transactions table.<*Article_Body*>The agreement on damages also includes additional compensation for eligible employees. This compensation, evaluated on a case-by-case basis, will be provided in the months to come for those who experienced severe personal or financial hardship due to Phoenix pay issues, missed opportunities to earn interest on savings accounts or other financial and capital investments and experienced delays in receiving severance or pension payments.<*Article_Body*>This agreement also applies to unrepresented employees, executives and to employees excluded from bargaining units whose bargaining agents have signed on to the agreement.<*Article_Body*>If you have any questions, or if you believe that you have not received the full amount of leave for which you are eligible, please contact ::external::HR Connect RH||https://collaboration-hr-civ.forces.mil.ca/sites/HRC-CORE/HRCON/Connect%20Library/Forms/template.xsn::external::  (::external::1-833-RHR-MDND||tel:1-833-RHR-MDND::external::).<*Article_Body*>We will review and revise your leave, as needed, as quickly as possible.`};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"3", BusinessLine:"Pay", Category:"Phoenix", Title:"Phoenix Compensation Agreement - July 23, 2019", Type:"Notification", PublishDate:"July 23, 2019 07:00:00", Content:"<*Article_H1*>Phoenix compensation agreement<*Article_Note*>July 23, 2019<*Article_Body*>The Phoenix pay system has caused a lot of stress and frustration for DND employees and their families.<*Article_Body*>To compensate current and former employees impacted by Phoenix, the Government and 15 public service unions have finalized a ::external::joint agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/damages-caused-phoenix-pay-system.html::external:: that was first announced last month.<*Article_Body*>This agreement, co-developed by unions and the federal government, applies to employees, former employees and the estates of deceased employees represented by the following DND bargaining agents:<*Article_List*>Association of Canadian Financial Officers<*Article_List*>Canadian Association of Professional Employees<*Article_List*>Canadian Merchants Service Guild<*Article_List*>Canadian Military Colleges Faculty Association<*Article_List*>Federal Government Dockyard Trades and Labour Council (East)<*Article_List*>Federal Government Dockyard Trades and Labour Council (West)<*Article_List*>Federal Government Dockyard Chargehands Association<*Article_List*>International Brotherhood of Electrical Workers<*Article_List*>Professional Institute of the Public Service of Canada<*Article_Body*>The agreement will also extend to excluded employees from the bargaining agents above as well as unrepresented employees and executives. Separate agencies are expected to reach similar agreements shortly with their unions. While the Public Service Alliance of Canada (PSAC) has rejected this offer, the government remains open to extending this agreement to PSAC at any time.<*Article_H2*>Eligibility<*Article_Body*>If you’re a current employee, you’ll receive the associated entitlement as long as you were on strength for at least one working day in the corresponding FY.<*Article_Body*>For fiscal years 2016/2017 to 2018/2019, you can expect to have the additional vacation hours in your leave bank by 12 November 2019. For FY 2019/2020, you can expect to have them in your leave bank by 29 August 2020. You do not have to initiate a claim; it will be automatically credited to you.<*Article_Body*>If you’re a casual, student, or term employee of less than 3 months, you are not eligible for this entitlement leave.<*Article_Body*>This leave provides baseline compensation for eligible employees. It does not diminish their right to make claims for expenses, damages, and financial losses.<*Article_Body*>The first phase of implementation is to allocate additional annual leave to current employees. Specifically, employees who qualify will receive:<*Article_List*>2 days of leave for 2016–17<*Article_List*>1 day of leave for 2017–18<*Article_List*>1 day of leave for 2018–19<*Article_Body*>In addition, eligible employees will receive one day of leave for 2019–20, which will be allocated after the end of this fiscal year. The agreement is designed this way to ensure that new employees who join the public service between now and March 31, 2020, are also compensated.<*Article_Body*>Your entitlement will be automatically added to your leave banks and you will be notified when you it is ready to be credited. More information on when and how to submit a claim for the additional compensation outlined in this agreement will also be shared with you in the coming months.<*Article_Body*>You are encouraged to read the ::external::section of the agreement||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: that spells out the eligibility requirements and the other types of compensation that will be implemented in the months to come. Full details on the agreement, including ::external::FAQs||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system/faq-phoenix-pay-system-damages-agreement.html::external::, are now available on the ::external::Canada.ca||https://www.canada.ca/en/treasury-board-secretariat/topics/pay/phoenix-pay-system/compensation-federal-employees-impacted-phoenix-pay-system.html::external:: website.<*Article_Body*>The government continues to take action on all fronts to stabilize the Phoenix pay system and to work with public service unions to develop the Next Generation HR & Pay System, the long-term replacement to Phoenix.<*Article_Body*>Contact your union representative for any questions related to the agreement, or HR Connect RH (1-833-RHR-MDND) on the implementation of the new leave entitlements"};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"2", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"Message from the DM, CDS regarding the CAF/DND Sexual Misconduct Class Actions", Type:"Notification", PublishDate:"July 19, 2019 05:00:00", Content:`<*Article_H1*>Message from the DM, CDS regarding the CAF/DND Sexual Misconduct Class Actions<*Article_Note*>July 19, 2019<*Article_Body*>The Government of Canada has agreed to a settlement relating to several class action lawsuits regarding sexual misconduct that were brought on behalf of current and former Canadian Armed Forces (CAF) members.<*Article_Body*>The proposed settlement would include current and former CAF members, Department of National Defence (DND) employees, and Staff of the Non-Public Funds (NPF), Canadian Forces employees, who experienced sexual misconduct – including sexual harassment, sexual assault or discrimination based on sex, gender, gender identity or sexual orientation – in connection with their military service or civilian employment. To learn more about the Class Actions and how the proposed settlement may impact you, please visit the CAF/DND Sexual Misconduct Class Actions website ::external::caf-dnd-sexualmisconductclassaction.com||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx::external:: or call ::external::1-888-626-2611||tel:1-888-626-2611::external::.<*Article_Body*>As your senior leaders, nothing is more important to us than creating a work environment where you feel safe, respected and included. Since Operation HONOUR began four years ago, we have begun the work of creating a lasting culture change – not only with a mandate, but with a movement. We are listening to and learning from those who have experienced various forms of sexual misconduct and are continuing to evolve our policies and programs. We are committed to putting effective prevention measures in place, and understanding why incidents of sexual misconduct occur. Responding to sexual misconduct appropriately with compassionate support is central to our efforts.<*Article_Body*>This culture change is not solely focused on the CAF, but across the Defence Team and our workplace. We are working towards a better future for everyone in the Defence Team, through victim centered support for CAF members through the Sexual Misconduct Response Centre, as well as through wellness and assistance programs for DND and NPF employees. If you have experienced sexual misconduct, we encourage you to reach out to the resources listed at the close of this message, and to report incidents so we can ensure you are provided with support.<*Article_Body*>The success of the Defence Team and the mission of the CAF depend on the unwavering trust and teamwork of our people: military and civilian alike, regardless of gender or background. To all those who have had the courage to come forward as part of these class actions – and to those who will come forward – we offer our sincere regret that you experienced sexual misconduct in our workplace. The settlement offers financial compensation, as well as unique policy measures to advance the culture change initiatives already underway, and opportunities for individuals to share their experiences through restorative engagement and consultation. Please know that by sharing your experiences, you are leading the way and pushing for real and lasting change.`};
    contentData.push(returnedItem);
    returnedItem = {Ref:"1", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"CAF-DND Sexual Misconduct Class Action", Type:"Notification", PublishDate:"July 19, 2019 05:00:00", Content:`<*Article_H1*>CAF-DND Sexual Misconduct Class Action<*Article_Note*>July 19, 2019<*Article_H3*>Important Update<*Article_Note*>The hearing to approve the proposed settlement agreement is scheduled for September 19 and 20, 2019 at 10:00am at the Federal Court in Ottawa, 90 Sparks Street.<*Article_H2*>Intro​du​ction<*Article_Body*>Are you a current or former member of the Canadian Armed Forces, or a current or former employee of the Department of National Defence or Staff of the Non-Public Funds, Canadian Forces?<*Article_Body*>Have you experienced sexual harassment, sexual assault or discrimination based on your sex, gender, gender identity or sexual orientation in connection with your military service or DND or SNPF employment?<*Article_Body*>There is a proposed settlement between the Canadian Federal Government and certain current and former members the Canadian Armed Forces ("CAF"), and current and former employees of the Department of National Defence ("DND") and/or Staff of the Non-Public Funds, Canadian Forces ("SNPF") who experienced sexual harassment, sexual assault or discrimination based on sex, gender, gender identity or sexual orientation ("Sexual Misconduct") in connection with their military service and/or employment with the DND/SNPF.<*Article_Body*>More information about the proposed settlement is available in the court-approved notice. A copy of the notice is available ::external::here||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Court%20Documents::external::. A copy of the Final Settlement Agreement is available ::external::here||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Court%20Documents::external::.<*Article_Body*>If you support the proposed settlement or if you object to the proposed settlement, you can submit a Participation Form. The Participation Form can be found ::external::here||https://www.classaction.deloitte.ca/en-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Court%20Documents::external::. You must mail this Form to CAF DND Sexual Misconduct Class Action c/o Deloitte, Bay Adelaide Centre, East Tower, 8 Adelaide Street West, Toronto, ON M5H 0A9, or email it to cafdndmisconduct@deloitte.ca and it must be received or postmarked no later than August 30, 2019.<*Article_Body*>You do not need to submit a Participation Form to share in the benefits of the proposed settlement. If the proposed settlement is approved by the Federal Court, more information will be available explaining how to obtain benefits from the settlement.<*Article_H2*>Contact Us​<*Article_Body*>If you have further questions regarding the administration of the Settlement, please contact the Interim Administrator at:<*Article_Body*>CAF DND Sexual Misconduct Class Action <br>c/o Deloitte <br>Bay Adelaide Centre, East Tower <br>8 Adelaide Street West, Toronto ON  M5H 0A9 <br>Telephone: ::external::1-888-626-2611||tel:1-888-626-2611::external:: <br>Email: ::external::cafdndmisconduct@deloitte.ca||mailto:cafdndmisconduct@deloitte.ca::external::`};
    contentData.push(returnedItem);
    
    return contentData;
}
