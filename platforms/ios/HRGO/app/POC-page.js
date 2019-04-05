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
    topmost.navigate("main-page");
    
};
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
    POCPhone.text = "Phone: " + POC_p;
    POCPhone.className = "POC_Phone";
    POCPhone.phone = POC_p;
    POCEmail.text = "Email: " + POC_e;
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

    dbRow = {Title:"PSPC Call Center", Phone:"1-888-HRTOPAY", Email:"PAY@Canada.ca", Desc:"You can contact the Public Service Pay Center (PSPC) as your first stop for any pay related issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"HRSS Support Line", Phone:"1-833-747-6363", Email:"P.OTG.NationalCompensation@forces.gc.ca", Desc:"The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Section 34 Manager Support Line", Phone:"1-833-747-6363", Email:"P.OTG.NationalCompensation@forces.gc.ca", Desc:"If you are a Section 34 Manager experiencing issues with time approval related tasks, agents at this hotline can help walk through your issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Ask DCEP", Phone:"", Email:"P.OTGAskDCEP@forces.gc.ca", Desc:"The AskDCEP mailbox can be contacted for any questions related to staffing policy or the Public Service Resourcing System (PSRS)."};
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