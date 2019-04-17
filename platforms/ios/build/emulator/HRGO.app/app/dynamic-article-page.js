var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
var buttonModule = require("ui/button");
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
const pageData = new observable.Observable();
var articleReference;

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    articleReference=page.navigationContext;
    //page.content = myActionBar;
    page.content = createMainGrid();

    
    console.log(articleReference.Language);
    console.log(articleReference.ArticleID);
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
function goToHome(eventData){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
}
var getArticleText = function(aID, aLang)
{
    //.findIndex(value)
    var articles = getFromDatabase();
    var articleText;
    for (i = 0; i < articles.length; i++){
        if(articles[i].Ref == aID){
            articleText = articles[i].Content;
            break;
        }
    }
    
    //articleText.push("<*Article_H1*>Overtime<*Article_Body*>Overtime refers to compensation for authorized work performed in excess of the standard daily or weekly hours of work, or on the normal days of rest an employee may be entitled to, pursuant to the provisions of the relevant collective agreement or terms and conditions of employment.<*Article_H2*>Claiming Overtime<*Article_Body*>Instruct your employee to complete the Extra Duty Pay and Shiftwork Report (Form DND 907). To learn how to complete this form, the manager's instructions are found on page 2.<*Article_Note*>Note that certain employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee.<*Article_H2*>Process Overview: Overtime Approval<*Article_Body*>Overtime must be authorized in advance and approved in accordance with Section 34 of the Financial Administration Act (FAA) and in accordance with the employee's applicable collective agreement. Once the employee has completed the Form DND 907, and it has been authorized accordingly, the original is forwarded to the compensation advisor responsible for the employee's pay, and the copy of Form DND 907 remains with the employee.");
    //articleText.push("<*Article_H1*>Emergency Salary Advance<*Article_H2*>Employee<*Article_Body*>If you require an Emergency Salary Advance (ESA): Tell your manager.<*Article_H2*>Section 34 Manager<*Article_Body*>When an employee requires an ESA: Submit Pay Action Request Form (PAR) with a request for Emergency Salary Advance to the Pay Centre via Trusted Source.<*Article_H2*>Phoenix Emergency Salary Advance Recoveries<*Article_Body*>When you received your ESA, you were informed that: <*Article_List*>1. The amount you received would be recovered after your pay issues were resolved (once you had received the full amount owed and a regular paycheck every two weeks); and <*Article_List*>2. The recovery period would be processed in the same length of time as you received your advances (for example, if you received two ESAs, the recovery of the full amount would be spread over two pay periods).<*Article_Body*>Please contact the Pay Centre if you have questions about this process.  As PSPC continues to eliminate the backlog and move towards a steady state, employees are now seeing their outstanding pay issues resolved and are in receipt of the full amounts owed to them.<*Article_Body*>Where possible, it is PSPC’s intent to process the ESA recoveries at the same time as your case is resolved. For some employees, pay issues may have been a resolved for a number of weeks prior to the ESA recovery.<*Article_Note*>If you haven’t been contacted regarding your ESA within 48 hours of your request, please contact the National Civilian Compensation Support Unit at: ++Civilian Compensation.");
    
    return articleText;
}
var createMainGrid = function()
{
    var gridLayout = new layout.GridLayout();
    var button1 = new Button();
    var labelX = new Label();

    //button1.text = "hello";
    //labelX.text = "ohai";

    layout.GridLayout.setRow(createArticle(), 0);
    layout.GridLayout.setRow(createFooterNav(), 1);
    gridLayout.addChild(createArticle());
    gridLayout.addChild(createFooterNav());

    var contentRow = new layout.ItemSpec(1, layout.GridUnitType.STAR);
    var footerRow = new layout.ItemSpec(60, layout.GridUnitType.PIXEL);
    
    gridLayout.addRow(contentRow);
    gridLayout.addRow(footerRow);

    return gridLayout;
}
var createArticle = function()
{
    //<label class="HeaderLabel" text="Home > Compensation"/>
    
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
    //var articleText = "<*Article_H1*>Overtime<*Article_Body*>Overtime refers to compensation for authorized work performed in excess of the standard daily or weekly hours of work, or on the normal days of rest an employee may be entitled to, pursuant to the provisions of the relevant collective agreement or terms and conditions of employment.<*Article_H2*>Claiming Overtime<*Article_Body*>Instruct your employee to complete the Extra Duty Pay and Shiftwork Report (Form DND 907). To learn how to complete this form, the manager's instructions are found on page 2.<*Article_Note*>Note that certain employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee.<*Article_H2*>Process Overview: Overtime Approval<*Article_Body*>Overtime must be authorized in advance and approved in accordance with Section 34 of the Financial Administration Act (FAA) and in accordance with the employee's applicable collective agreement. Once the employee has completed the Form DND 907, and it has been authorized accordingly, the original is forwarded to the compensation advisor responsible for the employee's pay, and the copy of Form DND 907 remains with the employee.";
    //var articleText = "<*Article_H1*>Emergency Salary Advance<*Article_H2*>Employee<*Article_Body*>If you require an Emergency Salary Advance (ESA): Tell your manager.<*Article_H2*>Section 34 Manager<*Article_Body*>When an employee requires an ESA: Submit Pay Action Request Form (PAR) with a request for Emergency Salary Advance to the Pay Centre via Trusted Source.<*Article_H2*>Phoenix Emergency Salary Advance Recoveries<*Article_Body*>When you received your ESA, you were informed that: <*Article_List*>1. The amount you received would be recovered after your pay issues were resolved (once you had received the full amount owed and a regular paycheck every two weeks); and <*Article_List*>2. The recovery period would be processed in the same length of time as you received your advances (for example, if you received two ESAs, the recovery of the full amount would be spread over two pay periods).<*Article_Body*>Please contact the Pay Centre if you have questions about this process.  As PSPC continues to eliminate the backlog and move towards a steady state, employees are now seeing their outstanding pay issues resolved and are in receipt of the full amounts owed to them.<*Article_Body*>Where possible, it is PSPC’s intent to process the ESA recoveries at the same time as your case is resolved. For some employees, pay issues may have been a resolved for a number of weeks prior to the ESA recovery.<*Article_Note*>If you haven’t been contacted regarding your ESA within 48 hours of your request, please contact the National Civilian Compensation Support Unit at: ++Civilian Compensation.";
    var articleItemSplit;

    var articleComponents = curArticleText.split("<*");

    for (z=0; z<articleComponents.length; z++){
        articleItemSplit = articleComponents[z].split("*>");
        LabelArray.push(new Label());
        LabelArray[z].className = articleItemSplit[0];
        LabelArray[z].text = articleItemSplit[1];
    }

    for (i=0; i< LabelArray.length; i++)
    {
        articleStack.addChild(LabelArray[i]);
    }
    contentStack.addChild(headerLabel);
    contentStack.addChild(articleStack);
    myScroller.content = contentStack;

    return myScroller;
}
var createFooterNav = function()
{
    const footerStack = new StackLayout();
    // Set the orientation property
    footerStack.orientation = "horizontal";
    footerStack.row = 1;
    footerStack.className = "FooterNav";
    // >> (hide)
    const fNav1 = new Button();
    fNav1.className = "Footer_NavIcon";
    fNav1.text = String.fromCharCode(0xe902);
    fNav1.width = "20%";
    fNav1.on(Button.tapEvent, goToHome, this);
    // << (hide)
    const fNav2 = new Button();
    fNav2.className = "Footer_NavIcon";
    fNav2.text = String.fromCharCode(0xe904);
    fNav2.width = "20%";
    fNav2.tap = "goToHome";

    const fNav3 = new Button();
    fNav3.className = "Footer_NavIcon";
    fNav3.text = String.fromCharCode(0xe994);
    fNav3.width = "20%";
    fNav3.tap = "goToHome";

    const fNav4 = new Button();
    fNav4.className = "Footer_NavIcon";
    fNav4.text = String.fromCharCode(0xe945);
    fNav4.width = "20%";
    fNav4.tap = "goToHome";

    const fNav5 = new Button();
    fNav5.className = "Footer_NavIcon";
    fNav5.text = String.fromCharCode(0xe953);
    fNav5.width = "20%";
    fNav5.tap = "goToHome";

    // Add views to stack layout
    footerStack.addChild(fNav1);
    footerStack.addChild(fNav2);
    footerStack.addChild(fNav3);
    footerStack.addChild(fNav4);
    footerStack.addChild(fNav5);
    // << stack-layout-code-behind

    return footerStack;
}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    /* returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Your Pay Information", Title:"Overtime", Type:"Article", Content:"<*Article_H1*>Overtime<*Article_Body*>Overtime refers to compensation for authorized work performed in excess of the standard daily or weekly hours of work, or on the normal days of rest an employee may be entitled to, pursuant to the provisions of the relevant collective agreement or terms and conditions of employment.<*Article_H2*>Claiming Overtime<*Article_Body*>Instruct your employee to complete the Extra Duty Pay and Shiftwork Report (Form DND 907). To learn how to complete this form, the manager's instructions are found on page 2.<*Article_Note*>Note that certain employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee.<*Article_H2*>Process Overview: Overtime Approval<*Article_Body*>Overtime must be authorized in advance and approved in accordance with Section 34 of the Financial Administration Act (FAA) and in accordance with the employee's applicable collective agreement. Once the employee has completed the Form DND 907, and it has been authorized accordingly, the original is forwarded to the compensation advisor responsible for the employee's pay, and the copy of Form DND 907 remains with the employee."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"2", BusinessLine:"Pay", Category:"Your Pay Information", Title:"Acting Pay", Type:"Article", Content:"<*Article_H1*>Acting Pay<*Article_Body*>Acting pay refers to the pay an employee receives when required to substantially perform the duties of a higher classification level, provided the employee meets the minimum qualifying period specified in the relevant collective agreement, or terms and conditions of employment applicable to the employee's substantive level.<*Article_Note*>Requests for acting pay are to be submitted via your e-Staffing team."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", BusinessLine:"Pay", Category:"Your Pay Information", Title:"Part-time Employment", Type:"Article", Content:"<*Article_H1*>Part-time Employment<*Article_H2*>Change in Hours of Work<*Article_Body*>Part-time employment is the situation whereby a person is ordinarily required to work more than one third of but less than the normal scheduled daily or weekly hours of work established for persons doing similar work.<*Article_H2*>Getting Approval for Change in Hours<*Article_Body*>An employee’s request to change their hours of work from full-time to part-time must be made to the manager in writing and submitted to the manager for approval.<*Article_Body*>The request and approval must include:<*Article_List*>the effective date of the commencement and end date (as applicable) of part-time hours<*Article_List*>the total number of hours per week<*Article_List*>the specific days the employee will be working<*Article_List*>the total number of hours per day<*Article_Body*>The request and approval must be forwarded to the responsible compensation service centre to implement the changes which will affect your leave entitlements, benefits, and deductions.<*Article_H2*>Designated Holidays<*Article_Body*>Part-time employees are not paid for designated holidays. Some collective agreement provide for a premium in lieu. To find out more, consult your collective agreement or relevant Terms and Conditions of Employment.<*Article_H2*>Considering Operational Requirements<*Article_Body*>As you are aware, part-time employment is one of the many alternate working arrangements which are encouraged as a means of satisfying the various needs of employees and managers. However, operational requirements must be considered a prime factor in the decision. There are two scenarios to consider:<*Article_List*>a temporary period<*Article_List*>a permanent basis<*Article_H2*>Consulting the Collective Agreement<*Article_Body*>Most collective agreements contain a separate section for Part-time Employees.<*Article_H2*>Overtime<*Article_Body*>When part-time employees work overtime, they are paid at straight-time until they have worked their standard daily hours of work or their standard weekly hours of work.<*Article_Body*>To learn more about other types of part-time employment, refer to the appendix and definitions of Treasury Board's Directive on Terms and Conditions of Employment."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"4", BusinessLine:"Pay", Category:"Problems With Your Pay", Title:"Emergency Salary Advance", Type:"Article", Content:"<*Article_H1*>Emergency Salary Advance<*Article_H2*>Employee<*Article_Body*>If you require an Emergency Salary Advance (ESA): Tell your manager.<*Article_H2*>Section 34 Manager<*Article_Body*>When an employee requires an ESA: Submit Pay Action Request Form (PAR) with a request for Emergency Salary Advance to the Pay Centre via Trusted Source.<*Article_H2*>Phoenix Emergency Salary Advance Recoveries<*Article_Body*>When you received your ESA, you were informed that: <*Article_List*>1. The amount you received would be recovered after your pay issues were resolved (once you had received the full amount owed and a regular paycheck every two weeks); and <*Article_List*>2. The recovery period would be processed in the same length of time as you received your advances (for example, if you received two ESAs, the recovery of the full amount would be spread over two pay periods).<*Article_Body*>Please contact the Pay Centre if you have questions about this process. As PSPC continues to eliminate the backlog and move towards a steady state, employees are now seeing their outstanding pay issues resolved and are in receipt of the full amounts owed to them.<*Article_Body*>Where possible, it is PSPC’s intent to process the ESA recoveries at the same time as your case is resolved. For some employees, pay issues may have been a resolved for a number of weeks prior to the ESA recovery.<*Article_Note*>If you haven’t been contacted regarding your ESA within 48 hours of your request, please contact the National Civilian Compensation Support Unit at: ++Civilian Compensation."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"5", BusinessLine:"Pay", Category:"Problems With Your Pay", Title:"Report Your Pay Issue", Type:"Article", Content:"<*Article_H1*>Report Problems With Your Pay<*Article_H2*>Escalation Process<*Article_Note*>Are emergency funds needed by the employee?  If yes, request salary advance<*Article_Body*>If you are experiencing a problem with your pay, follow the steps below.<*Article_H3*>Step 1<*Article_List*>Speak to your manager about your pay issue.<*Article_List*>Ensure all required documentation (including staffing and classification) to support your request has been submitted by your manager.<*Article_List*>Submit your request to the Pay Centre for processing, using either the Phoenix Feedback Form or the Pay Action Request Form (PAR) via your Trusted Source.<*Article_Note*>Make sure you understand when to use a Phoenix Feedback Form vs a Pay Action Request Form. Submitting the wrong form will result in it being rejected by the Pay Centre and delay the processing of your request.<*Article_H3*>Step 2<*Article_List*>If your case is not resolved within 21 days, contact the National Civilian Compensation Support Unit.<*Article_List*>All cases will be escalated by priority and the Compensation Unit will work with the Pay Centre to resolve your case.<*Article_Body*>Cases will be dealt with in the priorities outlined below:<*Article_List*>Priority 1: employees not receiving basic pay and benefits (including students and casuals), death in service, LWOP (Disability), Maternity and Paternity leave top up, terminations, record of employment, transfers in and out, labour relations and any other no basic pay situations.<*Article_List*>Priority 2: employees with pay at risk of disruption, including salary above the minimum, overpayment disputes, leave with income averaging, pre-retirement transition leave and any priority 3 case greater than 18 months.<*Article_List*>Priority 3: actings, promotions, increments, pension 35 years of service and ex-military leave.<*Article_H3*>Step 3<*Article_List*>Once your email is received, a Compensation Advisor will follow up with you to gather more information about your pay issue and work towards resolving your issue."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"6", BusinessLine:"Pay", Category:"Problems With Your Pay", Title:"Priority Payment on Non-Basic Pay", Type:"Article", Content:"<*Article_H1*>Priority Payment on Non-Basic Pay<*Article_Body*>If you are missing non-basic pay, such as an acting, overtime pay or promotion, speak to your manager about obtaining a priority payment.<*Article_Note*>Anyone experiencing regular pay issues should continue to use the normal Emergency Salary Advance (ESA) process. <*Article_Body*>Priority Payment on Non-Basic Pay is a department specific initiative and is meant to ease financial hardship as a result of outstanding or incomplete pay actions, including:<*Article_List*>1. Incorrect salary calculations due to promotion;<*Article_List*>2. Incorrect salary increments;<*Article_List*>3. Substantial overtime pay outstanding; and<*Article_List*>4. Other entitlements<*Article_Note*>Please note, only 66% of approved gross amounts will be paid.<*Article_H2*>How to Submit a Request<*Article_List*>Employees: Learn how to submit a request and your roles and responsibilities.<*Article_List*>S34 Managers: Learn more about your roles and responsibilities throughout the process."};
    contentData.push(returnedItem); */
returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Your Pay Information", Title:"Pay Basics", Type:"Article", Content:"<*Article_H1*>Your Pay Information<*Article_Body*>The Public Service Pay Centre is responsible for all pay and benefits services. For general questions about your pay, contact the Client Contact Centre.<*Article_H1*>Pay Basics<*Article_Body*>Learn more about Pay for the Public Service, including How Public Services Pay Works, Collective Agreements and rates of pay for federal employees. <*Article_Body*>Visit PSPC’s Pay and Changes in Your Life page for information about taking leave, updating marital or employment status, changing personal information, becoming a parent, and other life events.<*Article_H1*>Managing Employee Schedules<*Article_Body*>As a Section 34 manager, you must ensure that employee work schedules are correctly entered into the Phoenix pay system. <*Article_Body*>Work schedules vary from person to person and in the case of part-time employees, individual schedules can change from one term to the next. <*Article_Body*>Failure to properly manage and maintain employee schedules will result in inaccurate self-service results, which could impact employee payments.<*Article_Body*>Visit GCpedia for more information on entering or deleting  employee schedules.<*Article_Body*>For assistance with entering schedules, section 34 managers can contact a timekeeper."};
contentData.push(returnedItem);
returnedItem = {Ref:"2", BusinessLine:"Pay", Category:"Your Pay Information", Title:"View and Understand Your Pay", Type:"Article", Content:"<*Article_H1*>View and Understand Your Pay<*Article_Body*>Access the Phoenix Pay System to:<*Article_List*>View your paystubs and tax slips<*Article_List*>use pension or tax calculators<*Article_List*>update your pesronal inforamtion <*Article_Body*>You will need a MyKey or a department-issued Smartcard/PKI to log in. <*Article_Body*>For a detailed explanation of your pay stub, visit Public Services and Procurement Canada’s How to Read Your Pay Stub webpage."};
contentData.push(returnedItem);
returnedItem = {Ref:"3", BusinessLine:"Pay", Category:"Problems with your Pay", Title:"Reporting your Pay Issue", Type:"Article", Content:"<*Article_H1*>Problems with Your Pay<*Article_Body*>If you require emergency funds request a salary advance*** Report your pay issue by following these three steps.<*Article_H2*>Step 1<*Article_List*>Speak to your manager about your pay issue.<*Article_List*>Ensure all required documentation (including staffing and classification) to support your request has been submitted by your manager.<*Article_List*>Submit your request through the Human Resource Services and Support (HRSS) tool by selecting either Report Pay Issue Step 1: Submit a Phoenix Feedback Form or Submit Pay Action <*Article_H2*>Step 2 <*Article_List*>If your case is not resolved within 21 days, please proceed to Reporting Pay Issue: Step 2: Escalate your Pay issue in the Human Resource Services and Support (HRSS) tool. <*Article_List*>The Compensation Unit will work with the Pay Centre to resolve your case. All cases are escalated by priority and are prioritized as outlined below:<*Article_List*>Priority 1: employees not receiving basic pay and benefits (including students and casuals), death in service, LWOP (Disability), Maternity and Paternity leave top up, terminations, record of employment, transfers in and out, labour relations and any other no basic pay situations.<*Article_List*>Priority 2: employees with pay at risk of disruption, including salary above the minimum, overpayment disputes, leave with income averaging, pre-retirement transition leave and any priority 3 case greater than 18 months.<*Article_List*>Priority 3: actings, promotions, increments, pension 35 years of service and ex-military leave.<*Article_H2*>Step 3<*Article_List*>A compensation advisor will follow up with you to gather more information about your pay issue and work towards resolving your issue. "};
contentData.push(returnedItem);
returnedItem = {Ref:"4", BusinessLine:"Pay", Category:"Problems with your Pay", Title:"Emergency Salary Advance", Type:"Article", Content:"<*Article_H1*>Emergency Salary Advance<*Article_Body*>If you require an Emergency Salary Advance (ESA), inform your manager. When an employee requires an ESA, submit a request through the Human Resource Services and Support (HRSS) tool under the Pay Action Request (PAR) option.<*Article_Body*>Unless employees choose to pay the amounts owing right away, recoveries of these amount will only start when:<*Article_Note*>All monies owed to the employee have been paid<*Article_Note*>The employee had received three consecutive correct pay cheques<*Article_Note*>A recovery agreement has been established<*Article_Note*>Please contact the Pay Centre if you have questions about this process."};
contentData.push(returnedItem);
returnedItem = {Ref:"5", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"Employee Roles in Pay", Type:"Article", Content:"<*Article_H1*>Employee Roles in Pay<*Article_List*>Ensure that you have correctly selected your Section 34 Manager in Phoenix Self-Service. <*Article_List*>If you are in an acting position you must select your Section 34 Manager for that record (even if they have not changed). Acting appointments create a new employee record and information is not copied from your substantive position.<*Article_List*>Inform your manager of your schedule if you do not work a regular Monday to Friday work schedule.<*Article_List*>Advise your manager of correct time and Leave Without Pay (LWOP) if you do not have access to Employee Self-Service in Phoenix.<*Article_List*>Enter overtime and leave requests within the identified cut-off periods. Inform your manager each time you submit a request. Managers are not automatically notified there is a request pending their approval."};
contentData.push(returnedItem);
returnedItem = {Ref:"6", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"Section 34 Manager Roles in Pay", Type:"Article", Content:"<*Article_H1*>Section 34 Manager Roles<*Article_List*>Ensure your employees have selected you as their Section 34 Manager in Phoenix Self-service.<*Article_List*>Enter and Review schedules for employees who do not work a regular work schedule and action any outstanding requests weekly.<*Article_List*>Ensure your employees input basic pay for ‘when and as required employees’, overtime and Leave Without Pay (LWOP) transactions for 5 days or less in Phoenix Self-Service within the pay period in which they incurred (no later than Thursday of pay week).<*Article_List*>Review and action pay requests in Phoenix Self-Service every week (Phoenix DOES NOT automatically notify you that there is a new request). <*Article_List*>If you are unsure of a transaction, call S. 34 Manager Support: 1-833-747-6363.<*Article_List*>Action Leave requests in HRMS/Peoplesoft.<*Article_H3*>Military Managers<*Article_Body*>Provide the departmental timekeeper with documentation to ensure employee schedules, timesheets for basic pay for ‘when and as required employees’, overtime and LWOP of 5 days or less is completed in Phoenix Self-Service on your behalf."};
contentData.push(returnedItem);
returnedItem = {Ref:"7", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"Section 34 Self-Service Pay Requests", Type:"Article", Content:"<*Article_H1*>Section 34 Phoenix Self-Service Pay Requests  <*Article_Body*>Section 34 Managers must review and action pay transactions in Phoenix Self-Service every week to prevent pay issues. Delayed approvals result in late payments and will sometimes trigger additional problems in Phoenix.<*Article_Body*>Follow these steps to ensure your employees are paid accurately and on time:<*Article_List*>Ensure your employees have selected you as their Section 34 Manager in Phoenix Self-Service.<*Article_List*>Review and action your employees’ pay requests every week within Phoenix Self-Service. Managers must action all pay requests by Friday of each week (or Thursday if the Friday falls on a statutory holiday). <*Article_List*>Phoenix does not automatically notify you that a transaction was submitted. Ask your employees to let you know each time they submit a request. Tip: Set a recurring weekly calendar reminder to check for pending requests. <*Article_List*>For detailed instructions on how to access and approve transactions, please read the How to Approve Payable Time Training Aid. <*Article_List*>If you are unsure of how to proceed with a transaction, call S. 34 Manager Support at 1-833-747-6363 to help you through the process.<*Article_Note*>Note: if transactions are not entered and/or approved within 6 months of its occurrence, the transaction cannot be processed through Phoenix and the Section 34 manager will have to submit a PAR for processing through the Human Resources Services and Support."};
contentData.push(returnedItem);
returnedItem = {Ref:"8", BusinessLine:"Pay", Category:"Pay Deadlines and Processes", Title:"HR/Staffing Action Affecting Pay", Type:"Article", Content:"<*Article_H1*>HR/Staffing Transactions Affecting Pay<*Article_Body*>Managers must follow the timelines below when submitting HR staffing transactions:  <*Article_List*>Return the completed letter of offer package (including the signed letter of offer and all pay related documents) to the staffing contact indicated in the letter of offer 15 working days prior to the start date.<*Article_List*>Sub-delegated managers and employees must approve HR Requests in HRMS 15 working days prior to the effective date.<*Article_List*>Submit pay action requests (PARs) for employees starting or returning from leave without pay through the Human Resource Services and Support (HRSS) before they leave or as soon as they return to the workplace so that their pay can be immediately started or stopped."};
contentData.push(returnedItem);
returnedItem = {Ref:"9", BusinessLine:"Pay", Category:"Hours and Scheduling", Title:"Overtime", Type:"Article", Content:"<*Article_H1*>Overtime<*Article_Body*>Overtime is the compensation for authorized work performed in addition to standard daily or weekly hours of work or on usual days of rest as described in the provisions of the relevant collective agreement or terms and conditions of employment<*Article_Body*>Overtime must be authorized in advance and approved in agreement to Section 34 of the Financial Administration Act (FAA) and the employee's relevant collective agreement.<*Article_Body*>Note:  Employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee. <*Article_H2*>Compensation in Leave (Compensatory Time-Off)<*Article_Body*>To request compensation for overtime through leave (Compensatory Time Off), follow these steps:<*Article_List*>Complete form “DND 907” from the Defence Forms Catalogue <*Article_List*>Submit the form to your section 34  manager for approval and signature<*Article_List*>Once it is received, the section 34 manager submits the form through the  Human Resources Services and Support (HRSS) tool. Under the Other Requests tab, select Extra Duty Pay in Compensatory Time.<*Article_H2*>Compensation in Cash<*Article_Body*>To be compensated for overtime in cash, employees should follow this process:<*Article_H3*>Employees reporting to section 34 civilian managers:<*Article_List*>All overtime hours must be submitted by, or on behalf of the employee directly in Phoenix. <*Article_List*>Section 34 managers must complete the approval no later than 2:00 pm EST on the Monday of a non-pay week.<*Article_List*>Employees must ensure their data entry is entered into Phoenix no later than 8:30pm EST on the Sunday of the pay week.  <*Article_H3*>Employees reporting to military managers:<*Article_List*>Complete form “DND 907” in the Defence Forms Catalogue.  <*Article_List*>Submit to your section 34 manager for approval and signature<*Article_List*>Once approved, submit it through the Human Resources Services and Support (HRSS) tool for processing either bi-weekly or monthly<*Article_List*>Under the “Access Timekeepers” tab, select “Extra Duty Pay in Cash.”<*Article_H3*>Section 34 Managers<*Article_List*>Employees must submit their overtime hours directly in Phoenix no later than 8:30 pm on the Sunday of pay week. <*Article_List*>Section 34 managers must complete the approval no later than 2:00 pm EST on the following Monday of the non-pay week, to ensure payment will be processed on time.  <*Article_H1*>Section 34 military managers<*Article_List*>Section 34 military managers are to approve and sign the form “DND 907”in the Defence Forms Catalogue <*Article_List*>Once approved, Section 34 military managers must submit on a bi-weekly or monthly basis through the Human Resources Services and Support (HRSS) tool for processing<*Article_List*>Under the “Access Timekeepers” tab, select “Extra Duty Pay in Cash.”<*Article_Note*>Note: When a statutory holiday falls on the Friday or Monday where submissions or approvals would normally be due in Phoenix, the deadline will be earlier.<*Article_H1*>Managing Employee Schedules<*Article_Body*>As a Section 34 manager, you must ensure that employee work schedules are correctly entered into the Phoenix pay system. <*Article_Body*>Work schedules vary from person to person and in the case of part-time employees, individual schedules can change from one term to the next. <*Article_Body*>Failure to properly manage and maintain employee schedules will result in inaccurate self-service results, which could impact employee payments.<*Article_Body*>Visit GCpedia for more information on entering or deleting  employee schedules.<*Article_Body*>For assistance with entering schedules, section 34 managers can contact a timekeeper."};
contentData.push(returnedItem);
returnedItem = {Ref:"10", BusinessLine:"Pay", Category:"Hours and Scheduling", Title:"Managing Employee Schedules", Type:"Article", Content:"<*Article_H1*>Managing Employee Schedules<*Article_Body*>As a Section 34 manager, you must ensure that employee work schedules are correctly entered into the Phoenix pay system. <*Article_Body*>Work schedules vary from person to person and in the case of part-time employees, individual schedules can change from one term to the next. <*Article_Body*>Failure to properly manage and maintain employee schedules will result in inaccurate self-service results, which could impact employee payments.<*Article_Body*>Visit GCpedia for more information on entering or deleting  employee schedules.<*Article_Body*>For assistance with entering schedules, section 34 managers can contact a timekeeper.<*Article_H1*>Managing Employee Schedules<*Article_Body*>As a Section 34 manager, you must ensure that employee work schedules are correctly entered into the Phoenix pay system. <*Article_Body*>Work schedules vary from person to person and in the case of part-time employees, individual schedules can change from one term to the next. <*Article_Body*>Failure to properly manage and maintain employee schedules will result in inaccurate self-service results, which could impact employee payments.<*Article_Body*>Visit GCpedia for more information on entering or deleting  employee schedules.<*Article_Body*>For assistance with entering schedules, section 34 managers can contact a timekeeper."};


    return contentData;
}
