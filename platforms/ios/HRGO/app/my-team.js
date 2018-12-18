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
    topmost.navigate("main-page");
};
exports.addEmployee = function(args){
    var newEmployee = {empName: pageData.employeeName, empEmail: pageData.employeeEmail};
    var employeeString = JSON.stringify(newEmployee);
    console.log(employeeString);
    
    var tempTeam = getTeamMembers();
    tempTeam.push(newEmployee);
    saveTeamMembers(tempTeam);
    displayTeamMembers(tempTeam);
};
exports.sendEmail = function(args){
    console.log("Send Email");
    email.available().then(function(avail){
        console.log("Email available? " + avail);
    });
    var subject = pageData.get("emailSubject");
    var body = pageData.get("emailBody");
    

};
var getTeamMembers = function(){
    var teamMemberPull;
        
        if(applicationSettings.hasKey("My_Team_Members")){
            teamMemberPull = applicationSettings.getString("My_Team_Members");
        }
        else {
            //Only to add testing value, otherwise set null
            var teamMembers = [];
            teamMembers[0] = {empName: "Person 1", empEmail: "Email 1"};
            teamMembers[1] = {empName: "Person 2", empEmail: "Email 2"};
            teamMembers[2] = {empName: "Person 3", empEmail: "Email 3"};
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
        teamMemberLabel.text = teamMembers[i].empName + " ( " + teamMembers[i].empEmail + " )";
        teamStack.addChild(teamMemberLabel);
    };
};

