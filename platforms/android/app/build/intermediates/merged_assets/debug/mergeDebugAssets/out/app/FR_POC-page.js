var frameModule = require("ui/frame");
var buttonModule = require("ui/button");
var view = require("ui/core/view");
var observable = require("data/observable");
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const Button = require("tns-core-modules/ui/button/").Button;
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
var pageData = new observable.Observable();
const email = require("nativescript-email");

exports.pageLoaded = function(args) {
   
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    displayPOCs(getFromDatabase());
};

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
exports.searchPOC = function(){
    var dataBaseReturn = getFromDatabase();
    var filteredResults = [];
    if(pageData.get("SearchCriteria") != ""){
    for (i = 0; i < dataBaseReturn.length; i++) {
        if (dataBaseReturn[i].Title.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Desc.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }
    }
    displayPOCs(filteredResults);
    }else{
        displayPOCs(getFromDatabase());
    }
    
}
var displayPOCs = function(POCs){
    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();
    for(i = 0; i < POCs.length; i++ ){
        POCList.addChild(createPOCGrid(POCs[i].Title, POCs[i].Phone, POCs[i].Email, POCs[i].Desc));
    }
};
var createPOCGrid = function(POC_t, POC_p, POC_e, POC_d){
    var gridLayout = new layout.GridLayout();
    var POCTitle = new Label();
    var POCPhone = new Button();
    var POCEmail = new Button();
    var POCDesc = new Label();

    POCTitle.text = POC_t;
    POCTitle.className = "POC_H1";
    POCPhone.text = "Téléphone: " + POC_p;
    POCPhone.className = "POC_Phone";
    POCPhone.phone = POC_p;
    POCEmail.text = "Courriel: " + POC_e;
    POCEmail.className = "POC_Phone";
    POCEmail.email = POC_e;
    POCDesc.text = "Description: " + POC_d;
    POCDesc.className = "POC_Body";

    POCPhone.on(buttonModule.Button.tapEvent, callPOC, this);
    POCEmail.on(buttonModule.Button.tapEvent, emailPOC, this);

    layout.GridLayout.setRow(POCTitle, 0);
    layout.GridLayout.setRow(POCPhone, 1);
    layout.GridLayout.setRow(POCEmail, 2);
    layout.GridLayout.setRow(POCDesc, 3);
    gridLayout.addChild(POCTitle);
    gridLayout.addChild(POCPhone);
    gridLayout.addChild(POCEmail);
    gridLayout.addChild(POCDesc);
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var phoneRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var emailRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(phoneRow);
    gridLayout.addRow(emailRow);
    gridLayout.addRow(descRow);
    gridLayout.className = "POC_Grid";

    return gridLayout;

};
var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    dbRow = {Title:"PSPC Call Center", Phone:"1-888-HRTOPAY", Email:"", Desc:"You can contact the Public Service Pay Center (PSPC) as your first stop for any pay related issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"HRSS Support Line", Phone:"1-833-747-6363", Email:"", Desc:"The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Section 34 Manager Support Line", Phone:"1-833-747-6363", Email:"", Desc:"If you are a Section 34 Manager experiencing issues with time approval related tasks, agents at this hotline can help walk through your issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"PSPC Pension Center", Phone:"1-800-561-7930", Email:"", Desc:"PSPC is responsible for all federal pension plans (Public Service, RCMP and Canadian Armed Forces). If you have questions about your pension, contact the Government of Canada Pension Centre"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Employee Assistance Program", Phone:"1-800-268-7708", Email:"", Desc:"EAP offers solutions to both prevent and address the concerns of employers, employees, and immediate family members."};
    databaseReturn.push(dbRow);
    return databaseReturn;
};

var callPOC = function(eventData){
    console.log(eventData.object.phone);
};
var emailPOC = function(eventData){
    console.log(eventData.object.email);
    if (email.available()){
        email.compose({
            subject: "",
            body: "",
            to: eventData.object.email
        });
    } else {
        console.log("Email Not Available");
    }
};