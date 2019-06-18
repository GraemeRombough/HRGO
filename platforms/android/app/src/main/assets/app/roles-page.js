var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var buttonModule = require("ui/button");
const Button = require("tns-core-modules/ui/button/").Button;
var pageData = new observable.Observable();
var selectedProcess, selectedRole;
var pageObject;
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
const fromObject = require("tns-core-modules/data/observable").fromObject;
var pageVM;
const Label = require("tns-core-modules/ui/label/").Label;
var subNavTitle = "YourPayInformation";

exports.onNavigatingTo = function(args){
    const page = args.object;
    pageObject = page;
    page.bindingContext = pageData;
    loadProcesses();
}
exports.pageLoaded = function(args) {
    
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log(subNavTitle);
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
function loadRoles(args){
    //<Button text="Employee" class="Main_Nav_SubLine" tap="loadResponsibilities"/>
    var dbReturn = getFromDataBase();
    var relatedRoles = [];
    selectedProcess = args.object.text;
    console.log(selectedProcess);
    for (i=0; i < dbReturn.length; i++){
        if (dbReturn[i].process == selectedProcess){
            relatedRoles.push(dbReturn[i]);
        }
    }
    console.log(relatedRoles.length);
    var rolesStack = pageObject.getViewById("rolesLayout");
    rolesStack.removeChildren();
    for(z=0; z<relatedRoles.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = relatedRoles[z].role;
        addLabel.on(buttonModule.Button.tapEvent, loadResponsibilities, this);
        rolesStack.addChild(addLabel);
    }
    pageData.set("Process", false);
    pageData.set("Roles", true);
}
function loadProcesses(){
    //<Button text="Extra Duty Pay" class="Main_Nav_SubLine" tap="loadRoles"/>
    var dbReturn = getFromDataBase();
    var processes = [];
    var itemIsDuplicate = false;
    for(i = 0; i < dbReturn.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < processes.length; x++){
            if (dbReturn[i].process == processes[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            processes.push(dbReturn[i].process);
        }
    }
    //Load in buttons
    var responsibilitiesStack = pageObject.getViewById("processesLayout");
    responsibilitiesStack.removeChildren();
    for(z=0; z<processes.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = processes[z];
        addLabel.on(buttonModule.Button.tapEvent, loadRoles, this);
        responsibilitiesStack.addChild(addLabel);
    }
    pageData.set("Process", true);
    pageData.set("Roles", false);
    pageData.set("Responsibilities", false);
    
}
function loadResponsibilities(eventData) {
    var responsibilitiesStack = pageObject.getViewById("responsibilityContent");
    selectedRole = eventData.object.text;
    //console.log(eventData.object.text);
    var dbReturn = getFromDataBase();
    var descriptionText = "";
    //Get proper description
    for(i=0; i<dbReturn.length; i++){
        if(dbReturn[i].process == selectedProcess && dbReturn[i].role == selectedRole){
            descriptionText = dbReturn[i].description;
            break;
        }
    }
    //load into description area
    var descriptionItemSplit;
    var descriptionComponents = descriptionText.split("<*");
    responsibilitiesStack.removeChildren();
    var headerLabel = new Label()
    headerLabel.text = selectedProcess + "  > " + selectedRole;
    headerLabel.className = "Article_H2";
    responsibilitiesStack.addChild(headerLabel);
    for (z=0; z<descriptionComponents.length; z++){
        descriptionItemSplit = descriptionComponents[z].split("*>");
        var descLabel = new Label();
        descLabel.className = descriptionItemSplit[0];
        descLabel.text = descriptionItemSplit[1];
        responsibilitiesStack.addChild(descLabel);
    }
    pageData.set("Process", false);
    pageData.set("Roles", false);
    pageData.set("Responsibilities", true);
  }

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};
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
var getFromDataBase = function(){
    var databaseReturn = [];
    var databaseLine = {};
    databaseLine = {process:"Emergency salary advance", role:"Employee ", description:"<*Article_Body*>Employees should speak with their manager if they wish to request an emergency salary advance.<*Article_Note*>Note: Employees do not need to accept an emergency salary advance if offered. "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Emergency salary advance", role:"Finance ", description:"<*Article_Body*>Upon receiving the requisition for payment form (accessible only on the Government of Canada network) from the Pay Centre, finance personnel are responsible for:<*Article_List*>obtaining section 34 authorization for the emergency salary advance (following departmental processes for sign-off)<*Article_List*>issuing the emergency salary advance payment<*Article_List*>sending the signed requisition for payment form by encrypted email, fax or mail to the Pay Centre Mail Facility "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Emergency salary advance", role:"Manager ", description:"<*Article_Body*>Managers are responsible for:<*Article_List*>determining if an emergency salary advance meets the threshold set out by the Directive on Terms and Conditions of Employment <*Article_List*>obtaining approval for the emergency salary advance request following departmental procedures<*Article_List*>requesting the emergency salary advance in writing, following these steps: <*Article_List*>  step 1: complete a pay action request form <*Article_List*>  step 2: complete and sign the request for an emergency salary advance<*Article_Note*>  step 3: request that the trusted source: ◾authenticate the signature<*Article_Note*>submit the request to the Pay Centre by encrypted email, fax or mail to the Pay Center Mail Facility "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Hire or Rehire", role:"Human Resources", description:"<*Article_Body*>Human resources personnel are responsible for:<*Article_List*>preparing the letter of offer for new employees<*Article_List*>ensuring the hiring manager provides all required documentation related to the employee, including the letter of offer and the oath or affirmation (if required) <*Article_List*>verifying and creating the employee personal record identifier (PRI) in the central index<*Article_List*>ensuring accurate and timely completion of job and personal information rows in the Human Resources Management System ◦verifying that data<*Article_List*>verifying that data<*Article_List*>ensuring that information was entered successfully in Phoenix<*Article_Body*>Human resources personnel are responsible for collecting the following documentation and sending it, accompanied by a completed pay action request form, through a trusted source by encrypted email, fax or mail to the Pay Centre Mail Facility: <*Article_List*>signed and dated employee questionnaire<*Article_List*>completed TD1 form and provincial tax form<*Article_List*>signed letter of offer and acceptance (for exceptions only, for example, salary above minimum, as well as certain allowances that may be specific to a given employee (for example a rehired employee) or any other authoritative documentation (for example, an appointment letter) ◦if the letter of offer and acceptance is required, the section 34 approval signature must be authenticated by the trusted source before submitting it to the Pay Centre<*Article_List*>signed direct deposit enrollment form "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Hire or Rehire", role:"Manager", description:"<*Article_H2*>The section 34 manager and staffing authority are responsible for the following:<*Article_List*>signing the letter of offer<*Article_List*>administering the oath or affirmation and ensuring it is signed and shared with human resources (if required)<*Article_List*>confirming that the employee arrived for the first day of work<*Article_List*>ensuring that the employee has requested a myKEY<*Article_List*>completing all relevant tasks in the Phoenix pay system’s manager self-service, such as:<*Article_List*>  reviewing the employee’s work schedule, including checking status of self-service entries<*Article_List*>  creating and assigning the employee’s work schedule "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Hire or Rehire", role:"New Employee ", description:"<*Article_H2*>New employees<*Article_Body*>are responsible for signing their:<*Article_List*>letter of offer and acceptance<*Article_List*>oath or affirmation GC-29 (if required)<*Article_Body*>New employees must complete all required documentation and provide it, and any other information requested, to human resources personnel, including:<*Article_List*>Social Insurance Number (SIN) <*Article_List*>TD1 form and provincial tax form<*Article_List*>employee questionnaire<*Article_List*>direct deposit enrolment form PWGSC 8437<*Article_Body*>New employees must complete the following actions in the Phoenix pay system: <*Article_List*>enroll for myKEY or update enrolment ◦enrollment requires a valid government address, a personal record identifier (PRI) and date of birth <*Article_List*>establish relationship with section 34 manager in Phoenix self-service<*Article_List*>record appropriate time and labour entries <*Article_H2*>Dual employment<*Article_Body*>Employees with dual employment status must advise their manager that they are on leave without pay from their substantive position.<*Article_H2*>Rehire<*Article_Body*>Employees served by the Pay Centre must complete:<*Article_List*>TD1 form and provincial tax form<*Article_List*>employee questionnaire <*Article_List*>direct deposit enrolment form PWGSC 8437 <*Article_Body*>Upon receiving the pension plan enrolment package, an eligible employee must:<*Article_List*>acknowledge receipt of the notification of plan membership form (PWGSC 2018) using the pension tools located within the Compensation Web Applications<*Article_Body*>or<*Article_List*>complete the enrolment information and acknowledgment of plan membership form PWGSC 571"};

databaseReturn.push(databaseLine);
    

    return databaseReturn;
}

