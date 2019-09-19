var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "YourPayInformation";
var navList = [];
var pageObject;


exports.pageLoaded = function(args) {
    const page = args.object;
    pageObject = page;
    //vm = new Observable();
    pageData.set("mondayCheck", true);
    pageData.set("tuesdayCheck", true);
    pageData.set("wednesdayCheck", true);
    pageData.set("thursdayCheck", true);
    pageData.set("fridayCheck", true);
    
    pageData.set("sundayCheck", false);
    pageData.set("saturdayCheck", false);
    
    const TODAY = new Date();
    pageData.set("date", TODAY);
    pageData.set("endDateLabel", "Date de fin: ");
    pageData.set("numberOfDays", 90);
    page.bindingContext = pageData;

};
exports.setNotification = function(){
    //pageData.set("endDateLabel", "Processing");
    addScheduleDays(pageData.get("date"),getDaysOfWork(),pageData.get("numberOfDays"));
};
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
    topmost.navigate("FR_profile-page");
    
}
exports.toggleCheck = function(args){
    if(args.object.value == "true"){
        args.object.value = "false";
        args.object.text = "";
        args.object.style.backgroundColor = "#FFF";
    }else{
        args.object.value = "true";
        args.object.text = String.fromCharCode(0xea10);
        
        args.object.style.backgroundColor = "#222";
        
    }

};
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
    topmost.navigate("POC-page");
}
var addScheduleDays = function(startDate, schedule, totalDays){  
    if(schedule.length == 0 ) {
        console.log("no days selected");
        return;
    }
    var i = 0;
    var checkDate = new Date(startDate.toString());
    console.log("Start Date: " + checkDate.toString());

    while(i < totalDays){
        for(z = 0; z < schedule.length; z++){
            if (checkDate.getDay() == schedule[z]){
                    i++; 
            }
        }
        if (i < totalDays){
            checkDate.setDate(checkDate.getDate()+1);
        }
    }
    //ADD CHECK HOLIDAYS HERE INSTEAD OF DURING LOOP
    var addedDays = numberOfHolidaysPassed(startDate, checkDate);
    i = 0;
    console.log("Temp End: " + checkDate.toString() + " | Days to Add: " + addedDays);
    while(i <= addedDays){
        for(z = 0; z < schedule.length; z++){
            if (checkDate.getDay() == schedule[z]){
                if(checkIfHoliday(checkDate) == true){

                }else{
                    i++;
                } 
            }
        }
        if (i <= addedDays){
            checkDate.setDate(checkDate.getDate()+1);
        }
    }
    console.log("End Date: " + checkDate.toString());
    pageData.set("endDateLabel", "Date de fin: " + formatDate(checkDate.toString()));
}
var numberOfHolidaysPassed = function(sDate, eDate){
    var holidayList = getHolidays();
    var daysToAdd = 0;
    for(x=0; x < holidayList.length; x++){
        if(sDate.getTime() < holidayList[x].getTime() && holidayList[x].getTime() < eDate.getTime()){
            daysToAdd++;
            console.log("Holiday Date: " + holidayList[x]);
        }
    }
    return daysToAdd;
}
var getDaysOfWork = function(){
    var daysOfWork = [];
    daysOfWork.length = 0;
    var dayValues = []
    dayValues[0] = pageObject.getViewById("sundayCheck");
    dayValues[1] = pageObject.getViewById("mondayCheck");
    dayValues[2] = pageObject.getViewById("tuesdayCheck");
    dayValues[3] = pageObject.getViewById("wednesdayCheck");
    dayValues[4] = pageObject.getViewById("thursdayCheck");
    dayValues[5] = pageObject.getViewById("fridayCheck");
    dayValues[6] = pageObject.getViewById("saturdayCheck");

    for(x = 0; x < dayValues.length; x++){
        if(dayValues[x].value == "true"){
            daysOfWork.push(x);
        }
    }

    return daysOfWork;
}
var formatDate = function(inputDate){
    var dateInput = new Date(inputDate);
    var formattedDate;
    var month;
    switch (dateInput.getMonth()){
    case 0 :
        month = "janvier";
        break;
    case 1 :
        month = "février";
        break;
    case 2 :
        month = "mars";
        break;
    case 3 :
        month = "avril";
        break;
    case 4 :
        month = "mai";
        break;
    case 5 :
        month = "juin";
        break;
    case 6 :
        month = "juillet";
        break;
    case 7 :
        month = "août";
        break;
    case 8 :
        month = "septembre";
        break;
    case 9 :
        month = "octobre";
        break;
    case 10 :
        month = "novembre";
        break;
    case 11 :
        month = "décembre";
        break;
    }
    formattedDate = dateInput.getDate() + " " + month + " " + dateInput.getFullYear();
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