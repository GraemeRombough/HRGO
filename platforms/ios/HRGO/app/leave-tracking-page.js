var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var buttonModule = require("ui/button");
const Button = require("tns-core-modules/ui/button/").Button;
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
    pageData.set("submitDate", TODAY);
    pageData.set("AddTime", false);
    pageData.set("submitHours", "");
    pageData.set("endDate", TODAY);
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
    var enteredTime = {Date:pageData.get("submitDate"), EndDate:pageData.get("endDate"), Hours:pageData.get("submitHours"), Entered:false};
    addToOvertime(enteredTime);
    pageData.set("AddTime", false);
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
    applicationSettings.setString("Saved_Leave", saveString);
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
        var dateEnd = new Date(overTimeList[i].EndDate);
        var hoursTitle = new Label();
        var hoursNumber = new Label();
        var dateInput = new Date(overTimeList[i].Date);
        var enteredTitle = new Label();
        var enteredCheck = new Button();
        var clearButton = new Button();
        
        rowTitle.text = `${dateInput.getFullYear()}\/${dateInput.getMonth()+1}\/${dateInput.getDate()} - ${dateEnd.getFullYear()}\/${dateEnd.getMonth()+1}\/${dateEnd.getDate()}`;
        rowTitle.className = "Main_Nav_SubLine";
        hoursTitle.text = "Hours:";
        hoursTitle.className = "Utility_TableText_1L";
        hoursNumber.text = overTimeList[i].Hours;
        hoursNumber.className = "Utility_TableText_1";
        enteredTitle.text = "Entered?";
        enteredTitle.className = "Utility_TableText_1L";
        enteredCheck.className = "Home_Checkbox";
        enteredCheck.value = overTimeList[i].Entered;
        enteredCheck.id = i;
        if(overTimeList[i].Entered == "true"){enteredCheck.text = "\uea10";};
        enteredCheck.on(buttonModule.Button.tapEvent, setItemEntered, this);
        clearButton.text = "Clear";
        clearButton.id = i;
        clearButton.className = "Submit_Button_1";
        clearButton.on(buttonModule.Button.tapEvent, clearThisItem, this);

        layout.GridLayout.setRow(rowTitle, 0);
        layout.GridLayout.setRow(hoursTitle, 1);
        layout.GridLayout.setRow(hoursNumber, 1);
        layout.GridLayout.setRow(enteredTitle, 2);
        layout.GridLayout.setRow(enteredCheck, 2);
        layout.GridLayout.setRow(clearButton, 3);

        layout.GridLayout.setColumn(rowTitle, 0);
        layout.GridLayout.setColumn(hoursTitle, 0);
        layout.GridLayout.setColumn(hoursNumber, 1);
        layout.GridLayout.setColumn(enteredTitle, 0);
        layout.GridLayout.setColumn(enteredCheck, 1);
        layout.GridLayout.setColumn(clearButton, 0);
        
        gridLayout.addChild(rowTitle);
        gridLayout.addChild(hoursTitle);
        gridLayout.addChild(enteredTitle);
        gridLayout.addChild(enteredCheck);
        gridLayout.addChild(hoursNumber);
        gridLayout.addChild(clearButton);


        var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var hoursRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var checkRow= new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var clearRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var firstCol = new layout.ItemSpec(1, layout.GridUnitType.STAR);
        var secondCol = new layout.ItemSpec(1, layout.GridUnitType.STAR);
        layout.GridLayout.setColumnSpan(rowTitle, 2);
        layout.GridLayout.setColumnSpan(clearButton, 2);
        gridLayout.addColumn(firstCol);
        gridLayout.addColumn(secondCol);
        gridLayout.addRow(titleRow);
        gridLayout.addRow(hoursRow);
        gridLayout.addRow(checkRow);
        gridLayout.addRow(clearRow);
        gridLayout.className = "POC_Grid";
        otLayout.addChild(gridLayout);

        /* //DIVIDE
        
        var gridLayout = new layout.GridLayout();
        var rowTitle = new Label();
        var hoursTitle = new Label();
        var dateInput = new Date(overTimeList[i].Date);
        var dateEnd = new Date(overTimeList[i].EndDate);
        var enteredCheck = new switchModule.Switch();
        console.log(overTimeList[i].Date);
        rowTitle.text = `${dateInput.getFullYear()}\/${dateInput.getMonth()+1}\/${dateInput.getDate()} - ${dateEnd.getFullYear()}\/${dateEnd.getMonth()+1}\/${dateEnd.getDate()}`;
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
        otLayout.addChild(gridLayout); */
    }

}
var clearThisItem = function(args){
    console.log(args.object.id);
    overTimeList.splice(args.object.id, 1);
    var saveString = JSON.stringify(overTimeList);
    applicationSettings.setString("Saved_Overtime", saveString);
    pageData.set("ViewSchedule", false);
    saveOvertime();
    displayOvertime();
    pageData.set("ViewSchedule", true);
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
    if(applicationSettings.hasKey("Saved_Leave")){
        overtimePull = applicationSettings.getString("Saved_Leave");
        overTimeList = JSON.parse(overtimePull);
    }
    console.log(overTimeList.length);
}
var addToOvertime = function(timeToSave)
{
    //Get currently saved overtime
    var overtimePull = null;
    var saveString = "";
    if(applicationSettings.hasKey("Saved_Leave")){
        overtimePull = applicationSettings.getString("Saved_Leave");
    }
    else {
    };
    if(overtimePull == null){
        var savedOvertime = [];
        savedOvertime.push(timeToSave);
        saveString = JSON.stringify(savedOvertime);
        applicationSettings.setString("Saved_Leave", saveString);
    }else{
        var savedOvertime = JSON.parse(overtimePull);
        savedOvertime.push(timeToSave);
        saveString = JSON.stringify(savedOvertime);
        applicationSettings.setString("Saved_Leave", saveString);
    }
    overTimeList = savedOvertime;
    console.log("AddtoOverTime Length:" + overTimeList.length);
    displayOvertime();
}
var saveOvertime = function(){

    var saveString = "";
    saveString = JSON.stringify(overTimeList);
    applicationSettings.setString("Saved_Leave", saveString);
    
};