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
        }else if(dataBaseReturn[i].Code.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Desc.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Keywords.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
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
    LeaveList.visible = false;
    LeaveList.removeChildren();
    for(i = 0; i < Codes.length; i++ ){
        LeaveList.addChild(createPOCGrid(Codes[i].Title, Codes[i].Paid, Codes[i].Code, Codes[i].Desc));
    }
    pageData.set("SearchCriteria", "");
    LeaveList.visible = true;
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

    //dbRow = {Title:"Bereavement", Paid:"Yes", Code:"510", Desc:"The intent is to allow an employee time off with pay for purposes related to the death in the immediate family, as defined in the clause relating to bereavement leave.", KeyWords:"death"};    //databaseReturn.push(dbRow);
    dbRow ={Title:"Bereavement", Paid:"Yes", Code:"510", Desc:"The intent is to allow an employee time off with pay for purposes related to the death in the immediate family, as defined in the clause relating to bereavement leave.", Keywords:"death"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Care of Immediate Family", Paid:"No", Code:"", Desc:"This leave is intended for the care of family members; family is described in the relevant collective agreement Article. ", Keywords:"family; care"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Career Development / Professional Development", Paid:"Yes", Code:"620", Desc:"This leave may be granted for an activity, which in the opinion of the Employer is likely to be of assistance to an individual in furthering their career development, to the organization in achieving its goals and to allow employees to acquire continuing profession credits to complete or maintain licensing standards.", Keywords:"promotion"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Compassionate Care", Paid:"No", Code:"951", Desc:"This leave type is for the purpose of care for a critically ill immediate family member (as defined in the relevant Collective Agreement) who is not expected to survive more than 6 months. ", Keywords:"critical; illness "};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Compensatory", Paid:"Yes", Code:"810", Desc:"Normally overtime is paid out in cash, but at the request of the employee, a request can be made to take leave with pay in lieu of cash payment.", Keywords:"comp; CTO "};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Court", Paid:"Yes", Code:"610", Desc:"The intent is to allow an employee leave with pay to comply with a subpoena or summons issued by a court or duly constituted body or representative of the legal process.  Court leave is not granted to an employee who is a plaintiff or a defendant in a proceeding.  Jury duty is also part of this provision, and is applicable for only that time during which an employee is required to be in court.", Keywords:"jury; subpeona; legal"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Education", Paid:"", Code:"", Desc:"Educational Leave (without pay) may be granted for varying periods of up to one (1) year, which can be renewed by mutual agreement to attend a recognized institution for studies in some field of education which is beneficial to both the employee and the organization.", Keywords:"school; degree; sabatical; study"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Examination", Paid:"Yes", Code:"620", Desc:"This type of leave may be granted for the purpose of writing an examination (not for selection processes within the Public Service- see Personnel Selection Leave), which takes place during the employee’s scheduled hours of work and where the course is directly related to the employee’s duties or will improve the employee’s qualifications. Examples would include university or college course exams, apprenticeship exams, defense of dissertations etc.", Keywords:"exam; course"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Adoption", Paid:"Yes", Code:"440", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Appointment with Professional", Paid:"Yes", Code:"472", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Appointments", Paid:"Yes", Code:"410", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Birth", Paid:"Yes", Code:"430", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Illness in Family", Paid:"Yes", Code:"420", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Other", Paid:"Yes", Code:"490", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities School Functions", Paid:"Yes", Code:"470", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Family Related Responsibilities Unforeseeable School/Daycare Closure", Paid:"Yes", Code:"471", Desc:"The intent is to provide for periods of leave for various family-related responsibilities. Included are the temporary care of a sick member of the employee’s family as defined in the respective collective agreement, needs related to the adoption of a child, to the birth of a child, the time required to take a family member to appointments, school functions, unforeseeable school or daycare closure, and an appointment with a professional.", Keywords:"care; FR; adoption; appointments; birth; marriage"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Foreign Service (discontinued)", Paid:"", Code:"710", Desc:"Although Foreign Service Leave has been discontinued, employees may still have remaining leave credits which they can take as leave Used in the same way as vacation leave.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Foreign Service Post", Paid:"Yes", Code:"731", Desc:"This leave is to permit the employee time off with pay for the purpose of travel between the post and the headquarter city. Leave credited depends on the time at the specific post and there is a minimum and maximum accumulation.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Furlough (discontinued)", Paid:"Yes", Code:"310", Desc:"Furlough leave is additional leave with pay upon completion of 20 years of service. This leave provision has been discontinued however a small number of employees may still have unused credits and they are entitled to use them.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Income Averaging", Paid:"No", Code:"911", Desc:"This is a special working arrangement whereby employees reduce the number of weeks worked in a specific 12-month period by taking leave without pay. The employee’s pay is reduced and averaged out over the 12-month period to reflect the reduced time at work. Pension and benefits coverage continue at the pre-arrangement levels. This working arrangement allows the employee to continue to receive pay (reduced) every month during the year.", Keywords:"LIA; average"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Injury on Duty", Paid:"Yes", Code:"660", Desc:"This type of leave is approved when employees are away from the workplace due to a work related illness or injury when a claim has been made and accepted by the relevant Worker’s Compensation authority.", Keywords:"IOD; workplace"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Leave with Pay for Other Reasons / Other Leave with Pay", Paid:"Yes", Code:"699", Desc:"Leave With Pay may be granted for circumstances not directly attributable to the employee preventing them from reporting for duty, or for purposes other than those covered specifically in the collective agreement. When the circumstances preventing the employee from reporting for duty are not directly attributable to the employee the Leave with Pay request should not be unreasonably withheld. Consulting with your LRO is strongly advised before approving this type of leave.", Keywords:"paid; sporting"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Leave without Pay for Other Reasons", Paid:"No", Code:"999", Desc:"Other Leave Without Pay may be granted for purposes that could be attributable to the employee, where these purposes are not covered by the other leave provisions of the agreement. Consulting with your LRO is strongly advised before approving this type of leave.", Keywords:"unpaid"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Lieu", Paid:"Yes", Code:"851", Desc:"Lieu days are compensation for work performed previously on a designated paid holiday.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Management", Paid:"Yes", Code:"647", Desc:"This  leave with pay granted by the Deputy Head or the person with delegated authority to compensate certain Excluded /Unrepresented employees who are exempt from overtime payment but are required by management to work excessive hours or work/travel on a day of rest or holiday.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Maternity", Paid:"No", Code:"925", Desc:"This is to provide leave without pay to female employees before, on or after the termination date of the pregnancy. Most collective agreements provide for a paid maternity allowance benefit to supplement employment insurance payments.", Keywords:"mat; birth; paternity"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Parental", Paid:"No", Code:"941", Desc:"This leave may be taken for the care and custody of either a newborn or  adopted child for a maximum period of 37 weeks within the 52 week period beginning the day the child is born  or the day on which the child comes into the employee’s care.  Most collective agreements provide for a paid parental allowance benefit to supplement unemployment insurance payments.", Keywords:"parent; maternity; paternity; adoption"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Personal Needs", Paid:"No", Code:"945", Desc:"Most collective agreements provide up to two extended periods of Leave without pay for personal needs during the length of the person’s employment in the Public Service and others provide more. In most agreements this leave may be granted once for a period of up to three (3) months and once for a period of more than three (3) months but not exceeding one (1) year.", Keywords:"3-month; 12-month"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Personal", Paid:"Yes", Code:"530", Desc:"Employees shall be granted in each fiscal year the hours equivalent to two standard work days of leave with pay for reasons of a personal nature. ", Keywords:"volunteer"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Personal", Paid:"Yes", Code:"540", Desc:"Employees shall be granted in each fiscal year the hours equivalent to two standard work days of leave with pay for reasons of a personal nature. ", Keywords:"volunteer"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Personnel Selection", Paid:"Yes", Code:"630", Desc:"To allow an employee leave with pay to participate in a staffing process within the Public Service including reasonable travelling time to and from the place where the employee’s presence is required.", Keywords:"interview; job"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Pre-retirement Transition", Paid:"No", Code:"", Desc:"Pre-retirement transition leave is a special working arrangement whereby eligible persons who are within two years of retirement have their workweek reduced by up to 40 per cent. For a full-time person, this represents up to two out of five working days.", Keywords:"PRTL"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Relocation of Spouse", Paid:"No", Code:"930", Desc:"This leave is granted for up to one (1) year where the spouse or common-law partner is relocated permanently and up to five (5) years where the spouse is relocated temporarily.", Keywords:"relo; moving"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Reserve Forces Training / Military (paid)", Paid:"In some instances / Dans certains cas", Code:"650", Desc:"Persons appointed to the core public administration may be granted leave with pay for other reasons for the purpose of serving in the Canadian Forces Reserve. This leave should be granted under “Leave with or without Pay for other reasons” in the relevant collective agreement.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Reserve Forces Training / Military (unpaid)", Paid:"In some instances / Dans certains cas", Code:"975", Desc:"Persons appointed to the core public administration may be granted leave with pay for other reasons for the purpose of serving in the Canadian Forces Reserve. This leave should be granted under “Leave with or without Pay for other reasons” in the relevant collective agreement.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Self-funded", Paid:"No", Code:"998", Desc:"To allow indeterminate employees to defer up to 33 1/3 per cent of their gross salary in order to fund a period of absence from their work and return to their regular employment when the leave is over. May be approved on more than one occasion. This leave not to be confused with Leave with Income Averaging. The leave is for a minimum of six (6) months to a maximum of twelve (12) months.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sick (certified)", Paid:"Yes", Code:"220", Desc:"Sick leave is a form of insurance intended to provide a level of compensation protection for employees who are unable to report to work and to perform the duties of the position because of illness or injury. It is not a benefit to be taken merely because it is there. When a medical certificate is provided. There is no longer a mandatory requirement to provide a medical certificate after a number of specified days away from work. Frequently, a statement by employees stating that they are ill is sufficient to satisfy the employer of the condition", Keywords:"uncertified; illness; note"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sick (uncertified)", Paid:"Yes", Code:"210", Desc:"Sick leave is a form of insurance intended to provide a level of compensation protection for employees who are unable to report to work and to perform the duties of the position because of illness or injury. It is not a benefit to be taken merely because it is there. No medical certificate is provided. There is no longer a mandatory requirement to provide a medical certificate after a number of specified days away from work. Frequently, a statement by employees stating that they are ill is sufficient to satisfy the employer of the condition", Keywords:"certified; illness; note"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Time Off", Paid:"Yes", Code:"", Desc:"This is used to grant absences without formal charge against vacation, sick or other leave credits. Typically this involves absences of less than four hours.  This is technically a form of leave with pay for other reasons. Employees should attempt to schedule personal appointments outside regular hours of work.", Keywords:"discretion; appointment"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Travel (Isolated Post)", Paid:"Yes", Code:"670", Desc:"This leave type is for employees in isolated posts to travel from the post on vacation or sick leave to the point of departure and return.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Travel Status", Paid:"Yes", Code:"665", Desc:"This leave is earned each fiscal year when employees travel away from their residence over a specific number of days up to a maximum number of days depending on the collective agreement.", Keywords:""};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Union Business (paid)", Paid:"In some instances / Dans certains cas", Code:"640", Desc:"The purpose of this leave is to allow union representatives and employees to exercise their rights pursuant to the collective agreement. It is recommended that managers consult with an LRO to ensure consistency. ", Keywords:"grievance; hearing"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Union Business (unpaid)", Paid:"In some instances / Dans certains cas", Code:"910", Desc:"The purpose of this leave is to allow union representatives and employees to exercise their rights pursuant to the collective agreement. It is recommended that managers consult with an LRO to ensure consistency. ", Keywords:"grievance; hearing"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Vacation One-Time", Paid:"Yes", Code:"121", Desc:"One-Time Vacation Leave Entitlement.", Keywords:"annual"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Vacation", Paid:"Yes", Code:"110", Desc:"Annual Vacation Leave", Keywords:"annual"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Volunteer (Discontinued)", Paid:"Yes", Code:"", Desc:"Employees shall be granted a single, standard work day per fiscal year off to work as a volunteer for a charitable or community organization or activity.", Keywords:""};
    databaseReturn.push(dbRow);

    return databaseReturn;
};
