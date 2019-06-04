var frameModule = require("ui/frame");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var pageData = new observable.Observable();
var LocalNotifications = require("nativescript-local-notifications").LocalNotifications;
var dialogs = require("ui/dialogs");
var pageObject;


exports.pageLoaded = function(args) {
    const page = args.object;
    //vm = new Observable();
    page.bindingContext = pageData;
    pageObject = page;

};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.setNotification = function(args){
    var TODAY = new Date();
    var repeatWeeks = Number(pageData.get("numberOfWeeks"));
    var employeeWeeklySub = pageObject.getViewById("weeklySubmission").value;
    var employeePaySub = pageObject.getViewById("paySubmission").value;
    var managerWeeklyApp = pageObject.getViewById("weeklyApproval").value;
    var managerPayApp = pageObject.getViewById("payApproval").value;
    var notID = 0;
    var subTitle = "Time Submission Reminder";
    var subBody = "Don't forget to submit your time for manager approval.";
    var appTitle = "Time Approval Reminder";
    var appBody = "Don't forget to approve submitted time."; 

    console.log("Employee Weekly: " + employeeWeeklySub + " for " + repeatWeeks);
    
    var submissionDay = TODAY;
    submissionDay.setTime(TODAY.getTime() + daysToMilliseconds(3 - TODAY.getDay()));
    if(submissionDay.getTime() < TODAY.getTime()){
        submissionDay.setTime(submissionDay.getTime() + daysToMilliseconds(7));
    }
    var payWeek = checkIfPayWeek(submissionDay);
    
    if(repeatWeeks > 0 ){
        LocalNotifications.requestPermission().then((granted) => {
            if(granted) {
                exports.resetNotification();
                for(z = 0; z <= repeatWeeks; z++){
                    
                    console.log("week: " + z );
                    
                    var notificationDate = new Date();
                    notificationDate.setTime(submissionDay.getTime() + daysToMilliseconds(7*z));
                    var approvalDate = new Date()
                    approvalDate.setTime(notificationDate.getTime() + daysToMilliseconds(2));
                    console.log(notificationDate);
                    if(payWeek == true){
                        if(employeeWeeklySub == "true"){
                            setNotification(notID, subTitle, subBody, notificationDate);
                            notID++;
                            console.log("Notification set for: " + notificationDate);
                        }
                        if(employeePaySub == "true"){
                            setNotification(notID, subTitle, subBody, notificationDate);
                            notID++;
                            console.log("Notification set for: " + notificationDate);
                        }
                        if(managerWeeklyApp == "true"){
                            setNotification(notID, appTitle, appBody, approvalDate);
                            notID++;
                            console.log("Manager Notification set for: " + approvalDate);
                        }
                        if(managerPayApp == "true"){
                            setNotification(notID, appTitle, appBody, approvalDate);
                            notID++;
                            console.log("Manager Notification set for: " + approvalDate);
                        }
                    }else{
                        if(employeeWeeklySub == "true"){
                            setNotification(notID, subTitle, subBody, notificationDate);
                            notID++;
                            console.log("Notification set for: " + notificationDate);
                        }
                        if(managerWeeklyApp == "true"){
                            setNotification(notID, appTitle, appBody, approvalDate);
                            notID++;
                            console.log("Manager Notification set for: " + approvalDate);
                        }
                    } 
                }
                console.log("Number of notification" + notID);
            }
        })
    }else{
        alert("Please select a number of weeks to repeat.");
    }   
    
};
var checkIfPayWeek = function(setDate){
    var TODAY = setDate;
    var historicPayDate = new Date("March 20, 2019");
    var isPayWeek;
    historicPayDate.setTime(historicPayDate.getTime() + daysToMilliseconds(TODAY.getDay() - historicPayDate.getDay()));
    //var todayDate = TODAY;
    var payWeekDistance = Math.round((TODAY - historicPayDate) / (7 * 24 * 60 * 60 * 1000));
    if(payWeekDistance % 2 == 0 && TODAY.getDay() != 4 && TODAY.getDay() != 5 && TODAY.getDay() != 6){
        isPayWeek = true;
    }else{
        isPayWeek = false;
    }
    console.log(isPayWeek);
    return isPayWeek;
}
var daysToMilliseconds = function(days){
    var milliseconds;

    milliseconds = days * 24 * 60 * 60 * 1000;

    return milliseconds;
};
exports.resetNotification = function(args){
    console.log("notifications cancelled");
    LocalNotifications.cancelAll();
}
var setNotification = function(not_id, not_title, not_body, not_at){
    LocalNotifications.requestPermission().then((granted) => {
        if(granted) {
            LocalNotifications.schedule([{id: not_id, title: not_title, body: not_body, at: not_at
            }]).then(() => {}, (error) => {console.log("ERROR", error);});
        }
    })
};
exports.toggleCheck = function(args){
    var employeeWeeklySub = pageObject.getViewById("weeklySubmission");
    var employeePaySub = pageObject.getViewById("paySubmission");
    var managerWeeklyApp = pageObject.getViewById("weeklyApproval");
    var managerPayApp = pageObject.getViewById("payApproval");
    if(args.object.value == "true"){
        args.object.value = "false";
        args.object.text = "";
        args.object.style.backgroundColor = "#FFF";
    }else{
        args.object.value = "true";
        args.object.text = String.fromCharCode(0xea10);    
        args.object.style.backgroundColor = "#222"; 

        if(args.object.id == "weeklySubmission"){
            //exports.toggleCheck(employeePaySub);
            employeePaySub.value = "false";
            employeePaySub.text = "";
            employeePaySub.style.backgroundColor = "#FFF";
            
        }
        if(args.object.id == "weeklyApproval"){
            //exports.toggleCheck(managerPayApp);
            managerPayApp.value = "false";
            managerPayApp.text = "";
            managerPayApp.style.backgroundColor = "#FFF";
            
        }
        if(args.object.id == "paySubmission"){
            //exports.toggleCheck(employeeWeeklySub);
            employeeWeeklySub.value = "false";
            employeeWeeklySub.text = "";
            employeeWeeklySub.style.backgroundColor = "#FFF";
            
        }
        if(args.object.id == "payApproval"){
            //exports.toggleCheck(managerWeeklyApp);
            managerWeeklyApp.value = "false";
            managerWeeklyApp.text = "";
            managerWeeklyApp.style.backgroundColor = "#FFF";
            
        }
    }
    
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