var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var pageObject;
var applicationSettings = require("application-settings");
const Label = require("tns-core-modules/ui/label/").Label;
const fromObject = require("tns-core-modules/data/observable").fromObject;
const email = require("nativescript-email");


exports.onNavigatingTo = function(args){
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    pageData.set("employeeName", "");
    pageData.set("employeeEmail", "");
    displayTeamMembers(getTeamMembers());
    
};
exports.pageLoaded = function(args) {
    
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page");
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log(subNavTitle);
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
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
exports.clearKeyboard = function(args){
    var textInput = pageObject.getViewById("subjectText");
    var textInput2 = pageObject.getViewById("bodyText");
    textInput.dismissSoftInput();
    textInput2.dismissSoftInput();
}
exports.clearTeam = function(args){
    applicationSettings.remove("My_Team_Members");
    displayTeamMembers(getTeamMembers());
}
exports.addEmployee = function(args){
    var newEmployee = {empName: pageData.employeeName, empEmail: pageData.employeeEmail};
    var employeeString = JSON.stringify(newEmployee);
    console.log(employeeString);
    if(newEmployee.empName != "" && newEmployee.empEmail !== ""){
        var tempTeam = getTeamMembers();
        tempTeam.push(newEmployee);
        saveTeamMembers(tempTeam);
        displayTeamMembers(tempTeam);
        pageData.set("employeeName", "");
        pageData.set("employeeEmail", "");  
    }
    
};
exports.sendEmail = function(args){
    console.log("Send Email");
    email.available().then(function(avail){
        console.log("Email available? " + avail);
    });
    var eSubject = pageData.get("emailSubject");
    var eBody = pageData.get("emailBody");
    var toAddress = [];
    var team = getTeamMembers();
    for(i=0; i<team.length; i++){
        toAddress.push(team[i].empEmail);
    };

    if(eSubject){
        if (email.available()){
            email.compose({
                subject: eSubject,
                body: eBody,
                to: toAddress
            });
        } else {
            console.log("Email Not Available");
        }
    } else {
        console.log("Subject field blank");
    }
    console.log(toAddress);
};
var getTeamMembers = function(){
    var teamMemberPull;
        
        if(applicationSettings.hasKey("My_Team_Members")){
            teamMemberPull = applicationSettings.getString("My_Team_Members");
        }
        else {
            //Only to add testing value, otherwise set null
            var teamMembers = [];
            /* teamMembers[0] = {empName: "Graeme Rombough", empEmail: "graeme_rombough@hotmail.com"};*/
            teamMemberPull = JSON.stringify(teamMembers);
        };
    var teamMemberReturn = JSON.parse(teamMemberPull);

    return teamMemberReturn;
};
var saveTeamMembers = function(membersToSave){
    var saveString = JSON.stringify(membersToSave);
    applicationSettings.setString("My_Team_Members", saveString);
    console.log(saveString);
};
var displayTeamMembers = function(membersToDisplay){
    var teamStack = pageObject.getViewById("teamListStack");
    teamStack.removeChildren();
    var teamMembers = membersToDisplay;

    // create dynamic content
    for(i = 0; i < teamMembers.length; i++){
        var teamMemberLabel = new Label;
        var teamMemberEmail = new Label;
        teamMemberLabel.text = teamMembers[i].empName;
        teamMemberLabel.className = "Utility_MyTeam_TeamName";
        teamMemberEmail.text = "  [" + teamMembers[i].empEmail + "]";
        teamMemberEmail.className = "Utility_MyTeam_TeamEmail";
        teamStack.addChild(teamMemberLabel);
        teamStack.addChild(teamMemberEmail);
    };
};

