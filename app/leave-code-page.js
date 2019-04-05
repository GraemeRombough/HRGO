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
        }else if(dataBaseReturn[i].Code.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Desc.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].KeyWords.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }
    }
    displayPOCs(filteredResults);
    }else{
        displayPOCs(getFromDatabase());
    }
    
}
var displayPOCs = function(Codes){
    var LeaveList = pageObject.getViewById("POC_List");
    LeaveList.removeChildren();
    for(i = 0; i < Codes.length; i++ ){
        LeaveList.addChild(createPOCGrid(Codes[i].Title, Codes[i].Paid, Codes[i].Code, Codes[i].Desc));
    }
};
var createPOCGrid = function(Leave_t, Leave_p, Leave_c, Leave_d){
    var gridLayout = new layout.GridLayout();
    var LeaveTitle = new Label();
    var LeavePaid = new Label();
    var LeaveDesc = new Label();

    LeaveTitle.text = Leave_t + " (" + Leave_c + ")";
    LeaveTitle.className = "POC_H1";
    
    LeaveDesc.text = Leave_d;
    LeaveDesc.className = "POC_Body";

    layout.GridLayout.setRow(LeaveTitle, 0);
    layout.GridLayout.setRow(LeaveDesc, 1);
    gridLayout.addChild(LeaveTitle);
    gridLayout.addChild(LeaveDesc);
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(descRow);
    gridLayout.className = "POC_Grid";

    return gridLayout;

};
var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    dbRow = {Title:"Bereavement", Paid:"Yes", Code:"510", Desc:"The intent is to allow an employee time off with pay for purposes related to the death in the immediate family, as defined in the clause relating to bereavement leave.", KeyWords:"death"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Care of Immediate Family", Paid:"No", Code:"", Desc:"This leave is intended for the care of family members; family is described in the relevant collective agreement Article. ", KeyWords:"family; care"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Career / Professional Development", Paid:"Yes", Code:"620", Desc:"This leave may be granted for an activity, which in the opinion of the Employer is likely to be of assistance to an individual in furthering their career development, to the organization in achieving its goals and to allow employees to acquire continuing profession credits to complete or maintain licensing standards.", KeyWords:"promotion"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Compassionate Care", Paid:"No", Code:"951", Desc:"This leave type is for the purpose of care for a critically ill immediate family member (as defined in the relevant Collective Agreement) who is not expected to survive more than 6 months. ", KeyWords:"critical; illness "};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Compensatory", Paid:"Yes", Code:"810", Desc:"Normally overtime is paid out in cash, but at the request of the employee, a request can be made to take leave with pay in lieu of cash payment.", KeyWords:"comp; CTO"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Court", Paid:"Yes", Code:"610", Desc:"The intent is to allow an employee leave with pay to comply with a subpoena or summons issued by a court or duly constituted body or representative of the legal process.  Court leave is not granted to an employee who is a plaintiff or a defendant in a proceeding.  Jury duty is also part of this provision, and is applicable for only that time during which an employee is required to be in court.", KeyWords:"jury; subpeona; legal"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Education", Paid:"", Code:"", Desc:"Educational Leave (without pay) may be granted for varying periods of up to one (1) year, which can be renewed by mutual agreement to attend a recognized institution for studies in some field of education which is beneficial to both the employee and the organization.", KeyWords:"school; degree; sabatical; study"};
    databaseReturn.push(dbRow);

    return databaseReturn;
};
