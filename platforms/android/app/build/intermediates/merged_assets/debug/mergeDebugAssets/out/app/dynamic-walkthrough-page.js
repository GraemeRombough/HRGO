var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const Image = require("tns-core-modules/ui/image/").Image;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
var gestures = require("tns-core-modules/ui/gestures");
const pageData = new observable.Observable();
var pageObject;
var walkthroughSlides;
var stepNumber = 1;
var maxSteps = 0;

exports.pageLoaded = function(args) {
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    walkthroughSlides = getSlides();
    setSlide(stepNumber - 1);

    
    
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");  
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
exports.previousSlide = function(){
    if(stepNumber > 1){
        stepNumber--;
        setSlide(stepNumber - 1);
    }
}
exports.nextSlide = function(){
    if(stepNumber < maxSteps){
        stepNumber++;
        setSlide(stepNumber - 1);
    }
    
}
exports.swipeGestureSwitch = function(args){
    //1 is back a step, 2 is forward
    if(args.direction == 1){
        exports.previousSlide();
    }else if(args.direction == 2){
        exports.nextSlide();
    } 
}
var getSlides = function(){
    var allSlides = [];
    var dbReturn = getFromDatabase(7);
    pageData.set("walkthroughTitle", dbReturn[0].Title);
    var splitStepsTitle = dbReturn[0].Content.split("<*Step_Title*>");
    console.log(splitStepsTitle[1]);
    for(i=1; i<splitStepsTitle.length; i++){
        //Sample = <*Step_Title*>xxx<*Step_Image*>yyy.jpg<*Step_Desc*>zzz
        var stepTitle = new Label;
        stepTitle.text = splitStepsTitle[i].split("<*")[0];
        stepTitle.className = "Article_H1";
        var stepImage = new Image;
        stepImage.src = splitStepsTitle[i].split("<*Step_Image*>")[1].split("<*")[0];
        console.log(splitStepsTitle[i].split("<*Step_Image*>")[1].split("<*")[0]);
        stepImage.stretch = "aspectFill";
        stepImage.className = "Walkthrough_Image"; 
        var stepDesc = new Label;
        stepDesc.text = splitStepsTitle[i].split("<*Step_Desc*>")[1];
        stepDesc.className = "Article_Body";
        var stepSlide = {Title:stepTitle, Image:stepImage, Desc:stepDesc};
        allSlides.push(stepSlide);
    }

    maxSteps = allSlides.length;
    return allSlides;
    
}
var setSlide = function(slideID){ 
    
    var displaySlide = pageObject.getViewById("stepContent");
    displaySlide.removeChildren();
    displaySlide.addChild(walkthroughSlides[slideID].Title);
    displaySlide.addChild(walkthroughSlides[slideID].Image);
    displaySlide.addChild(walkthroughSlides[slideID].Desc);

    pageData.set("stepNavText", walkthroughSlides[slideID].Title.text);
}


var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    /* returnedItem = {Ref:"1", BusinessLine:"Compensation", Category:"Your Pay Information", Title:"Overtime", Type:"Article", Content:"<*Article_H1*>Overtime<*Article_Body*>Overtime refers to compensation for authorized work performed in excess of the standard daily or weekly hours of work, or on the normal days of rest an employee may be entitled to, pursuant to the provisions of the relevant collective agreement or terms and conditions of employment.<*Article_H2*>Claiming Overtime<*Article_Body*>Instruct your employee to complete the Extra Duty Pay and Shiftwork Report (Form DND 907). To learn how to complete this form, the manager's instructions are found on page 2.<*Article_Note*>Note that certain employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee.<*Article_H2*>Process Overview: Overtime Approval<*Article_Body*>Overtime must be authorized in advance and approved in accordance with Section 34 of the Financial Administration Act (FAA) and in accordance with the employee's applicable collective agreement. Once the employee has completed the Form DND 907, and it has been authorized accordingly, the original is forwarded to the compensation advisor responsible for the employee's pay, and the copy of Form DND 907 remains with the employee."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"2", BusinessLine:"Compensation", Category:"Your Pay Information", Title:"Acting Pay", Type:"Article", Content:"<*Article_H1*>Acting Pay<*Article_Body*>Acting pay refers to the pay an employee receives when required to substantially perform the duties of a higher classification level, provided the employee meets the minimum qualifying period specified in the relevant collective agreement, or terms and conditions of employment applicable to the employee's substantive level.<*Article_Note*>Requests for acting pay are to be submitted via your e-Staffing team."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", BusinessLine:"Compensation", Category:"Your Pay Information", Title:"Part-time Employment", Type:"Article", Content:"<*Article_H1*>Part-time Employment<*Article_H2*>Change in Hours of Work<*Article_Body*>Part-time employment is the situation whereby a person is ordinarily required to work more than one third of but less than the normal scheduled daily or weekly hours of work established for persons doing similar work.<*Article_H2*>Getting Approval for Change in Hours<*Article_Body*>An employee’s request to change their hours of work from full-time to part-time must be made to the manager in writing and submitted to the manager for approval.<*Article_Body*>The request and approval must include:<*Article_List*>the effective date of the commencement and end date (as applicable) of part-time hours<*Article_List*>the total number of hours per week<*Article_List*>the specific days the employee will be working<*Article_List*>the total number of hours per day<*Article_Body*>The request and approval must be forwarded to the responsible compensation service centre to implement the changes which will affect your leave entitlements, benefits, and deductions.<*Article_H2*>Designated Holidays<*Article_Body*>Part-time employees are not paid for designated holidays. Some collective agreement provide for a premium in lieu. To find out more, consult your collective agreement or relevant Terms and Conditions of Employment.<*Article_H2*>Considering Operational Requirements<*Article_Body*>As you are aware, part-time employment is one of the many alternate working arrangements which are encouraged as a means of satisfying the various needs of employees and managers. However, operational requirements must be considered a prime factor in the decision. There are two scenarios to consider:<*Article_List*>a temporary period<*Article_List*>a permanent basis<*Article_H2*>Consulting the Collective Agreement<*Article_Body*>Most collective agreements contain a separate section for Part-time Employees.<*Article_H2*>Overtime<*Article_Body*>When part-time employees work overtime, they are paid at straight-time until they have worked their standard daily hours of work or their standard weekly hours of work.<*Article_Body*>To learn more about other types of part-time employment, refer to the appendix and definitions of Treasury Board's Directive on Terms and Conditions of Employment."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"4", BusinessLine:"Compensation", Category:"Problems With Your Pay", Title:"Emergency Salary Advance", Type:"Article", Content:"<*Article_H1*>Emergency Salary Advance<*Article_H2*>Employee<*Article_Body*>If you require an Emergency Salary Advance (ESA): Tell your manager.<*Article_H2*>Section 34 Manager<*Article_Body*>When an employee requires an ESA: Submit Pay Action Request Form (PAR) with a request for Emergency Salary Advance to the Pay Centre via Trusted Source.<*Article_H2*>Phoenix Emergency Salary Advance Recoveries<*Article_Body*>When you received your ESA, you were informed that: <*Article_List*>1. The amount you received would be recovered after your pay issues were resolved (once you had received the full amount owed and a regular paycheck every two weeks); and <*Article_List*>2. The recovery period would be processed in the same length of time as you received your advances (for example, if you received two ESAs, the recovery of the full amount would be spread over two pay periods).<*Article_Body*>Please contact the Pay Centre if you have questions about this process. As PSPC continues to eliminate the backlog and move towards a steady state, employees are now seeing their outstanding pay issues resolved and are in receipt of the full amounts owed to them.<*Article_Body*>Where possible, it is PSPC’s intent to process the ESA recoveries at the same time as your case is resolved. For some employees, pay issues may have been a resolved for a number of weeks prior to the ESA recovery.<*Article_Note*>If you haven’t been contacted regarding your ESA within 48 hours of your request, please contact the National Civilian Compensation Support Unit at: ++Civilian Compensation."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"5", BusinessLine:"Compensation", Category:"Problems With Your Pay", Title:"Report Your Pay Issue", Type:"Article", Content:"<*Article_H1*>Report Problems With Your Pay<*Article_H2*>Escalation Process<*Article_Note*>Are emergency funds needed by the employee?  If yes, request salary advance<*Article_Body*>If you are experiencing a problem with your pay, follow the steps below.<*Article_H3*>Step 1<*Article_List*>Speak to your manager about your pay issue.<*Article_List*>Ensure all required documentation (including staffing and classification) to support your request has been submitted by your manager.<*Article_List*>Submit your request to the Pay Centre for processing, using either the Phoenix Feedback Form or the Pay Action Request Form (PAR) via your Trusted Source.<*Article_Note*>Make sure you understand when to use a Phoenix Feedback Form vs a Pay Action Request Form. Submitting the wrong form will result in it being rejected by the Pay Centre and delay the processing of your request.<*Article_H3*>Step 2<*Article_List*>If your case is not resolved within 21 days, contact the National Civilian Compensation Support Unit.<*Article_List*>All cases will be escalated by priority and the Compensation Unit will work with the Pay Centre to resolve your case.<*Article_Body*>Cases will be dealt with in the priorities outlined below:<*Article_List*>Priority 1: employees not receiving basic pay and benefits (including students and casuals), death in service, LWOP (Disability), Maternity and Paternity leave top up, terminations, record of employment, transfers in and out, labour relations and any other no basic pay situations.<*Article_List*>Priority 2: employees with pay at risk of disruption, including salary above the minimum, overpayment disputes, leave with income averaging, pre-retirement transition leave and any priority 3 case greater than 18 months.<*Article_List*>Priority 3: actings, promotions, increments, pension 35 years of service and ex-military leave.<*Article_H3*>Step 3<*Article_List*>Once your email is received, a Compensation Advisor will follow up with you to gather more information about your pay issue and work towards resolving your issue."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"6", BusinessLine:"Compensation", Category:"Problems With Your Pay", Title:"Priority Payment on Non-Basic Pay", Type:"Article", Content:"<*Article_H1*>Priority Payment on Non-Basic Pay<*Article_Body*>If you are missing non-basic pay, such as an acting, overtime pay or promotion, speak to your manager about obtaining a priority payment.<*Article_Note*>Anyone experiencing regular pay issues should continue to use the normal Emergency Salary Advance (ESA) process. <*Article_Body*>Priority Payment on Non-Basic Pay is a department specific initiative and is meant to ease financial hardship as a result of outstanding or incomplete pay actions, including:<*Article_List*>1. Incorrect salary calculations due to promotion;<*Article_List*>2. Incorrect salary increments;<*Article_List*>3. Substantial overtime pay outstanding; and<*Article_List*>4. Other entitlements<*Article_Note*>Please note, only 66% of approved gross amounts will be paid.<*Article_H2*>How to Submit a Request<*Article_List*>Employees: Learn how to submit a request and your roles and responsibilities.<*Article_List*>S34 Managers: Learn more about your roles and responsibilities throughout the process."};
    contentData.push(returnedItem); */
    returnedItem = {Ref:"7", BusinessLine:"Compensation", Category:"Your Pay Information", Title:"Entering Overtime", Type:"Walkthrough", Content:"<*Step_Title*>Step 1<*Step_Image*>~/images/1_001.jpg<*Step_Desc*>Using the menu at the top of the pay system, select Self Service > Time Reporting > Report Time > Timesheet.<*Step_Title*>Step 2<*Step_Image*>~/images/1_002.jpg<*Step_Desc*>Enter the time worked into the calendar.<*Step_Title*>Step 3<*Step_Image*>~/images/1_003.jpg<*Step_Desc*>Select the Time Reporting Code for Overtime."};
    contentData.push(returnedItem);
    return contentData;
}
var getWalkthroughText = function(aID, aLang)
{
    //.findIndex(value)
    var walkthroughs = getFromDatabase();
    var walkthroughText;
    for (i = 0; i < walkthroughs.length; i++){
        if(walkthroughs[i].Ref == aID){
            walkthroughsText = walkthroughs[i].Content;
            break;
        }
    }

    walkthroughText = "<*Step_Title*>Step 1<*Step_Image*>1_001<*Step_Desc*>Using the menu at the top of the pay system, select Self Service > Time Reporting > Report Time > Timesheet.<*Step_Title*>Step 2<*Step_Image*>1_002<*Step_Desc*>Enter the time worked into the calendar.<*Step_Title*>Step 3<*Step_Image*>1_003<*Step_Desc*>Select the Time Reporting Code for Overtime.";
    //articleText.push("<*Article_H1*>Overtime<*Article_Body*>Overtime refers to compensation for authorized work performed in excess of the standard daily or weekly hours of work, or on the normal days of rest an employee may be entitled to, pursuant to the provisions of the relevant collective agreement or terms and conditions of employment.<*Article_H2*>Claiming Overtime<*Article_Body*>Instruct your employee to complete the Extra Duty Pay and Shiftwork Report (Form DND 907). To learn how to complete this form, the manager's instructions are found on page 2.<*Article_Note*>Note that certain employees in excluded/ unrepresented positions are not entitled to overtime. In lieu, they may be eligible for management leave. Refer to the Appendix of the Directive on Terms and Conditions of Employment for more information on who is considered an Excluded/Unrepresented Employee.<*Article_H2*>Process Overview: Overtime Approval<*Article_Body*>Overtime must be authorized in advance and approved in accordance with Section 34 of the Financial Administration Act (FAA) and in accordance with the employee's applicable collective agreement. Once the employee has completed the Form DND 907, and it has been authorized accordingly, the original is forwarded to the compensation advisor responsible for the employee's pay, and the copy of Form DND 907 remains with the employee.");
    //articleText.push("<*Article_H1*>Emergency Salary Advance<*Article_H2*>Employee<*Article_Body*>If you require an Emergency Salary Advance (ESA): Tell your manager.<*Article_H2*>Section 34 Manager<*Article_Body*>When an employee requires an ESA: Submit Pay Action Request Form (PAR) with a request for Emergency Salary Advance to the Pay Centre via Trusted Source.<*Article_H2*>Phoenix Emergency Salary Advance Recoveries<*Article_Body*>When you received your ESA, you were informed that: <*Article_List*>1. The amount you received would be recovered after your pay issues were resolved (once you had received the full amount owed and a regular paycheck every two weeks); and <*Article_List*>2. The recovery period would be processed in the same length of time as you received your advances (for example, if you received two ESAs, the recovery of the full amount would be spread over two pay periods).<*Article_Body*>Please contact the Pay Centre if you have questions about this process.  As PSPC continues to eliminate the backlog and move towards a steady state, employees are now seeing their outstanding pay issues resolved and are in receipt of the full amounts owed to them.<*Article_Body*>Where possible, it is PSPC’s intent to process the ESA recoveries at the same time as your case is resolved. For some employees, pay issues may have been a resolved for a number of weeks prior to the ESA recovery.<*Article_Note*>If you haven’t been contacted regarding your ESA within 48 hours of your request, please contact the National Civilian Compensation Support Unit at: ++Civilian Compensation.");
    console.log("walkthroughText: " + walkthroughText);
    return walkthroughText;
}