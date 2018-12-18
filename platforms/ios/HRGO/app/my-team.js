var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var pageObject;
const Label = require("tns-core-modules/ui/label/").Label;
const fromObject = require("tns-core-modules/data/observable").fromObject;


exports.onNavigatingTo = function(args){
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    pageData.set("employeeName", "");
    pageData.set("employeeEmail", "");
    
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
    displayTeamMembers(tempTeam);
};
var getTeamMembers = function(){
    var teamMemberPull;
    //TO REPLACE
        var teamMembers = [];
        teamMembers[0] = {empName: "Person 1", empEmail: "Email 1"};
        teamMembers[1] = {empName: "Person 2", empEmail: "Email 2"};
        teamMembers[2] = {empName: "Person 3", empEmail: "Email 3"};
        teamMemberPull = JSON.stringify(teamMembers);
    //END REPLACE

    teamMemberReturn = JSON.parse(teamMemberPull);

    return teamMemberReturn;
};
var displayTeamMembers = function(membersToDisplay){
    var teamStack = pageObject.getViewById("teamListStack");
    var teamMembers = membersToDisplay;

    // create dynamic content
    for(i = 0; i < teamMembers.length; i++){
        var teamMemberLabel = new Label;
        teamMemberLabel.text = teamMembers[i].empName + " ( " + teamMembers[i].empEmail + " )";
        teamStack.addChild(teamMemberLabel);
    };
};

