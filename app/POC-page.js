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
var phone = require("nativescript-phone");

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
    POCDesc.text = "Description: " + POC_d;
    POCDesc.className = "POC_Body";
    POCPhone.text = POC_p;
    //POCPhone.className = "POC_Phone";
    POCPhone.className = "Submit_Button_1";
    POCPhone.phone = POC_p;
    POCEmail.text = POC_e;
    //POCEmail.className = "POC_Phone";
    POCEmail.className = "Submit_Button_1";
    POCEmail.email = POC_e;
    

    POCPhone.on(buttonModule.Button.tapEvent, callPOC, this);
    POCEmail.on(buttonModule.Button.tapEvent, emailPOC, this);

    layout.GridLayout.setRow(POCTitle, 0);
    layout.GridLayout.setRow(POCDesc, 1);
    if(POCPhone.phone !="N/A"){layout.GridLayout.setRow(POCPhone, 2);}
    if(POCEmail.email != "N/A"){layout.GridLayout.setRow(POCEmail, 3);}
    
    gridLayout.addChild(POCTitle);
    gridLayout.addChild(POCDesc);
    if(POCPhone.phone !="N/A"){gridLayout.addChild(POCPhone);}
    if(POCEmail.email != "N/A"){gridLayout.addChild(POCEmail);}
    
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var phoneRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var emailRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(descRow);
    if(POCPhone.phone !="N/A"){gridLayout.addRow(phoneRow);}
    if(POCEmail.email != "N/A"){gridLayout.addRow(emailRow);}
    
    gridLayout.className = "POC_Grid";

    return gridLayout;

};
var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    dbRow = {Title:"PSPC Call Center", Phone:"1-888-HRTOPAY", Email:"N/A", Desc:"The Client Contact Centre (CCC) is the first point of contact for current and former federal public servants looking for information or help with compensation and benefits enquiries, and for technical issues when using the Compensation Web Applications (CWA) and the Phoenix pay system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"HRSS Support Line", Phone:"1-833-747-6363", Email:"N/A", Desc:"The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Section 34 Manager Support Line", Phone:"1-833-747-6363", Email:"N/A", Desc:"If you are a Section 34 Manager experiencing issues with time approval related tasks, agents at this hotline can help walk through your issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"PSPC Pension Center", Phone:"1-800-561-7930", Email:"N/A", Desc:"The Government of Canada Pension Centre is the primary office responsible for the administration of the pension plan for Federal Public Service employees, the Public Service Superannuation Act (PSSA)."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Employee Assistance Program", Phone:"1-800-268-7708", Email:"N/A", Desc:"EAP offers solutions to both prevent and address the concerns of employers, employees, and immediate family members."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Public Services and Procurement Canada: General Inquiries ", Phone:"1-800-926-9105", Email:"questions@tpsgc-pwgsc.gc.ca", Desc:"For questions not answered on our website refer to the contact information below."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"DLN Learning Management System: Help Desk ", Phone:"1-844-750-1643", Email:"DLN-RAD@FORCES.GC.CA", Desc:"The DLN is an enterprise environment for managing, developing and delivering on-line training, as well as for providing the Defence Team with an environment favourable to continuous learning and the sharing of knowledge."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"PSPC Client Contact Centre (Government of Canada Employees)", Phone:"1-855-686-4729", Email:"N/A", Desc:"Friendly and knowledgeable operators can answer general questions related to employee pay enquiries."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Individual tax enquiries", Phone:"1-800-959-8281", Email:"N/A", Desc:"Call this number for tax information for individuals, trusts, international tax and non-residents, including personal income tax returns, instalments, and RRSPs or to get our forms and publications"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Benefit enquiries (CRA Child and family benefits)", Phone:"1-800-387-1193", Email:"N/A", Desc:"Call this number for information on the Canada child benefit (CCB), the GST/HST credit, and related provincial and territorial programs, as well as the child disability benefit."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Provincial programs for Ontario (PPO)", Phone:"1-877-627-6645", Email:"N/A", Desc:"Call this number for enquiries related to the Ontario trillium benefit (OTB) payment—includes the Ontario sales tax credit (OSTC), the Ontario energy and property tax credit (OEPTC), and the Northern Ontario energy credit (NOEC)—the Ontario senior homeowners' property tax grant (OSHPTG) payment,and the Ontario sales tax transition benefit (OSTTB)."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"TIPS (Tax Information Phone Service)", Phone:"1-800-267-6999", Email:"N/A", Desc:"This automated phone service provides information to individuals and businesses."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Revenu Québec", Phone:"1-800-267-6299", Email:"N/A", Desc:"General information, Income tax, Your tax file, Change of address, Notice of assessment, Direct deposit ,Assistance program for individuals in business"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Learning and Career Centres (LCCs) - Talent Management for the NCR", Phone:"1-613-901-6310", Email:"P-OTG.LCCTraining@intern.mil.ca", Desc:"Our highly skilled Learning Advisors provide Learning and Career Advisory services through group settings or classroom sessions."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Awards & Recognition", Phone:"1-613-901-7322", Email:"Awards-Recompenses@forces.gc.ca", Desc:"Discover the variety of awards available to the HR-Civ team and how you can recognize your colleagues for performance excellence."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Community Management Program", Phone:"1-613-901-6652", Email:"P-OTG.CommunityMgmt@intern.mil.ca", Desc:"Our goal is to provide a positive employee experience for our Workforce which is achieved by applying elements of Diversity & Inclusion, Total Health, and clarity of organizational vision and individual expectations (through Community Management, Organizational Learning, etc.)"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sexual Misconduct Response Centre - Counsellor", Phone:"1-844-750-1648", Email:"DND.SMRC-CIIS.MDN@forces.gc.ca", Desc:"Contact a Sexual Misconduct Response Centre (SMRC) counsellor, access resources for leadership, and learn about how to recognize harmful and inappropriate sexual behaviour"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Canadian Human Rights Commission", Phone:"1-888-214-1090", Email:"info.com@chrc-ccdp.gc.ca", Desc:"Human rights laws protect people in Canada from discrimination based on grounds such as race, sex, religion or disability."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Conflict and Complaint Management Services centre", Phone:"1-833-328-3351", Email:"ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca", Desc:"If you feel harassed while at work you can report the incident or submit a formal complaint. The Canadian Armed Forces national harassment unit will assist you with if you choose to make a complaint. They can also help you implement workplace prevention strategies from the Integrated Conflict and Complaint Management (ICCM) program."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Office of Disability Management - EAST (NL, PEI, NS, NB, QC, ON)", Phone:"1-833-893-3388", Email:"Disability_Management-Gestion_Invalidite@forces.gc.ca", Desc:"The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Office of Disability Management - WEST (MB, SK, BC, NU, NT, YK)", Phone:"1-833-893-3388", Email:"Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca", Desc:"The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Mental Health & Wellbeing", Phone:"N/A", Email:"P-OTG.Wellbeing@intern.mil.ca", Desc:" The Mental Health and Well-Being Corporate Office supports the health and well-being of employees and provides access to tools, resources and services to assist organizations in building a safe, supportive and respectful work environment."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sun Life Financial - Public Service Health Care Plan (PSHCP)", Phone:"1-888-757-7427", Email:"can_ottawaservice@sunlife.com", Desc:"Have your PSHCP contract number (055555) and certificate number available to help us assist you with your questions about your group benefits (e.g. drug, medical)."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sun Life Financial - Pensioners’ Dental Services Plan (PDSP)", Phone:"1-888-757-7427" , Email:"can_ottawaservice@sunlife.com", Desc:"Have your PDSP contract number (025555) and certificate number available to help us assist you with your questions about your group benefits."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Great-West Life - Public Service Dental Care Plan", Phone:"1-855-415-4414", Email:"N/A", Desc:""};
    databaseReturn.push(dbRow);

    return databaseReturn;
};

var callPOC = function(eventData){
    console.log(eventData.object.phone);
    phone.dial(eventData.object.phone,true);

};
var emailPOC = function(eventData){
    console.log(eventData.object.email);
    var toAddress = [];
    toAddress.push(eventData.object.email);
    if (email.available()){
        email.compose({
            subject: "",
            body: "",
            to: toAddress
        });
    } else {
        console.log("Email Not Available");
    }
};