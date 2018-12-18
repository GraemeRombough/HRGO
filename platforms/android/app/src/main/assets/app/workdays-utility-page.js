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
    pageData.set("mondayCheck", true)
    pageData.set("tuesdayCheck", true)
    pageData.set("wednesdayCheck", true)
    pageData.set("thursdayCheck", true)
    pageData.set("fridayCheck", true)
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

var addScheduleDays = function(startDate, schedule, totalDays){
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
    console.log("End Date: " + checkDate.toString());
    pageData.set("endDateLabel", "End Date: " + formatDate(checkDate.toString()));
}
var getDaysOfWork = function(){
    var daysOfWork = [];
    daysOfWork.length = 0;
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