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
    loadMissionContent();
}
exports.pageLoaded = function(args) {
    
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
};

var loadMissionContent = function(){
    var dbReturn = getFromDataBase();
    for(i=0; i<dbReturn.length; i++){
        var contentID = dbReturn[i].mission + "Content";
        var missionContentBox = pageObject.getViewById(contentID);
        missionContentBox.removeChildren();
        var descriptionText = dbReturn[i].description;
        var descriptionItemSplit;
        var descriptionComponents = descriptionText.split("<*");
        for (z=0; z<descriptionComponents.length; z++){
            descriptionItemSplit = descriptionComponents[z].split("*>");
            var descLabel = new Label();
            //LabelArray.push(new Label());
            descLabel.className = descriptionItemSplit[0];
            descLabel.text = descriptionItemSplit[1];
            missionContentBox.addChild(descLabel);
        }

    }
}

var getFromDataBase = function(){
    var databaseReturn = [];
    var databaseLine = {};
    databaseLine = {mission:"mission1", description:"<*Article_H2*>Mission #1: Pre-Onboarding<*Article_Body*>We want to help you make a positive first impression! Before you start your student employment at DND, please ensure that you take the time to review the information below so that you are prepared for your first day of work.<*Article_H3*>Read about who we are<*Article_List*>Go to the About Us page to read about the Defence Team’s vision and organizational priorities.<*Article_H3*>Familiarize yourself with the organizational structure at DND, CAF Ranks and Insignia<*Article_List*>Go to the About Organizational Structure page to read about DND’s high-level reporting structure.<*Article_List*>Go to the Rank Appointment Insignia page to read about the ranks within the CAF.<*Article_H3*>Familiarize yourself with the Terms and Conditions of Employment for Students<*Article_List*>Students are paid in accordance with the Terms and Conditions of Employment for Students (Student Rates of Pay).<*Article_H3*>Read and complete all forms provided by your manager/ supervisor and/or Human Resources (HR)<*Article_List*>Letter of Offer<*Article_List*>Direct Deposit Form<*Article_List*>Tax Forms (Federal and Provincial)<*Article_List*>Employee Questionnaire Form<*Article_List*>Solemn Oath or Affirmation Form (new hires external to the public service only)<*Article_List*>Political Activities and You! Brochure<*Article_List*>DND and CF Code of Values and Ethics Brochure<*Article_List*>DND/CF Self-Identification Form<*Article_List*>New Student Passport: Pre-onboarding Checklist<*Article_H3*>Prepare for your first day of work<*Article_List*>If your manager/supervisor hasn’t contacted you, contact them to confirm your start date, expected time of arrival, work location, transportation options/parking, what to do when you arrive, etc.<*Article_List*>Be prepared to talk to your manager/supervisor about your role and expectations, work hours/breaks, any workplace accommodations that are needed, employment equity initiatives, the importance of diversity and inclusion in the workplace and remuneration. Come prepared with any questions you might have, as your manager/supervisor will be setting some time aside to review your Letter of Offer and other HR documents with you.<*Article_List*>Ask about the dress code, language of work (including the designation of your work unit) and any other cultural expectations of the workplace.<*Article_List*>Prepare to bring with you<*Article_List*>A valid piece of government-issued photo ID (i.e. Driver’s License, Health Card, etc.) in order to receive a temporary building pass.<*Article_List*>Your signed Letter of Offer and any other completed forms as instructed by HR, if not already sent.<*Article_List*>Any other information requested by your manager/supervisor."};
    databaseReturn.push(databaseLine);
    databaseLine = {mission:"mission2a", description:"<*Article_H2*>Mission #2A: Pre-Onboarding<*Article_Body*>We want to help you make a positive first impression! Before you start your student employment at DND, please ensure that you take the time to review the information below so that you are prepared for your first day of work.<*Article_H3*>Read about who we are<*Article_List*>Go to the About Us page to read about the Defence Team’s vision and organizational priorities."};
    databaseReturn.push(databaseLine);
    databaseLine = {mission:"mission2b", description:"<*Article_H2*>Mission #2B: Pre-Onboarding<*Article_Body*>We want to help you make a positive first impression! Before you start your student employment at DND, please ensure that you take the time to review the information below so that you are prepared for your first day of work.<*Article_H3*>Read about who we are<*Article_List*>Go to the About Us page to read about the Defence Team’s vision and organizational priorities."};
    databaseReturn.push(databaseLine);
    databaseLine = {mission:"mission3", description:"<*Article_H2*>Mission #3: Pre-Onboarding<*Article_Body*>We want to help you make a positive first impression! Before you start your student employment at DND, please ensure that you take the time to review the information below so that you are prepared for your first day of work.<*Article_H3*>Read about who we are<*Article_List*>Go to the About Us page to read about the Defence Team’s vision and organizational priorities."};
    databaseReturn.push(databaseLine);
    databaseLine = {mission:"mission4", description:"<*Article_H2*>Mission #4: Pre-Onboarding<*Article_Body*>We want to help you make a positive first impression! Before you start your student employment at DND, please ensure that you take the time to review the information below so that you are prepared for your first day of work.<*Article_H3*>Read about who we are<*Article_List*>Go to the About Us page to read about the Defence Team’s vision and organizational priorities."};
    databaseReturn.push(databaseLine);
    databaseLine = {mission:"mission5", description:"<*Article_H2*>Mission #5: Pre-Onboarding<*Article_Body*>We want to help you make a positive first impression! Before you start your student employment at DND, please ensure that you take the time to review the information below so that you are prepared for your first day of work.<*Article_H3*>Read about who we are<*Article_List*>Go to the About Us page to read about the Defence Team’s vision and organizational priorities."};
    databaseReturn.push(databaseLine);

    

    return databaseReturn;
}

