var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
const layout = require("tns-core-modules/ui/layouts/grid-layout");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "YourPayInformation";
var applicationSettings = require("application-settings");
var overTimeList = [];
var switchModule = require("tns-core-modules/ui/switch");
var pageObject;
const Label = require("tns-core-modules/ui/label/").Label;


exports.pageLoaded = function(args) {
    const page = args.object;
    const TODAY = new Date();
    pageObject = page;
    page.bindingContext = pageData;
    pageData.set("date", TODAY);
    pageData.set("AddTime", false);
    getOvertime();
    displayOvertime();
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log(subNavTitle);
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
exports.addTime = function(args){
    var enteredTime = {Date:pageData.get("submitDate"), Hours:pageData.get("submitHours"), Entered:false};
    addToOvertime(enteredTime);
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
exports.clearSubmittedTime = function(){
    var tempOvertimeList = [];
    for(i=0; i<overTimeList.length; i++){
        if(overTimeList[i].Entered == false){
            tempOvertimeList.push(overTimeList[i]);
        }
    }
    overTimeList = tempOvertimeList;
    var saveString = JSON.stringify(overTimeList);
    applicationSettings.setString("Saved_Overtime", saveString);
    pageData.set("ViewSchedule", false);
    saveOvertime();
    displayOvertime();

}
var displayOvertime = function(){
    var otLayout = pageObject.getViewById("Overtime_Stack");
    otLayout.removeChildren();

    for(i=0; i<overTimeList.length; i++){
        var gridLayout = new layout.GridLayout();
        var rowTitle = new Label();
        var hoursTitle = new Label();
        var dateInput = new Date(overTimeList[i].Date);
        var enteredCheck = new switchModule.Switch();
        
        rowTitle.text = `${dateInput.getFullYear()}\/${dateInput.getMonth()+1}\/${dateInput.getDate()}`;
        rowTitle.className = "Main_Nav_SubLine";
        hoursTitle.text = "Hours: " + overTimeList[i].Hours;
        hoursTitle.className = "Article_Body"
        enteredCheck.checked = overTimeList[i].Entered;
        enteredCheck.id = i;
        enteredCheck.on("checkedChange", (args) => {setItemEntered(args);});

        layout.GridLayout.setRow(rowTitle, 0);
        layout.GridLayout.setRow(hoursTitle, 1);
        layout.GridLayout.setRow(enteredCheck, 2);
        
        gridLayout.addChild(rowTitle);
        gridLayout.addChild(hoursTitle);
        gridLayout.addChild(enteredCheck);

        var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var hoursRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var checkRow= new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        gridLayout.addRow(titleRow);
        gridLayout.addRow(hoursRow);
        gridLayout.addRow(checkRow);
        gridLayout.className = "POC_Grid";
        otLayout.addChild(gridLayout);
    }

}
var setItemEntered = function(args){
    console.log(args.object.id);
    overTimeList[args.object.id].Entered = args.object.checked;
    saveOvertime();
}

var formatDate = function(inputDate){
    var dateInput = new Date(inputDate);
    var formattedDate;
    var month;
    switch (dateInput.getMonth()){
    case 0 :
        month = "January";
        break;
    case 1 :
        month = "February";
        break;
    case 2 :
        month = "March";
        break;
    case 3 :
        month = "April";
        break;
    case 4 :
        month = "May";
        break;
    case 5 :
        month = "June";
        break;
    case 6 :
        month = "July";
        break;
    case 7 :
        month = "August";
        break;
    case 8 :
        month = "September";
        break;
    case 9 :
        month = "October";
        break;
    case 10 :
        month = "November";
        break;
    case 11 :
        month = "December";
        break;
    }
    formattedDate = month + " " + dateInput.getDate() + ", " + dateInput.getFullYear();
    return formattedDate;
}
var getOvertime = function(){
    var overtimePull;
    if(applicationSettings.hasKey("Saved_Overtime")){
        overtimePull = applicationSettings.getString("Saved_Overtime");
        overTimeList = JSON.parse(overtimePull);
    }
    console.log(overTimeList.length);
}
var addToOvertime = function(timeToSave)
{
    //Get currently saved overtime
    var overtimePull = null;
    var saveString = "";
    if(applicationSettings.hasKey("Saved_Overtime")){
        overtimePull = applicationSettings.getString("Saved_Overtime");
    }
    else {
    };
    if(overtimePull == null){
        var savedOvertime = [];
        savedOvertime.push(timeToSave);
        saveString = JSON.stringify(savedOvertime);
        applicationSettings.setString("Saved_Overtime", saveString);
    }else{
        var savedOvertime = JSON.parse(overtimePull);
        savedOvertime.push(timeToSave);
        saveString = JSON.stringify(savedOvertime);
        applicationSettings.setString("Saved_Overtime", saveString);
    }
    overTimeList = savedOvertime;
    displayOvertime();
}
var saveOvertime = function(){

    var saveString = "";
    saveString = JSON.stringify(overTimeList);
    applicationSettings.setString("Saved_Overtime", saveString);
    
};