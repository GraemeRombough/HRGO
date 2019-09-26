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
const email = require("nativescript-email");
var phone = require("nativescript-phone");
var utils   = require("utils/utils");
var platformModule      = require("tns-core-modules/platform");

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
        if(checkURL[0] == "mailto"){
            console.log(checkURL[1]);
            emailLink(checkURL[1]);
            args.object.stopLoading();
        }else if(checkURL[0] == "tel"){
            console.log(checkURL[1]);
            callLink(checkURL[1]);
            args.object.stopLoading();
        }
        console.log(args.url);
    }
}

var callLink = function(phoneNumber){
    //console.log("call number:" + phoneNumber);
    phone.dial(phoneNumber,true);

};

var textLink = function(phoneNumber){
    //console.log("call number:" + phoneNumber);
    phone.sms(phoneNumber,"");

};

var copyToClipboard = function(clipboardText){
    clipboard.setText(clipboardText).then(function() {
        //console.log("OK, copied to the clipboard");
    });
    if(applicationSettings.getString("PreferredLanguage") == "French"){
        dialogs.alert({
            title: "Lien a été copié",
            message: "Le lien a été copié.",
        okButtonText: "OK"});
    } else {
        dialogs.alert({
            title: "Link Copied",
            message: "The link has been copied to your clipboard.",
            okButtonText: "OK"});
    }
}

var emailLink = function(emailText){
    if( emailText.includes("%")) {
        console.log("decode uri");
        emailText   = decodeURI(emailText);
    }
    
    var recipients  = "";
    var subject     = "";
    var body        = "";
    if( emailText.includes("::subject::")) {
        var sections    = emailText.split("::subject::");
        if( sections[0].includes("::body::")) {
            subject         = sections[1];

            var sections2   = sections[0].split("::body::");
            recipients      = sections2[0];
            body            = sections2[1];
        } if(sections[1].includes("::body::")) {
            recipients      = sections[0];

            var sections2   = sections[1].split("::body::");
            subject         = sections2[0];
            body            = sections2[1];
        } else {
            recipients      = sections[0];
            subject         = sections[1];
        }
    } else if( emailText.includes("::body::")) {
        var sections    = emailText.split("::body::");
        recipients      = sections[0];
        body            = sections[1];
    } else {
        recipients   = emailText;
    }

    console.log("To: " + recipients);
    console.log("Subject: " + subject);
    console.log("Body: " + body);


    email.available().then((success) => {
        var toAddress   = recipients.split(";");
        if(success) {
            email.compose({
                subject: subject,
                body: body,
                to: toAddress
            });
        } else {
            console.log("try url email");
            if( utils.openUrl("mailto:" + encodeURI(recipients) + "?subject=" + encodeURI(subject) + "&body=" + encodeURI(body))) {
                console.log("email success");
            } else {
                console.log("Email Not Available");
                clipboard.setText(recipients).then(function() {
                    console.log("OK, copied to the clipboard");
                })
                if(applicationSettings.getString("PreferredLanguage") == "French"){
                    dialogs.alert({
                        title: "Courriel n'est pas disponible",
                        message: "GO RH ne peux pas ouvrir votre client de courriel.  Votre message a mis dans le presse papier pour mettre dans votre client de courriel.",
                        okButtonText: "OK"});
                } else {
                    dialogs.alert({
                        title: "Email Not Available",
                        message: "HR GO cannot open your email client.  Your message has been copied to the clipboard to be pasted in your email client of choice.",
                        okButtonText: "Continue"});
                }
            }
        }
    });
}

exports.onWebViewLoaded = function(webargs) {
    //console.log( "onWebViewLoaded ************************************************************" );

    const webview = webargs.object;

    if ( platformModule.isAndroid ) {
        
        var LinkOverrideWebViewClient = android.webkit.WebViewClient.extend({
            shouldOverrideUrlLoading: function(view, webResourceRequest) {
                if (webResourceRequest != null) {
                    var urlString   = String( webResourceRequest.getUrl());
                    //console.log( urlString );
                    if( urlString.startsWith("http://") || urlString.startsWith("https://") ) {
                        if( urlString.includes(".mil.ca/")) {
                            if( applicationSettings.getBoolean("EnableMilHyperlinks", false) == true ) {
                                utils.openUrl( urlString );
                            } else {
                                if( applicationSettings.getBoolean("EnableMilWarnings", true) == true ) {
                                    if(applicationSettings.getString("PreferredLanguage") == "French") {
                                        dialogs.alert({
                                            title: "",
                                            message: "Les liens pour .mil.ca/ ont été désactivés.",
                                            //message: "Les liens pour .mil.ca/ ont été désactivés.\r\nVous pouvez activer les liens ou désactiver cet avertissement à partir du formulaire Paramètres.",
                                        okButtonText: "OK"});
                                    } else {
                                        dialogs.alert({
                                            title: "",
                                            message: "Links for .mil.ca/ have been disabled.",
                                            //message: "Links for .mil.ca/ have been disabled.\r\nYou can enable the links or turn off this warning from the Settings form.",
                                            okButtonText: "OK"});
                                    }
                                }
                            }
                        } else {
                            utils.openUrl( urlString );
                        }
                        return true;
                    } else if( urlString.startsWith( "mailto:")) {
                        emailLink( urlString.substr( 7));
                        return true;
                    } else if( urlString.startsWith( "tel:")) {
                        callLink( urlString.substr( 4));
                        return true;
                    } else if( urlString.startsWith( "sms:")) {
                        textLink( urlString.substr( 4));
                        return true;
                    } else if( urlString.startsWith( "copy:")) {
                        copyToClipboard( urlString.substr( 5));
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });

        // override long press gesture to copy links to the clipboard
        let myListener = new android.view.View.OnCreateContextMenuListener({
            onCreateContextMenu: function (menu, view) {
                if( view.getHitTestResult().getType() != 0 ) {
                    copyToClipboard( view.getHitTestResult().getExtra());
                }
                return false;
            }
        });

        webview.android.setOnCreateContextMenuListener(myListener);

        webview.android.setWebViewClient(new LinkOverrideWebViewClient());
        webview.android.getSettings().setDisplayZoomControls(false);
        if( webargs.enableZoom != null ) {
            webview.android.getSettings().setBuiltInZoomControls(webargs.enableZoom);
            webview.android.getSettings().setSupportZoom(webargs.enableZoom);
        } else {
            webview.android.getSettings().setBuiltInZoomControls(false);
            webview.android.getSettings().setSupportZoom(false);
        }
    } else {
        // TODO: figure out how to perform the overrides on iOS
        //webview.ios.
    }
}

var createArticle = function()
{   
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
                    htmlString += `<a href="${linkText[1]}" data-rel="external">${linkText[0]}</a>`;      
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
    returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Your Pay Information", Title:"Pay Basics", Type:"Article", Content:"<*Article_H1*>Your Pay Information<*Article_Body*>The Public Service Pay Centre is responsible for all pay and benefits services. For general questions about your pay, contact the Client Contact Centre.<*Article_H1*>Pay Basics<*Article_Body*>Learn more about Pay for the Public Service, including How Public Services Pay Works, Collective Agreements and rates of pay for federal employees. <*Article_Body*>Visit PSPC’s Pay and Changes in Your Life page for information about taking leave, updating marital or employment status, changing personal information, becoming a parent, and other life events."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"2", BusinessLine:"Pay", Category:"Your Pay Information", Title:"View and Understand Your Pay", Type:"Article", Content:"<*Article_H1*>View and Understand Your Pay<*Article_Body*>Access the Phoenix Pay System to:<*Article_List*>View your paystubs and tax slips<*Article_List*>use pension or tax calculators<*Article_List*>update your pesronal inforamtion <*Article_Body*>You will need a MyKey or a department-issued Smartcard/PKI to log in. <*Article_Body*>For a detailed explanation of your pay stub, visit Public Services and Procurement Canada’s How to Read Your Pay Stub webpage."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", BusinessLine:"Pay", Category:"Problems with your Pay", Title:"Reporting your Pay Issue", Type:"Article", Content:"<*Article_H1*>Problems with Your Pay<*Article_Body*>If you require emergency funds request a salary advance*** Report your pay issue by following these three steps.<*Article_H2*>Step 1<*Article_List*>Speak to your manager about your pay issue.<*Article_List*>Ensure all required documentation (including staffing and classification) to support your request has been submitted by your manager.<*Article_List*>Submit your request through the Human Resource Services and Support (HRSS) tool by selecting either Report Pay Issue Step 1: Submit a Phoenix Feedback Form or Submit Pay Action <*Article_H2*>Step 2 <*Article_List*>If your case is not resolved within 21 days, please proceed to Reporting Pay Issue: Step 2: Escalate your Pay issue in the Human Resource Services and Support (HRSS) tool. <*Article_List*>The Compensation Unit will work with the Pay Centre to resolve your case. All cases are escalated by priority and are prioritized as outlined below:<*Article_List*>Priority 1: employees not receiving basic pay and benefits (including students and casuals), death in service, LWOP (Disability), Maternity and Paternity leave top up, terminations, record of employment, transfers in and out, labour relations and any other no basic pay situations.<*Article_List*>Priority 2: employees with pay at risk of disruption, including salary above the minimum, overpayment disputes, leave with income averaging, pre-retirement transition leave and any priority 3 case greater than 18 months.<*Article_List*>Priority 3: actings, promotions, increments, pension 35 years of service and ex-military leave.<*Article_H2*>Step 3<*Article_List*>A compensation advisor will follow up with you to gather more information about your pay issue and work towards resolving your issue. "};
    contentData.push(returnedItem);
    returnedItem = {Ref:"4", BusinessLine:"Pay", Category:"Problems with your Pay", Title:"Emergency Salary Advance", Type:"Article", Content:"<*Article_H1*>Emergency Salary Advance<*Article_Body*>If you require an Emergency Salary Advance (ESA), inform your manager. When an employee requires an ESA, submit a request through the Human Resource Services and Support (HRSS) tool under the Pay Action Request (PAR) option.<*Article_Body*>Unless employees choose to pay the amounts owing right away, recoveries of these amount will only start when:<*Article_Note*>All monies owed to the employee have been paid<*Article_Note*>The employee had received three consecutive correct pay cheques<*Article_Note*>A recovery agreement has been established<*Article_Note*>Please contact the Pay Centre if you have questions about this process."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"5", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"Employee Roles in Pay", Type:"Article", Content:"<*Article_H1*>Employee Roles in Pay<*Article_List*>Ensure that you have correctly selected your Section 34 Manager in Phoenix Self-Service. <*Article_List*>If you are in an acting position you must select your Section 34 Manager for that record (even if they have not changed). Acting appointments create a new employee record and information is not copied from your substantive position.<*Article_List*>Inform your manager of your schedule if you do not work a regular Monday to Friday work schedule.<*Article_List*>Advise your manager of correct time and Leave Without Pay (LWOP) if you do not have access to Employee Self-Service in Phoenix.<*Article_List*>Enter overtime and leave requests within the identified cut-off periods. Inform your manager each time you submit a request. Managers are not automatically notified there is a request pending their approval."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"6", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"Section 34 Manager Roles in Pay", Type:"Article", Content:"<*Article_H1*>Section 34 Manager Roles<*Article_List*>Ensure your employees have selected you as their Section 34 Manager in Phoenix Self-service.<*Article_List*>Enter and Review schedules for employees who do not work a regular work schedule and action any outstanding requests weekly.<*Article_List*>Ensure your employees input basic pay for ‘when and as required employees’, overtime and Leave Without Pay (LWOP) transactions for 5 days or less in Phoenix Self-Service within the pay period in which they incurred (no later than Thursday of pay week).<*Article_List*>Review and action pay requests in Phoenix Self-Service every week (Phoenix DOES NOT automatically notify you that there is a new request). <*Article_List*>If you are unsure of a transaction, call S. 34 Manager Support: ::external::1-833-747-6363||tel:1-833-747-6363::external::.<*Article_List*>Action Leave requests in HRMS/Peoplesoft.<*Article_H3*>Military Managers<*Article_Body*>Provide the departmental timekeeper with documentation to ensure employee schedules, timesheets for basic pay for ‘when and as required employees’, overtime and LWOP of 5 days or less is completed in Phoenix Self-Service on your behalf."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"7", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"Section 34 Self-Service Pay Requests", Type:"Article", Content:"<*Article_H1*>Section 34 Phoenix Self-Service Pay Requests  <*Article_Body*>Section 34 Managers must review and action pay transactions in Phoenix Self-Service every week to prevent pay issues. Delayed approvals result in late payments and will sometimes trigger additional problems in Phoenix.<*Article_Body*>Follow these steps to ensure your employees are paid accurately and on time:<*Article_List*>Ensure your employees have selected you as their Section 34 Manager in Phoenix Self-Service.<*Article_List*>Review and action your employees’ pay requests every week within Phoenix Self-Service. Managers must action all pay requests by Friday of each week (or Thursday if the Friday falls on a statutory holiday). <*Article_List*>Phoenix does not automatically notify you that a transaction was submitted. Ask your employees to let you know each time they submit a request. Tip: Set a recurring weekly calendar reminder to check for pending requests. <*Article_List*>For detailed instructions on how to access and approve transactions, please read the How to Approve Payable Time Training Aid. <*Article_List*>If you are unsure of how to proceed with a transaction, call S. 34 Manager Support at ::external::1-833-747-6363||tel:1-833-747-6363::external:: to help you through the process.<*Article_Note*>Note: if transactions are not entered and/or approved within 6 months of its occurrence, the transaction cannot be processed through Phoenix and the Section 34 manager will have to submit a PAR for processing through the Human Resources Services and Support."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"8", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"HR/Staffing Action Affecting Pay", Type:"Article", Content:"<*Article_H1*>HR/Staffing Transactions Affecting Pay<*Article_Body*>Managers must follow the timelines below when submitting HR staffing transactions:  <*Article_List*>Return the completed letter of offer package (including the signed letter of offer and all pay related documents) to the staffing contact indicated in the letter of offer 15 working days prior to the start date.<*Article_List*>Sub-delegated managers and employees must approve HR Requests in HRMS 15 working days prior to the effective date.<*Article_List*>Submit pay action requests (PARs) for employees starting or returning from leave without pay through the Human Resource Services and Support (HRSS) before they leave or as soon as they return to the workplace so that their pay can be immediately started or stopped."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"9", BusinessLine:"Pay", Category:"Hours and Scheduling", Title:"Overtime", Type:"Article", Content:"<*Article_H1*>Overtime<*Article_Body*>Overtime is the compensation for authorized work performed in addition to standard daily or weekly hours of work or on usual days of rest as described in the provisions of the relevant collective agreement or terms and conditions of employment<*Article_Body*>Overtime must be authorized in advance and approved in agreement to Section 34 of the Financial Administration Act (FAA) and the employee's relevant collective agreement.<*Article_Body*>Note:  Employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee. <*Article_H2*>Compensation in Leave (Compensatory Time-Off)<*Article_Body*>To request compensation for overtime through leave (Compensatory Time Off), follow these steps:<*Article_List*>Complete form “DND 907” from the Defence Forms Catalogue <*Article_List*>Submit the form to your section 34  manager for approval and signature<*Article_List*>Once it is received, the section 34 manager submits the form through the  Human Resources Services and Support (HRSS) tool. Under the Other Requests tab, select Extra Duty Pay in Compensatory Time.<*Article_H2*>Compensation in Cash<*Article_Body*>To be compensated for overtime in cash, employees should follow this process:<*Article_H3*>Employees reporting to section 34 civilian managers:<*Article_List*>All overtime hours must be submitted by, or on behalf of the employee directly in Phoenix. <*Article_List*>Section 34 managers must complete the approval no later than 2:00 pm EST on the Monday of a non-pay week.<*Article_List*>Employees must ensure their data entry is entered into Phoenix no later than 8:30pm EST on the Sunday of the pay week.  <*Article_H3*>Employees reporting to military managers:<*Article_List*>Complete form “DND 907” in the Defence Forms Catalogue.  <*Article_List*>Submit to your section 34 manager for approval and signature<*Article_List*>Once approved, submit it through the Human Resources Services and Support (HRSS) tool for processing either bi-weekly or monthly<*Article_List*>Under the “Access Timekeepers” tab, select “Extra Duty Pay in Cash.”<*Article_H3*>Section 34 Managers<*Article_List*>Employees must submit their overtime hours directly in Phoenix no later than 8:30 pm on the Sunday of pay week. <*Article_List*>Section 34 managers must complete the approval no later than 2:00 pm EST on the following Monday of the non-pay week, to ensure payment will be processed on time.  <*Article_H1*>Section 34 military managers<*Article_List*>Section 34 military managers are to approve and sign the form “DND 907”in the Defence Forms Catalogue <*Article_List*>Once approved, Section 34 military managers must submit on a bi-weekly or monthly basis through the Human Resources Services and Support (HRSS) tool for processing<*Article_List*>Under the “Access Timekeepers” tab, select “Extra Duty Pay in Cash.”<*Article_Note*>Note: When a statutory holiday falls on the Friday or Monday where submissions or approvals would normally be due in Phoenix, the deadline will be earlier."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"10", BusinessLine:"Pay", Category:"Hours and Scheduling", Title:"Managing Employee Schedules", Type:"Article", Content:"<*Article_H1*>Managing Employee Schedules<*Article_Body*>As a Section 34 manager, you must ensure that employee work schedules are correctly entered into the Phoenix pay system. <*Article_Body*>Work schedules vary from person to person and in the case of part-time employees, individual schedules can change from one term to the next. <*Article_Body*>Failure to properly manage and maintain employee schedules will result in inaccurate self-service results, which could impact employee payments.<*Article_Body*>Visit GCpedia for more information on entering or deleting  employee schedules.<*Article_Body*>For assistance with entering schedules, section 34 managers can contact a timekeeper."};
    contentData.push(returnedItem);
    //STUDENT ARTICLES
    returnedItem = {Ref:"11", BusinessLine:"Students", Category:"Student Hiring Initiative", Title:"Student Hiring Information for Managers", Type:"Article", Content:"<*Article_H1*>Student Hiring Information for Managers<*Article_List*>Start student hiring early<*Article_List*>Support student onboarding with a timely hiring process using the NEW Student Start Date Calculator:<*Article_List*>  Submit complete staffing packages at least 30 business days in advance of the chosen start date. <*Article_List*>  Ending a student’s employment on a pay day will eliminate delays in the issuance of the student’s final pay. <*Article_List*>Prepare a functional workspace for the students’ arrival;<*Article_List*>Welcome students through orientation mechanisms that will ensure students understand their commitment under the Values and Ethics Code for the Public Sector. <*Article_List*>Provide student with an overview of the DND Student Corner, highlighting key resources such as the list of training and the Student Passport;<*Article_List*>Provide meaningful work throughout the term that allows students to learn and contribute to the objectives of the organization."};

    contentData.push(returnedItem);

    returnedItem = {Ref:"12", BusinessLine:"Students", Category:"Student Hiring Initiative", Title:"National Student Hiring Team", Type:"Article", Content:"<*Article_H1*>National Student Hiring Team<*Article_Body*>The National Student Hiring Team (NSHT) provides virtual tools, How-To Guides  , and simplified processes to help managers quickly identify, assess and hire new students, rehire previous students, and bridge former students into indeterminate or term civilian positions. "};

    contentData.push(returnedItem);

    returnedItem = {Ref:"13", BusinessLine:"Students", Category:"Student Hiring Process", Title:"Student Security Screening", Type:"Article", Content:"<*Article_H1*>Student Security Screening<*Article_Body*>Contact your Unit Security Officer to action the reliability screening and any additional security screening requirements. Please visit Security Instructions  for more information.<*Article_Note*>NOTE: In order for USS to prioritize requests add the following subject line to your request: Student Hiring FY 2019-2020."};

    contentData.push(returnedItem);

    returnedItem = {Ref:"14", BusinessLine:"Students", Category:"Student Hiring Process", Title:"Student Targeted Inventories", Type:"Article", Content:"<*Article_H1*>Student Targeted Inventories<*Article_Body*>The Public Service Commission (PSC) continues to support targeted recruitment inventories including:<*Article_H3*>Indigenous Student Employment Opportunity (ISEO)<*Article_Body*>Hiring managers can access this pool of talented students by submitting requests for referrals to the PSC and by selecting the ISEO inventory<*Article_H3*>Employment Opportunity for Students with Disabilities<*Article_Body*>EOSD is a national recruitment initiative targeting students who self-declare as having a disability for a summer employment opportunity. Send a request for referrals to the PSC <*Article_H3*>Reservist Student Employment Opportunity (RSEO)<*Article_Body*>Managers can access this inventory by selecting the RSEO inventory."};

    contentData.push(returnedItem);

    returnedItem = {Ref:"15", BusinessLine:"Students", Category:"Student Hiring Process", Title:"E-Staffing and Student Re-Hires", Type:"Article", Content:"<*Article_H1*>E-Staffing and Student Re-Hires<*Article_Body*>All requests for re-hiring a student must be submitted through the e-Staffing portal. The National Student Hiring Team will work in the e-Staffing system to complete the transaction and issue the letter of offer to the hiring manager.  "};

    contentData.push(returnedItem);

    returnedItem = {Ref:"16", BusinessLine:"Students", Category:"Student Hiring Process", Title:"FAQs - Federal Student Work Experience Program (FSWEP)", Type:"Article", Content:"<*Article_H1*>FAQs - Federal Student Work Experience Program (FSWEP)<*Article_H3*>Can a non-Canadian student who meets the requirements of the position be hired?<*Article_Body*>In keeping with paragraph 39(1)(c) of the Public Service Employment Act, preference must be given to Canadian citizens. Accordingly, a work term must be offered to a Canadian student who meets the requirements before the position can be offered to a non-Canadian student.<*Article_H3*>When no Canadians qualify, or when there are not enough qualified Canadians to meet my needs, can qualified non-Canadian applicants be appointed?<*Article_Body*>Yes, if no Canadians qualify, or when there are not enough qualified Canadians to meet the organization's needs, non-Canadians who have qualified can be appointed. However, non-Canadians who are selected must be legally entitled to work in Canada.<*Article_H3*>Are students eligible for pension and benefits?<*Article_Body*>Yes, most students are eligible for pension and benefits. Eligibility and commencement dates of each benefit vary based on the students working hours (Full-Time vs. Part-Time) and length of service respectively. More details can be found in the Phoenix Self Service Benefits Guide for Students<*Article_H3*>Can a student be employed in two FSWEP placements at the same time?<*Article_Body*>There is nothing specifically within the policy that prevents a student from carrying out the duties of more than one position/assignment (‘dual employment’).<*Article_Body*>That being said, the ‘dual employment’ situation must not create a conflict of interest for either organization (or for either hiring manager). Therefore, the hiring managers in both organizations should be aware of the situation. It is important to remember that students should work part-time during academic session and full-time only during the summer (37.5 hours).<*Article_Body*>It is also important to remember that some students because of their academic workload may not be able to work many hours; other students may be able to work a few more hours. Hours of work are to be established between the hiring manager and the student. Remain mindful in this instance; respect for one of the primary intents of the Student Employment Programs (to allow for academic achievement / success, balance their work and personal lives), may not be attained if a student works too many hours.<*Article_H3*>Can a CO-OP student be rehired as an FSWEP student?<*Article_Body*>Yes, as long as they meet the eligibility criteria as described in the Student Employment Policy.<*Article_H3*>What is the difference between a Co-op program and an Internship?<*Article_Body*>Co-op is an educational program in which classroom instruction is alternated with semesters of work placement and performance evaluation in workplaces related to the field of study.<*Article_Body*>An internship is on-the-job training under the supervision of experienced workers, designed to give students the required skills and knowledge for entry into a trade or profession.<*Article_H3*>What is the normal duration of the assignments?<*Article_Body*>The academic institution determines the duration of each work assignment. Co-operative assignments traditionally last four months, but internship assignments may vary from four to 18 months. Managers may offer students back-to-back work terms with prior approval of the academic institution.<*Article_H3*>Can a student from any Co-op/Internship program be hired?<*Article_Body*>No. Only those students enrolled in PSC-approved Co-op/Internship programs can be recruited to work in the public service in the context of this program. Those programs are listed on the PSC Web site under 'PSC-approved programs.'<*Article_Body*>Where a program encompasses both mandatory and optional work terms, only those mandatory for graduation may be completed in the Public Service of Canada.<*Article_H3*>Does a learning plan for Co-op/Internship students have to be prepared?<*Article_Body*>Yes, the TBS Student Employment Policy requires that learning plans be prepared for each assignment. The plan can be tailor-made, or organizations can use the generic plan supplied by the educational institution, combined with a description of the specific assignment. Moreover, organizations are required to assess the student's progress.<*Article_Body*>Feedback is an important component of the learning process; a learning plan is essential because it sets out the goals to be achieved by students and provides a tool to assess their progress and performance at the end of the assignment."};

    contentData.push(returnedItem);

    returnedItem = {Ref:"17", BusinessLine:"Students", Category:"Student FAQs", Title:"FAQs - Hiring A Former Student", Type:"Article", Content:"<*Article_H1*>FAQs - Hiring A Former Student<*Article_H3*>How can I bridge a student (hire a former student) to a position within my organization?<*Article_Body*>Hiring of a former Student is typically an External Non-Advertised process, for which merit is applied and priority clearance is required. The Service Standard can be as long 82 business days. Once a staffing request has been received by the National Student Hiring Team, a NSHT Staffing Advisor will be assigned who will assist in the hiring process. The 82 business days accounts for any Second Language Evaluations (SLE) and security screening which may be required.  If the candidate already has SLE results, or if testing is not required, the processing time will decrease.<*Article_Body*>An NSHT Staffing Advisor will provide you with sound advice and timelines along the way. <*Article_H3*>I would like to Hire a Former Student but do not have a candidate for my position. Where do I start?<*Article_Body*>There are many ways to connect with talented recent graduates: contact other managers who have hired students, check out local university and college career placement centres or alumni associations (contact the NSHT for guidance), or consider hiring FSWEP or COOP students as part of your organization’s immediate and long-term HR plan.<*Article_Body*>To immediately connect with recent graduates, sign up for GCcollab and check out the Career Marketplace.<*Article_Body*>You can easily search for eligible and available candidates using the GCcollab Career Marketplace Student Integration Inventory. This is a talent sourcing and networking tool that leverages the information that users share in their GCcollab profiles in order to match to relevant opportunities. It is a digital space for students to advertise their interest in finding a job and for managers to advertise vacancies/opportunities. It helps connect students and managers government-wide and is accessible to federal, provincial, and territorial public servants, as well as, academics and students of all Canadian Universities and Colleges.<*Article_Body*>Register Now: GCcollab and then populate your profile. Managers can post job opportunities on the Career Marketplace Platform, or alternatively search GCcollab opportunity posts, or search user profiles to find external talent based on the skills they are looking for. If you are looking to hire former DND students, go to the “Find Members” or to the “Search Opportunities” tabs on the Career Marketplace homepage and sort by “Student Integration” and then enter your desired criteria for a specific position. <*Article_H3*>What are the eligibility requirements for Hiring of a Former Student?<*Article_Body*>ADM(HR-Civ) has provided the following guidelines for hiring former students for DND (DSPP Bulletin 101, June 2018): “Former students are eligible for hiring provided they:<*Article_List*>Are not currently employed in the public service on a  full time, part-time, seasonal or term basis; <*Article_List*>Have graduated from a recognized educational institution no more than 60 months (5 years) prior to the appointment date, with some flexibility to extend this timeline if appropriate to the position being staffed; and <*Article_List*>Meet the merit criteria and conditions of employment. <*Article_Body*>If you have a candidate in mind who meets the criteria above and have a vacant position to fill, contact the NSHT for more information! <*Article_H3*>Does the Hiring of a Former Student process require priority clearance?<*Article_Body*>Yes! The Hiring of a Former Student staffing mechanism is an appointment under the Public Service Employment Act (PSEA), which includes the requirement to assess persons with a priority entitlement prior to considering other candidates. The priority clearance process takes approximately 10 business days, and must be accounted for in the timeline for file processing. Should a person with a priority entitlement bring forward their interest in the position, they are to be assessed against the Essential Qualifications and Conditions of Employment of the position in a fair, transparent and timely manner. In accordance with the PSEA, should a priority individual be deemed qualified for the position, that priority individual will be appointed to the position being filled. <*Article_H3*>Can my client staffing advisor submit priority clearance?  <*Article_Body*>No. A NSHT Staffing Advisor will assist you with your Hire of a Former Student file from start to finish. This ensures continuity of service and the efficient and timely processing of the staffing file. This also allows us the opportunity to provide recommendations in line with the rejuvenation efforts associated with hiring former students.<*Article_H3*>Do I have to assess the candidate? <*Article_Body*>Yes. The Assessment of the Candidate confirms how the candidate meets each Essential Qualifications of the position as identified in the merit criteria including official language proficiency. The Assessment documentation can include, but is not limited to, notes from interviews and reference checks, proof of education, the candidate’s resume and cover letter, as well as Narrative Assessments written by managers who can attest that the candidate demonstrates the merit criteria. Your NSHT Staffing Advisor can work with you to ensure that enough information is collected to demonstrate how the candidate meets the Essential Qualifications of the position.<*Article_H3*>What information does the Articulation of Selection Decision contain? <*Article_Body*>The articulation of selection decision documents the key considerations taken into account throughout the appointment process.   The articulation which is provided in writing, also identified the individual selected for appointment.  There are a minimum of two elements contained in the Articulation of Selection Decision, as outlined in the Guide to the ADM HR-Civ Directive, Appointments :<*Article_List*>A brief explanation for the choice of staffing process; and<*Article_List*>The name of the selected candidate and confirmation that they meet the essential merit criteria of the position being staffed.<*Article_Body*>The Articulation of Selection Decision also includes other factors that were considered, such as employee recruitment and retention plans, succession planning, EE representation, etc. The Articulation confirms that the decision is free from political influence and personal favoritism. Please see an example of an Articulation document on the NSHT Student Talent Acquisition SharePoint site for guidance. <*Article_H3*>Why is it recommended that I anticipate 25 business days between the day the LOO is issued and the employee’s expected Start Date?  <*Article_Body*>The TBS Service Standards outlines these recommendations in order to avoid issues with pay. <*Article_H3*>If a candidate has completed all program requirements but does not have proof of graduation (diploma) at the time of appointment, what do I do?<*Article_Body*> Proof of program completion can include documents such as a diploma, transcript, or a letter from the educational institution. The document must clearly confirm that the academic program has been completed and the graduation date. The manager must validate this information and confirm that the candidate has met this merit criteria as an essential part of the Hiring of a Former Student staffing file. <*Article_H3*>Do I have to provide proof of citizenship and diploma? <*Article_Body*>As per the Public Service Employment Act, Canadian citizens are to be considered for positions before non-Canadians. Confirmation of the candidate’s Canadian citizenship is a file requirement. However, personal documentation is not to be kept on the staffing file. Written confirmation from the hiring manager will suffice.<*Article_Body*>Similarly, proof of program completion, such as a diploma, is an essential part of a Hiring of a Former Student file. The manager needs not provide a copy of the diploma, however written confirmation that the manager has validated the Education Qualification is a file requirement. Note that in certain high-risk professions, the manager may require more tangible proof of education credentials in assessing this merit criterion, in which case, copies of these credentials, or that the credentials have been viewed, would need to be retained on the staffing file. <*Article_H3*>What is a Conditional Letter of Offer? <*Article_Body*>A conditional letter of offer is a conditional employment offer. However, before the appointment can be made, merit must be completely assessed, all requirements of the conditional offer must be met (e.g., completion of degree, further testing, conditions of employment such as security) and the oath of the public service administered. The candidate cannot commence employment until they meet all conditions.<*Article_Body*>Persons with a Priority Entitlement must be considered first and priority clearance must be received before a conditional letter of offer can be issued. <*Article_H3*>Why does my Merit Criteria require so much change? <*Article_Body*>Candidates for Hiring of a Former Student appointments have the potential for excellent careers in the Public Service. However they often do not have extensive experience. The NSHT recommends that the merit criteria of your position focus on the personal competencies required for the position, rather than thorough experience and knowledge criteria which can be acquired on the job. Through a review of your draft merit criteria, your NSHT Staffing Advisor may also identify redundancies in the Essential Qualifications which the former student would likely meet given their recent completion of an educational program. An added benefit to this approach is that it streamlines your assessment process. <*Article_H3*>Tell me about Security Screening<*Article_Body*>The security requirement of a position is a Condition of Employment, which the candidate must meet prior to being appointed. Specific to positions requiring access to classified information and assets, note that the security requirements of a position cannot be downgraded to facilitate the hiring process (National Defence Security Orders and Directives - Chapter 4).  Please contact your Unit Security Supervisor (USS) to initiate the security screening process, or transfer from another government department. Please see the DGDS website for more information. <*Article_H3*>Where can I find information regarding minimum Qualification Standards? <*Article_Body*>All appointments are bound by the Qualification Standards for employment in the core public administration as determined by TBS for each employment group and classification. The merit criteria of the position must reflect both the applicable Qualification Standard and the eligibility requirements for the Hiring of a Former Student staffing mechanism – meaning, the candidate must have had graduated from a recognized education institution within 60 months of appointment.<*Article_H3*>Why should my employee start on the first day of a pay period? <*Article_Body*>Having your employee start on the first day of a pay period will allow the employee to receive a full two-week salary on his first pay. As we are paid in arrears, starting an employee on a Monday or on a non-pay week would result in additional wait time before your employee sees a full payment.<*Article_Body*>With this being said, for term employment, the first day of a pay period is not as significant as the employee being terminated on the final day of a pay period. In this case, the employee is not left waiting for their final payment.<*Article_H3*>If my employee is experiencing a delay in pay, what could be the reason?<*Article_Body*>Timeliness is of the essence. DND is solely responsible for entering the hire/rehire of an employee. For the appointment to be completed and for pay to start, the data entry needs to be completed by HR and all the paperwork must be submitted to the Pay Centre in a timely manner. This includes the return of the Letter of Offer, as well as all other required documents such as the Oath, direct deposit, tax forms, etc. The Public Service Pay Centre (PSPC) has established a service standard of 20 working days for starting and stopping pay. If an employee still hasn’t received a payment after the 20 working day period, they are entitled to request an Emergency Salary Advance (ESA)."};

    contentData.push(returnedItem);
    //LEAVE ARTICLES
    returnedItem = {Ref:"19", BusinessLine:"Pay", Category:"Leave", Title:"Leave Basics", Type:"Article", Content:"<*Article_H1*>Leave<*Article_Body*>Leave refers to an authorized absence from duty by an employee during regular or normal hours of work.<*Article_Body*>Read the Treasury Board Secretariat’s Directive on Leave and Special Working Arrangements  and Collective Agreements for Public Service for more information. <*Article_Note*>Peoplesoft (HRMS)<*Article_Body*>Employees can submit, amend or cancel requests for sick, vacation and other types of leave through this tool.<*Article_H2*>Leave Without Pay (LWOP)<*Article_H3*>Employees reporting to Civilian Section 34 Managers:<*Article_Body*>Leave without Pay (LWOP) requests less than six days must be entered and approved through Phoenix Self Service.<*Article_Note*>Phoenix Self Service<*Article_Body*>LWOP requests for more than five days – the employee completes Form GC 178 in the Defence Forms Catalogue. <*Article_Note*>Human Resource Services and Support<*Article_List*>LWOP requests less than six days – the employee completes Form GC 178 in the Defence Forms Catalogue. <*Article_List*>The Manager approves and submits it through the Human Resource Services and Support by selecting the Access Timekeeper option, where it will be processed by a timekeeper.<*Article_List*>LWOP requests for more than five days – the employee completes Form GC 178 in the Defence Forms Catalogue.<*Article_List*>The Manager approves and submits it through the Human Resource Services and Support by selecting the Submit Pay Action option.<*Article_Note*>Please note: Leave may only be authorized by a manager who has been delegated the authority to grant leave. <*Article_Note*>The level of delegation required varies according to the nature and duration of a particular leave request. <*Article_H2*>Delegated Manager Responsibilities <*Article_Body*>Managers with the delegated authority to approve leave must:<*Article_List*>ensure that requests for leave are only approved in accordance with the employee’s Terms and Conditions of Employment;<*Article_List*>consider all operational factors before approving requests for leave with or without pay;<*Article_List*>approve all applications for leave in a fair, consistent and transparent manner;<*Article_List*>direct employees to the appropriate sources of information, such as the departmental compensation advisor, before approving leave or special working arrangements that may have an effect on the employee's pay or benefits;<*Article_List*>seek advice and direction from human resources advisors in cases of leave without pay due to illness and in any cases where political activity pursuant to the Public Service Employment Act is involved; <*Article_List*>provide the departmental compensation advisor with approved applications to process leave without pay or special working arrangements. "};
    contentData.push(returnedItem);
    returnedItem = {Ref:"20", BusinessLine:"Pay", Category:"Leave", Title:"Leave with Income Averaging", Type:"Article", Content:"<*Article_H1*>Leave with Income Averaging<*Article_Body*>Leave with income averaging is where eligible employees reduce the number of weeks worked in a specific 12-month period by taking leave without pay for a period between a minimum of 5 weeks and a maximum of 3 months.<*Article_Body*>Pay is reduced and averaged out over the 12-month period to reflect the reduced time at work. <*Article_List*>Employees must complete the Leave with Income Averaging application and submit to their S. 34 Manager for approval 6 weeks prior to the effective date. <*Article_List*> Once the leave has been approved, the S. 34 Manager will submit the application via HRSS where a Trusted Source will send the form and PAR to the Pay Center for action. <*Article_Body*>Employees are still subject to the provisions of the relevant collective agreement or terms and conditions of employment, and employment status (full or part-time) remains unchanged during the working arrangement.<*Article_Note*>This policy applies to all employees represented by all unions, as well as unrepresented and excluded employees.<*Article_Note*>The leave without pay portion of the working arrangement may be taken in two periods within the 12-month period. Each period must be at least 5 weeks and the sum of the two periods must not exceed 3 months. Although employees receive income throughout the 12-month period, they are deemed to be on leave without pay during the non-work period of the arrangement."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"21", BusinessLine:"Pay", Category:"Leave", Title:"Pre-retirement Transition Leave", Type:"Article", Content:"<*Article_H1*>Pre-retirement Transition Leave<*Article_Body*>Pre-retirement transition leave is a special working arrangement where eligible employees who are within two years of retirement reduce their work week by up to 40 per cent. For a full-time employee, this represents up to two out of five working days.<*Article_H2*>How to Apply<*Article_H2*>How it Works<*Article_Body*>Pay is adjusted to reflect the shorter work week, but pension and benefits coverage, as well as premiums and contributions, would continue at the pre-arrangement levels. The employee continues to be subject to the provisions of their relevant collective agreement or terms and conditions of employment and employment status (full- or part-time) remains unchanged during the working arrangement."};
    contentData.push(returnedItem);

    //STUDENT PRE-ONBOARDING
    returnedItem = {Ref:"22", BusinessLine:"Students", Category:"Student Onboarding", Title:"Student Pre-Onboarding", Type:"Article", Content:"<*Article_H1*>Student Pre-Onboarding <*Article_Body*>We want to help make your onboarding experience a positive one! Before you start your student employment at the Department of National Defence (DND), please ensure that you take the time to review the information below so that you are prepared for your first day of work.  <*Article_H2*>Read about who we are<*Article_List*>Go to the ::external::About Us||http://www.forces.gc.ca/en/about-us.page::external:: page to read about the Defence Team’s vision and organizational priorities.  <*Article_H2*>Familiarize yourself with the organizational structure at DND, Military ranks<*Article_List*>Go to the ::external::About Organizational Structure||http://www.forces.gc.ca/en/about-org-structure/index.page::external:: page to read about DND’s high-level reporting structure. <*Article_List*>Go to the ::external::Rank Appointment Insignia page||http://www.forces.gc.ca/en/honours-history-badges-insignia/rank.page::external:: to read about the ranks within the Canadian Armed Forces (CAF). <*Article_H2*>Familiarize yourself with the Student Rates of Pay<*Article_List*>Students are paid in accordance with the ::external::Terms and Conditions of Employment for Students||https://www.tbs-sct.gc.ca/pol/doc-eng.aspx?id=12583::external:: (::external::Student Rates of Pay||https://www.canada.ca/en/treasury-board-secretariat/services/pay/rates-pay/student-rates-pay-effective-january-1-2014.html::external::). Payday is every two weeks, falling on Wednesdays, so you can expect to get paid four weeks from the date your employment starts (as we are paid in arrears). <*Article_List*>In lieu of vacation, students are entitled to vacation pay, equal to four per cent of their total regular and overtime earnings.<*Article_H2*>Read and complete all forms provided by your manager and/or Human Resources (HR)<*Article_List*>Letter of Offer<*Article_List*>Direct Deposit Form<*Article_List*>Tax Forms (Federal and Provincial)<*Article_List*>Employee Questionnaire Form<*Article_List*>Political Activities and You! Brochure<*Article_List*>DND and CF Code of Values and Ethics Brochure<*Article_List*>DND/CAF Self-Identification Form<*Article_H2*>Prepare for your first day of work<*Article_Body*>If your manager hasn’t contacted you, contact them to confirm your start date, expected time of arrival, work location, transportation options/parking, what to do when you arrive, etc. <*Article_List*>Be prepared to talk to your manager about your role and expectations and any workplace accommodations that are needed; come prepared with any questions you might have, as your manager/supervisor will be setting some time aside to review your Letter of Offer and other HR documents with you.<*Article_List*>Note that your manager will determine your hours of work, work breaks and the way your attendance will be recorded. This discussion will also cover procedures regarding overtime, leave requests and reporting in when you are unable to come to work.<*Article_H2*>Prepare to bring with you<*Article_Body*>A valid piece of government-issued photo ID (i.e. Driver’s License, Passport, etc.) in order to receive a temporary building pass.<*Article_Body*>Your signed Letter of Offer and any other any other information requested by your manager. <*Article_H2*>At DND<*Article_Body*>At DND, you will have access to a helpful Student Onboarding Program to assist you in becoming familiar with your new work environment. More information will be provided to you upon your arrival. We encourage you to take advantage of the onboarding tools and resources to better understand your new role and ensure that you enjoy your work experience with us.<*Article_Body*>For any questions please contact the ::external::DND Student Onboarding team.||mailto:DNDOnboarding-AcceuiletintégrationduMDN@forces.gc.ca::external::"};
    contentData.push(returnedItem);


    return contentData;
}
