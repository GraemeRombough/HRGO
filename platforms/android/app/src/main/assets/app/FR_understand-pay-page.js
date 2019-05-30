var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var buttonModule = require("ui/button");
const Button = require("tns-core-modules/ui/button/").Button;
var pageData = new observable.Observable();
var selectedSection, selectedItem;
var pageObject;
var pageVM;
const Label = require("tns-core-modules/ui/label/").Label;
var subNavTitle = "YourPayInformation";

exports.onNavigatingTo = function(args){
    const page = args.object;
    pageObject = page;
    page.bindingContext = pageData;
    loadSections();
}
exports.pageLoaded = function(args) {
    
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    console.log(subNavTitle);
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};

function loadSections(){
    //<Button text="Extra Duty Pay" class="Main_Nav_SubLine" tap="loadRoles"/>
    var dbReturn = getFromDataBase();
    var sections = [];
    var itemIsDuplicate = false;
    for(i = 0; i < dbReturn.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < sections.length; x++){
            if (dbReturn[i].section == sections[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            sections.push(dbReturn[i].section);
        }
    }

    //Load in buttons
    var sectionStack = pageObject.getViewById("sectionLayout");
    sectionStack.removeChildren();
    for(z=0; z<sections.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = sections[z];
        addLabel.on(buttonModule.Button.tapEvent, loadItems, this);
        sectionStack.addChild(addLabel);
    }
    pageData.set("Section", true);
    pageData.set("Item", false);
    pageData.set("Descriptions", false);
    
}
function loadItems(args){
    //<Button text="Employee" class="Main_Nav_SubLine" tap="loadResponsibilities"/>
    var dbReturn = getFromDataBase();
    var relatedItems = [];
    selectedSection = args.object.text;
    //console.log(selectedProcess);
    for (i=0; i < dbReturn.length; i++){
        if (dbReturn[i].section == selectedSection && dbReturn[i].item != ""){
            relatedItems.push(dbReturn[i]);
        }
        if (dbReturn[i].section == selectedSection && dbReturn[i].item == ""){
            var descriptionsStack = pageObject.getViewById("descriptionContent");
            descriptionsStack.removeChildren();
            var descLabel = new Label();
            var titleLabel = new Label()
            descLabel.text = dbReturn[i].description;
            descLabel.className = "Article_Body";
            titleLabel.text = dbReturn[i].section;
            titleLabel.className = "Article_H3";
            descriptionsStack.addChild(titleLabel);
            descriptionsStack.addChild(descLabel);
            pageData.set("Section", false);
            pageData.set("Items", true);
        }
    }
    //console.log(relatedRoles.length);
    var itemsStack = pageObject.getViewById("itemLayout");
    itemsStack.removeChildren();
    for(z=0; z<relatedItems.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = relatedItems[z].item;
        addLabel.on(buttonModule.Button.tapEvent, loadDescriptions, this);
        itemsStack.addChild(addLabel);
    }

    pageData.set("Section", false);
    pageData.set("Item", true);
    pageData.set("Descriptions", true);
}
function loadDescriptions(eventData) {
    var descriptionsStack = pageObject.getViewById("descriptionContent");
    selectedItem = eventData.object.text;
    //console.log(eventData.object.text);
    var dbReturn = getFromDataBase();
    var descriptionText = "";
    //Get proper description
    for(i=0; i<dbReturn.length; i++){
        if(dbReturn[i].section == selectedSection && dbReturn[i].item == selectedItem){
            descriptionText = dbReturn[i].description;
            descriptionsStack.removeChildren();
            var descLabel = new Label();
            var titleLabel = new Label();
            descLabel.text = dbReturn[i].description;
            descLabel.className = "Article_Body";
            titleLabel.text = dbReturn[i].item;
            titleLabel.className = "Article_H3";
            descriptionsStack.addChild(titleLabel);
            descriptionsStack.addChild(descLabel);
            break;
        }
    }
    pageData.set("Section", false);
    pageData.set("Item", false);
    pageData.set("Items", true);
  }

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page");
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
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
var getFromDataBase = function(){
    var databaseReturn = [];
    var databaseLine = {};
    
    databaseLine = {section:"View Paycheque", item:"", description:"This is the section at the top of your paycheque with high level information on the current paycheque."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"View Paycheque", item:"Company", description:"The company you work for as it would appear on your T4."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"View Paycheque", item:"Net Pay", description:"The entire dollar amount that will be (is) paid to you through your desired payment method."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"", description:"This section contains personal information and items related to your job and base pay rate."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Name", description:"Your name as it is represented in HRMS."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Employee ID", description:"Your PRI."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Address", description:"Your home address, where any paper documentation would be sent and what will appear on your T4."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Business Unit", description:"Represents your department."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Pay Group", description:"The group you belong to for pay purposes according to the Pay Center."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Department", description:"The code identifying your substantive department."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Location", description:"Location code related to your position information in HRMS.  This is important for tax purposes."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Job Title", description:"Your Job Title."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"General", item:"Pay Rate", description:"The amount and rate of base pay for your substantive position."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"Tax Data", item:"", description:"This section contains information related to the taxes you pay, standard deductions, or any additional tax deductions."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"Tax Data", item:"Fed Net Claim", description:"The standard personal deduction for Federal taxes."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"Tax Data", item:"Fed Spcl Letters", description:""};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"Tax Data", item:"Fed Addl Percent", description:"Additionally requested federal tax deductions as a percentage."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"Tax Data", item:"Fed Addl Amount", description:"Additionally requested federal tax deductions as a specific amount."};
    databaseReturn.push(databaseLine);
    databaseLine = {section:"Tax Data", item:"PROV Net Claim", description:"The standard personal deduction for your Provincial taxes."};
    databaseReturn.push(databaseLine);
    return databaseReturn;
}

