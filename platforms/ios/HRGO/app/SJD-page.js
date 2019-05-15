var frameModule = require("ui/frame");
var buttonModule = require("ui/button");
var view = require("ui/core/view");
var observable = require("data/observable");
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const Button = require("tns-core-modules/ui/button/").Button;
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
var applicationSettings = require("application-settings");
var pageData = new observable.Observable();
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
var classDD;
var selectedClass;
const fromObject = require("tns-core-modules/data/observable").fromObject;
const email = require("nativescript-email");

exports.pageLoaded = function(args) {
   
    const page = args.object;
     
    pageObject = page;
    //displayPOCs(getFromDatabase());
    selectedClass = null;
    classDD = getClassList();

    page.bindingContext = pageData; 
    pageData.set("searchSection", true);
    pageData.set("contentSection", false);
    pageData.set("classItems", classDD);
    pageData.set("classIndex", 1);
    pageData.set("classCheck", false);
    pageData.set("titleCheck", true);
    pageData.set("SearchCriteria", "");
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
exports.showSearch = function(){
    pageData.set("classIndex", 1);
    pageData.set("classCheck", false);
    pageData.set("titleCheck", true);
    pageData.set("SearchCriteria", "");
    pageData.set("searchSection", true);
    pageData.set("contentSection", false);


}
exports.searchSJD = function(){
    var dataBaseReturn = getFromDatabase();
    var filteredResults = [];
    console.log(pageData.get("SearchCriteria"));
    
    if(pageData.get("classCheck") == true){
        if(pageData.get("titleCheck") == true){
            for (i = 0; i < dataBaseReturn.length; i++) {
                if(selectedClass && dataBaseReturn[i].Classification.toLowerCase().includes(selectedClass[1].toLowerCase()) == true ){
                    if (dataBaseReturn[i].Title.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
                        filteredResults.push(dataBaseReturn[i]);
                    }else if(dataBaseReturn[i].Desc.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
                        filteredResults.push(dataBaseReturn[i]);
                    } 
                }  
            }
            displayPOCs(filteredResults);    
        }else{
            for (i = 0; i < dataBaseReturn.length; i++) {
                if (selectedClass && dataBaseReturn[i].Classification.toLowerCase().includes(selectedClass[1].toLowerCase()) == true ){
                    filteredResults.push(dataBaseReturn[i]);
                }
            }
            displayPOCs(filteredResults);
        }   
    }else if(pageData.get("titleCheck") == true){
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
    
    pageData.set("searchSection", false);
    pageData.set("contentSection", true);
}
var displayPOCs = function(SJDs){
    var SJDList = pageObject.getViewById("SJD_List");
    SJDList.removeChildren();
    for(i = 0; i < SJDs.length; i++ ){
        SJDList.addChild(createSJDGrid(SJDs[i].Title, SJDs[i].Salary, SJDs[i].Classification, SJDs[i].Desc, SJDs[i].Link));
    }
};
var createSJDGrid = function(SJD_t, SJD_s, SJD_c, SJD_d, SJD_l){
    var gridLayout = new layout.GridLayout();
    var SJDTitle = new Label();
    var SJDSalary = new Label();
    var SJDClass = new Label();
    var SJDSuper = new Label();
    var SJDDesc = new Label();
    var SJDLink = new Button();

    SJDTitle.text = "(" + SJD_c.replace("   ", "") + ") " + SJD_t;
    SJDTitle.className = "POC_H1";
    SJDSalary.text = SJD_s;
    SJDSalary.className = "POC_Phone";
    SJDDesc.text = SJD_d;
    SJDDesc.className = "POC_Body";
    SJDLink.text = "Send Link";
    SJDLink.link = SJD_l;
    SJDLink.title = SJD_t;
    SJDLink.className = "Utility_SmallButton";

    SJDLink.on(buttonModule.Button.tapEvent, sendSJDLink, this);

    layout.GridLayout.setRow(SJDTitle, 0);
    layout.GridLayout.setRow(SJDSalary, 1);
    layout.GridLayout.setRow(SJDDesc, 2);
    layout.GridLayout.setRow(SJDLink, 3);
    gridLayout.addChild(SJDTitle);
    gridLayout.addChild(SJDSalary);
    gridLayout.addChild(SJDDesc);
    gridLayout.addChild(SJDLink);
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var salaryRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var linkRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(salaryRow);
    gridLayout.addRow(descRow);
    gridLayout.addRow(linkRow);
    gridLayout.className = "POC_Grid";

    return gridLayout;

};
var sendSJDLink = function(eventData){
    var workEmail = "";
    if(applicationSettings.hasKey("WorkEmail")){
        workEmail = applicationSettings.getString("WorkEmail");
    }
    if (email.available()){
        email.compose({
            subject: "A link to " + eventData.object.title,
            body: eventData.object.link,
            to: workEmail
        });
    } else {
        console.log("Email Not Available");
    }
}


exports.onClassListPickerLoaded = function(args){
    const listPicker = args.object;
    const vm = listPicker.page.bindingContext;
    listPicker.on("selectedIndexChange", (lpargs) => {
        pageData.set("classIndex", listPicker.selectedIndex);
        console.log(`ListPicker selected value: ${listPicker.selectedValue}`);
        console.log(`ListPicker selected index: ${listPicker.selectedIndex}`);
        selectedClass = [listPicker.selectedIndex, listPicker.selectedValue];

    });
}
var getClassList = function(){
    var databasePull = getFromDatabase();
    console.log(databasePull.length);
    var classList = [];
    var itemIsDuplicate = false;
    for(i = 0; i < databasePull.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < classList.length; x++){
            if (databasePull[i].Classification == classList[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            classList.push(databasePull[i].Classification);
            console.log(databasePull[i].Classification);
        }
    }
    return classList;
}
var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    dbRow = {Title:"Administrative Assistant I ", WDNumber:"0000057333", Salary:"$51538 - $57643", Supervisory:"No", Classification:"AS   01", Link:"https://collaboration-hr-civ.forces.mil.ca/sites/CJL-BEC/Jobs%20%20Emplois/DND-PA-58027" , Desc:"Provides administrative assistance to an executive at Level C, represents the organization at admin meetings. No supervisory responsibilities."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Records and Information Management Administrator", WDNumber:"0000057416", Salary:"$51538 - $57643", Supervisory:"No", Classification:"AS   01", Link:"https://collaboration-hr-civ.forces.mil.ca/sites/CJL-BEC/Jobs%20%20Emplois/DND-PA-58027", Desc:"The position is responsible for the provision of records and information management services to an organization and typically reports to a civilian supervisor in the administrative field Directions and information pertaining to the applicable business process with respect to records/information management can generally be obtained from the line organization responsible for Records and Information Management. This position has no supervisory responsibilities."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Compensation Agent", WDNumber:"0000057225", Salary:"$51538 - $57643", Supervisory:"No", Classification:"AS   01", Link:"https://collaboration-hr-civ.forces.mil.ca/sites/CJL-BEC/Jobs%20%20Emplois/DND-PA-58027", Desc:"Provides general advice and services on compensation and benefits, issues/entitlements to DND civilians, clients and/or their representatives."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Service Desk Technician", WDNumber:"0000057225", Salary:"$53611 - $69088", Supervisory:"No", Classification:"CS   01", Link:"https://collaboration-hr-civ.forces.mil.ca/sites/CJL-BEC/Jobs%20%20Emplois/DND-PA-58027", Desc:"The position provides IM/IT Service Desk services within a centralized Service Desk for DND/CAF staff and clients within a service delivery model such as an SMC.  An SMC is an IT services organization resulting from the consolidation of multiple IT points of service (service desks and service providers) into a single Level One organization (L1) that provides services to its assigned clients. The SMC addresses the needs of the DND/CAF to ensure efficient, effective, and responsive IT service delivery by establishing an enterprise-wide approach including an optimized service delivery model, streamlined IT service provision centres and standardized tools and processes. It also facilitates the establishment of measurable levels of IT service delivery, providing accurate information for a commander’s situational awareness and decision making with respect to the Department’s IT investments.  The primary responsibility of the 1st line of support, the Service Desk, is the initiation, execution and oversight of incidents and of some service requests.  Each Service Desk is responsible for the oversight and/or execution of the following: Incident Management, Service Request Management, Escalation of incidents, service requests and issues that may need higher attention, and Communications with the end user community.  The position generally reports to a Level F or above and has no supervisory responsibilities."};
    databaseReturn.push(dbRow);

    

    return databaseReturn;
};


