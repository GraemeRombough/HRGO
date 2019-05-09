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
    pageData("ViewSchedule", false);
    saveOvertime();
    displayOvertime();

}
var displayOvertime = function(){
    var otLayout = pageObject.getViewById("Overtime_Stack");
    otLayout.removeChildren();

    for(i=0; i<overTimeList.length; i++){
        var gridLayout = new layout.GridLayout();
        var rowTitle = new Label();
        var dateInput = new Date(overTimeList[i].Date);
        var enteredCheck = new switchModule.Switch();
        
        rowTitle.text = `${dateInput.getFullYear()}-${dateInput.getMonth()}-${dateInput.getDay()} : ${overTimeList[i].Hours}H`;
        rowTitle.className = "Article_H3";
        
        enteredCheck.checked = overTimeList[i].Entered;
        enteredCheck.id = i;
        //enteredCheck.on("checkedChange", setItemEntered(this));
        //enteredCheck.on(switchModule.Switch.tapEvent, setItemEntered, this);
        enteredCheck.on("checkedChange", (args) => {setItemEntered(args);});

        layout.GridLayout.setRow(rowTitle, 0);
        layout.GridLayout.setRow(enteredCheck, 1);
        gridLayout.addChild(rowTitle);
        gridLayout.addChild(enteredCheck);

        var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        var checkRow= new layout.ItemSpec(1, layout.GridUnitType.AUTO);
        gridLayout.addRow(titleRow);
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
var addScheduleDays = function(startDate, schedule, totalDays){
    var i = 0;
    var checkDate = new Date(startDate.toString());
    console.log("Start Date: " + checkDate.toString());

    while(i < totalDays){
        
        for(z = 0; z < schedule.length; z++){
            if (checkDate.getDay() == schedule[z]){
                if(checkIfHoliday(checkDate) == true){

                }else{
                    i++;
                } 
            }
        }
        if (i < totalDays){
            checkDate.setDate(checkDate.getDate()+1);
        }
        
    }
    console.log("End Date: " + checkDate.toString());
    pageData.set("endDateLabel", "End Date: " + formatDate(checkDate.toString()));
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
var getHolidays = function(){
    var holidayList = [];

    //2019 Holidays
    holidayList.push(new Date("January 1, 2019"));
    holidayList.push(new Date("April 19, 2019"));
    holidayList.push(new Date("April 22, 2019"));
    holidayList.push(new Date("May 20, 2019"));
    holidayList.push(new Date("July 1, 2019"));
    holidayList.push(new Date("August 5, 2019"));
    holidayList.push(new Date("September 2, 2019"));
    holidayList.push(new Date("October 14, 2019"));
    holidayList.push(new Date("November 11, 2019"));
    holidayList.push(new Date("December 25, 2019"));
    holidayList.push(new Date("December 26, 2019"));

    //2020 Holidays
    holidayList.push(new Date("January 1, 2020"));
    holidayList.push(new Date("April 10, 2020"));
    holidayList.push(new Date("April 13, 2020"));
    holidayList.push(new Date("May 18, 2020"));
    holidayList.push(new Date("July 1, 2020"));
    holidayList.push(new Date("August 3, 2020"));
    holidayList.push(new Date("September 7, 2020"));
    holidayList.push(new Date("October 12, 2020"));
    holidayList.push(new Date("November 11, 2020"));
    holidayList.push(new Date("December 25, 2020"));
    holidayList.push(new Date("December 26, 2020"));

    return holidayList;
}
var checkIfHoliday = function(holidayTest){
    //NOTE: Could use dateString or other factor as object index.  If date doesn't return, then it's not a holiday
    var holidays = getHolidays();
    //console.log("holidayTest:" + holidayTest.getDate() + " | holiday1:" + holidays[0].getDate())
    for(n = 0; n < holidays.length; n++){
        if (holidayTest.toDateString() == holidays[n].toDateString()){
            console.log("holiday:" + holidayTest.toString());
            return true;    
        }
    }
    return false;
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