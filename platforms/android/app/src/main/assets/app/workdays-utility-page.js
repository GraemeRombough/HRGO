var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "YourPayInformation";
var navList = [];


exports.pageLoaded = function(args) {
    const page = args.object;
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
    pageData.set("endDateLabel", "End Date: ");
    pageData.set("numberOfDays", 90);
    page.bindingContext = pageData;

};
exports.setNotification = function(){
    //console.log(pageData.get("date"));
    //console.log(pageData.get("mondayCheck"));
    addScheduleDays(pageData.get("date"),getDaysOfWork(),pageData.get("numberOfDays"));
};
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};
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
var getDaysOfWork = function(){
    var daysOfWork = [];
    daysOfWork.length = 0;
    if (pageData.get('sundayCheck')==true){
        daysOfWork.push(0);
    };
    if (pageData.get('mondayCheck')==true){
        daysOfWork.push(1);
    };
    if (pageData.get('tuesdayCheck')==true){
        daysOfWork.push(2);
    };
    if (pageData.get('wednesdayCheck')==true){
        daysOfWork.push(3);
    };
    if (pageData.get('thursdayCheck')==true){
        daysOfWork.push(4);
    };
    if (pageData.get('fridayCheck')==true){
        daysOfWork.push(5);
    };
    if (pageData.get('saturdayCheck')==true){
        daysOfWork.push(6);
    };
    console.log(daysOfWork.length);
    return daysOfWork;
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