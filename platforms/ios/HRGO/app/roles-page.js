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
        //LabelArray.push(new Label());
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

var getFromDataBase = function(){
    var databaseReturn = [];
    var databaseLine = {};
    databaseLine = {process:"Extra Duty Pay", role:"Employee", description:"<*Article_Body*>Be sure to have a valid MyKey or PKI Card<*Article_Body*>Enter time in Phoenix self-service<*Article_Body*>Respect and prioritize timeliness cutoff dates<*Article_Body*>Enter late time submissions in Phoenix self-service within 6 months"};
    databaseReturn.push(databaseLine);
    databaseLine = {process:"Extra Duty Pay", role:"Manager", description:"<*Article_Body*>Review and approve time in Phoenix self-service<*Article_Body*>Enter time in Phoenix self-service on behalf of employees who do not have access"};
    databaseReturn.push(databaseLine);
    databaseLine = {process:"Benefits Enrollment", role:"Employee", description:"<*Article_H2*>Public Service Health Care Plan<*Article_Body*>Enroll in and amend PSHCP coverage using Phoenix self-service<*Article_Body*>Completing a Phoenix Feedback Form to enroll in any voluntary insurance plans or other benefits not available for enrollment through Phoenix self-service"};
    databaseReturn.push(databaseLine);
    databaseLine = {process:"Benefits Enrollment", role:"Pay Center", description:"<*Article_H2*>Public Service Health Care Plan<*Article_Body*>Responsible for communicating with Sun Life Financial regarding errors and initiating any data corrections<*Article_Body*>Starting the registration to the applicable insurance plans or changing the information regarding the enrolment in Phoenix<*Article_Body*>Completing and sending the Public Service Management Insurance forms to the Compensation Sector, Pay Systems Sustainment and Pay Policies Directorate<*Article_Body*>Starting, changing or stopping enrolment of other benefits in Phoenix when the relevant documents are received if required"};
    databaseReturn.push(databaseLine);
    databaseLine = {process:"Benefits Enrollment", role:"Pension Center", description:"<*Article_H2*>Public Service Health Care Plan<*Article_Body*>"};
    databaseReturn.push(databaseLine);
    

    return databaseReturn;
}

