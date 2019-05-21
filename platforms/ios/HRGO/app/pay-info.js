var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var pageData = new observable.Observable();
var selectedClass, selectedStep;
var classDD;
var classSteps;
var pageObject;
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
const fromObject = require("tns-core-modules/data/observable").fromObject;
var pageVM;
var subNavTitle = "YourPayInformation";

exports.onNavigatingTo = function(args){
    selectedClass = null;
    selectedStep = null;
    classDD = getClassList();
    classSteps = getStepCount();
    //const classifications = getClassList();
    var steps = [1];
    const page = args.object;
    pageObject = page;
    pageData = fromObject({
        classItems: classDD,
        classIndex: 1,
        stepItems: steps,
        stepIndex:1,
        infoVisible: true,
        salaryVisible: false,
        SubstantiveClass: true,
        SubstantiveStep: false
    }); 
    page.bindingContext = pageData;
    
    
}
exports.pageLoaded = function(args) {
    
    console.log(pageData.get("infoVisible"));
    
};
exports.onClassListPickerLoaded = function(args){
    const listPicker = args.object;
    const vm = listPicker.page.bindingContext;
    listPicker.on("selectedIndexChange", (lpargs) => {
        vm.set("classIndex", listPicker.selectedIndex);
        //console.log(`ListPicker selected value: ${listPicker.selectedValue}`);
        //console.log(`ListPicker selected index: ${listPicker.selectedIndex}`);
        selectedClass = [listPicker.selectedIndex, listPicker.selectedValue];
        selectedStep = null;
        loadSteps(listPicker.selectedValue,args);
        pageData.set("SubstantiveStep", true);
        pageData.set("SubstantiveClass", false);
    });
}
exports.onStepListPickerLoaded = function(args){
    const listPicker = args.object;
    const vm = listPicker.page.bindingContext;
    listPicker.on("selectedIndexChange", (lpargs) => {
        vm.set("stepIndex", listPicker.selectedIndex);
        //console.log(`ListPicker selected value: ${listPicker.selectedValue}`);
        //console.log(`ListPicker selected index: ${listPicker.selectedIndex}`);
        selectedStep = [listPicker.selectedIndex, listPicker.selectedValue];
        
        
        //loadSteps(listPicker.selectedValue,args);
    });
}
exports.getSalaryInfo = function(args){
    //pageData.set("showInfo", true);
    //args.object.bindingContext = pageData;
    console.log("getSalaryInfo");
    
    pageData.set("infoVisible", false);
    if(selectedClass != null && selectedStep !=null){
        var salaryData = returnSalary(selectedClass[1], selectedStep[1]);
        pageData.set("annualRate", "$" + Math.round(salaryData.annually * 100 + Number.EPSILON ) / 100);
        pageData.set("biweeklyRate", "$" + Math.round(salaryData.biweekly * 100 + Number.EPSILON ) / 100);
        pageData.set("dailyRate", "$" + Math.round(salaryData.daily * 100 + Number.EPSILON ) / 100);
        pageData.set("hourlyRate", "$" + Math.round(salaryData.hourly * 100 + Number.EPSILON ) / 100);
        pageData.set("overtime1Rate", "$" + Math.round((salaryData.hourly * 1.5) * 100 + Number.EPSILON ) / 100);
        pageData.set("salaryVisible", true);
    }
};
var loadSteps = function(selection,inputArg){
    console.log(`loadSteps selectedClass = ${selectedClass}`);
    var numOfSteps;
    var steps = [];
    console.log(classSteps.length);
    for(x=0; x < classSteps.length; x++){
        if(classSteps[x].class == selectedClass[1]){
            numOfSteps = classSteps[x].steps;   
        }
    }

    for(i = 0; i < numOfSteps; i++){
        steps.push(i+1);
    }
    //console.log(`steps: ${steps.length}`);
    console.log(`steps: ${numOfSteps}`);
    pageData.stepItems = steps;
    pageData.stepIndex = 1;

};
exports.resetSelections = function(args){
    selectedClass = null;
    selectedStep = null;
    pageData.set("annualRate", "");
    pageData.set("biweeklyRate", "");
    pageData.set("dailyRate", "");
    pageData.set("hourlyRate", "");
    pageData.set("overtime1Rate", "");
    pageData.set("infoVisible", true);
    pageData.set("salaryVisible", false);
}
exports.getCalculatedInfo = function(){
    var overtimeCalc, hourlyCalc, dailyCalc, biweeklyCalc, annuallyCalc;
    var totalValue = 0;
    var salaryData = returnSalary(selectedClass[1], selectedStep[1]);
    if(pageData.get("overtime1Number")){
        overtimeCalc = pageData.get("overtime1Number");
        totalValue += overtimeCalc * salaryData.hourly * 1.5;
    };
    if(pageData.get("hourlyNumber")){
        hourlyCalc = pageData.get("hourlyNumber");
        totalValue += hourlyCalc * salaryData.hourly;
    };
    if(pageData.get("dailyNumber")){
        dailyCalc = pageData.get("dailyNumber");
        totalValue += dailyCalc * salaryData.daily;
    };
    if(pageData.get("biweeklyNumber")){
        biweeklyCalc = pageData.get("biweeklyNumber");
        totalValue += biweeklyCalc * salaryData.biweekly;
    };
    if(pageData.get("annuallyNumber")){
        anuallyCalc = pageData.get("annuallyNumber");
        totalValue += annuallyCalc * salaryData.annually;
    };

    pageData.set("calculatedMoney", "Gross Salary Calculation: $" + Math.round(totalValue * 100 + Number.EPSILON ) / 100);
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
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log("nav toggle");
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
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
var getClassList = function(){
    var databasePull = getFromDataBase();
    var classList = [];
    var itemIsDuplicate = false;
    for(i = 0; i < databasePull.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < classList.length; x++){
            if (databasePull[i].classCode == classList[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            classList.push(databasePull[i].classCode);
            //console.log(databasePull[i].classCode);
        }
    }
    return classList;
}
var getStepCount = function(){
    var databaseReturn = getFromDataBase();
    var numOfSteps = 0;
    var returnClassSteps = [];
    
    for(i = 0; i < classDD.length; i++){
        numOfSteps = 0;
        var stepItem = {};
        for(x=0; x < databaseReturn.length; x++){
            if (classDD[i] == databaseReturn[x].classCode){
                numOfSteps++;
            }
        }
        stepItem = {class:classDD[i], steps:numOfSteps};
        returnClassSteps.push(stepItem);
        //console.log("class: " + classDD[i] +  "steps: " + numOfSteps);
    }
    return returnClassSteps;
}
var returnSalary = function(selectedClassX, selectedStepX){
    var salaryList = getFromDataBase();    
    console.log("returnSalary");
    for(i=0; i < salaryList.length; i++){
        if(salaryList[i].classCode == selectedClass[1] && salaryList[i].step == selectedStep[1]){
            return salaryList[i];
            break;
        }
    }
};
var getFromDataBase = function(){
    var databaseReturn = [];
    var databaseLine = {};
databaseLine = {classCode:"STDNT-COL", step:"1", hourly:15.4, daily:115.5, biweekly:1155, annually:30131.64 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-COL", step:"2", hourly:16.35, daily:122.625, biweekly:1226.25, annually:31990.41 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-COL", step:"3", hourly:17.31, daily:129.825, biweekly:1298.25, annually:33868.746 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-COL", step:"4", hourly:18.35, daily:137.625, biweekly:1376.25, annually:35903.61 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-COL", step:"5", hourly:19.45, daily:145.875, biweekly:1458.75, annually:38055.87 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-COL", step:"6", hourly:20.62, daily:154.65, biweekly:1546.5, annually:40345.092 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"1", hourly:16.49, daily:123.675, biweekly:1236.75, annually:32264.334 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"2", hourly:17.64, daily:132.3, biweekly:1323, annually:34514.424 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"3", hourly:18.91, daily:141.825, biweekly:1418.25, annually:36999.306 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"4", hourly:20.19, daily:151.425, biweekly:1514.25, annually:39503.754 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"5", hourly:21.64, daily:162.3, biweekly:1623, annually:42340.824 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"6", hourly:23.15, daily:173.625, biweekly:1736.25, annually:45295.29 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"STDNT-UN", step:"7", hourly:24.77, daily:185.775, biweekly:1857.75, annually:48464.982 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   01", step:"1", hourly:26.3405908208116, daily:197.554431156087, biweekly:1975.54431156087, annually:51538 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   01", step:"2", hourly:27.3423285290811, daily:205.067463968108, biweekly:2050.67463968108, annually:53498 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   01", step:"3", hourly:28.3808647654094, daily:212.85648574057, biweekly:2128.5648574057, annually:55530 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   01", step:"4", hourly:29.4607993458039, daily:220.95599509353, biweekly:2209.5599509353, annually:57643 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   02", step:"1", hourly:29.3519370336298, daily:220.139527752223, biweekly:2201.39527752223, annually:57430 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   02", step:"2", hourly:30.4671368700808, daily:228.503526525606, biweekly:2285.03526525606, annually:59612 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   02", step:"3", hourly:31.6247572319329, daily:237.185679239497, biweekly:2371.85679239497, annually:61877 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   03", step:"1", hourly:16.1289992844731, daily:120.967494633548, biweekly:1209.67494633548, annually:31558 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   03", step:"2", hourly:32.6561381989165, daily:244.921036491874, biweekly:2449.21036491874, annually:63895 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   03", step:"3", hourly:33.8975774302361, daily:254.231830726771, biweekly:2542.31830726771, annually:66324 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   04", step:"1", hourly:34.3662475723193, daily:257.746856792395, biweekly:2577.46856792395, annually:67241 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   04", step:"2", hourly:35.672084227742, daily:267.540631708065, biweekly:2675.40631708065, annually:69796 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   04", step:"3", hourly:37.1358478994174, daily:278.51885924563, biweekly:2785.1885924563, annually:72660 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   05", step:"1", hourly:41.0272922416437, daily:307.704691812327, biweekly:3077.04691812327, annually:80274 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   05", step:"2", hourly:42.5866298681386, daily:319.39972401104, biweekly:3193.9972401104, annually:83325 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   05", step:"3", hourly:44.3565368496371, daily:332.674026372278, biweekly:3326.74026372278, annually:86788 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   06", step:"1", hourly:45.6991720331187, daily:342.74379024839, biweekly:3427.4379024839, annually:89415 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   06", step:"2", hourly:47.4363692118982, daily:355.772769089236, biweekly:3557.72769089236, annually:92814 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   06", step:"3", hourly:49.3003168762138, daily:369.752376571604, biweekly:3697.52376571604, annually:96461 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   07", step:"1", hourly:48.1043647143003, daily:360.782735357252, biweekly:3607.82735357252, annually:94121 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   07", step:"2", hourly:49.9340693038945, daily:374.505519779209, biweekly:3745.05519779209, annually:97701 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   07", step:"3", hourly:51.8297045895942, daily:388.722784421956, biweekly:3887.22784421956, annually:101410 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   07", step:"4", hourly:53.3869978534192, daily:400.402483900644, biweekly:4004.02483900644, annually:104457 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"AS   07", step:"5", hourly:55.0030665440049, daily:412.522999080037, biweekly:4125.22999080037, annually:107619 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   01", step:"1", hourly:17.8830624552796, daily:134.122968414597, biweekly:1341.22968414597, annually:34990 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   01", step:"2", hourly:18.2551364612082, daily:136.913523459062, biweekly:1369.13523459062, annually:35718 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   01", step:"3", hourly:18.6333435551467, daily:139.7500766636, biweekly:1397.500766636, annually:36458 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   01", step:"4", hourly:19.0110395584177, daily:142.582796688132, biweekly:1425.82796688132, annually:37197 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   01", step:"5", hourly:19.3795359296739, daily:145.346519472554, biweekly:1453.46519472554, annually:37918 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   01", step:"6", hourly:19.7577430236124, daily:148.183072677093, biweekly:1481.83072677093, annually:38658 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   02", step:"1", hourly:19.410201369723, daily:145.576510272922, biweekly:1455.76510272922, annually:37978 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   02", step:"2", hourly:19.8584278851068, daily:148.938209138301, biweekly:1489.38209138301, annually:38855 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   02", step:"3", hourly:20.3000102218133, daily:152.2500766636, biweekly:1522.500766636, annually:39719 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   02", step:"4", hourly:20.7426147398549, daily:155.569610548911, biweekly:1555.69610548911, annually:40585 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   03", step:"1", hourly:22.0167637738935, daily:165.125728304201, biweekly:1651.25728304201, annually:43078 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   03", step:"2", hourly:22.5932740468159, daily:169.449555351119, biweekly:1694.49555351119, annually:44206 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   03", step:"3", hourly:23.1713175917408, daily:173.784881938056, biweekly:1737.84881938056, annually:45337 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   03", step:"4", hourly:23.7488500459982, daily:178.116375344986, biweekly:1781.16375344986, annually:46467 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   04", step:"1", hourly:24.3938464683635, daily:182.953848512726, biweekly:1829.53848512726, annually:47729 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   04", step:"2", hourly:25.0413983440662, daily:187.810487580497, biweekly:1878.10487580497, annually:48996 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   04", step:"3", hourly:25.687928038434, daily:192.659460288255, biweekly:1926.59460288255, annually:50261 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   04", step:"4", hourly:26.3303690074619, daily:197.477767555964, biweekly:1974.77767555964, annually:51518 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   05", step:"1", hourly:26.6595113973219, daily:199.946335479914, biweekly:1999.46335479914, annually:52162 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   05", step:"2", hourly:27.3913932331596, daily:205.435449248697, biweekly:2054.35449248697, annually:53594 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   05", step:"3", hourly:28.1309414290095, daily:210.982060717571, biweekly:2109.82060717571, annually:55041 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   05", step:"4", hourly:28.8618010835122, daily:216.463508126342, biweekly:2164.63508126342, annually:56471 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   06", step:"1", hourly:30.344986200552, daily:227.58739650414, biweekly:2275.8739650414, annually:59373 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   06", step:"2", hourly:31.1427987324951, daily:233.570990493714, biweekly:2335.70990493714, annually:60934 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   06", step:"3", hourly:31.9334559950935, daily:239.500919963201, biweekly:2395.00919963201, annually:62481 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CR   06", step:"4", hourly:32.7328017990391, daily:245.496013492794, biweekly:2454.96013492794, annually:64045 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"1", hourly:29.0846366145354, daily:218.134774609016, biweekly:2181.34774609016, annually:56907 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"2", hourly:30.1599713789226, daily:226.19978534192, biweekly:2261.9978534192, annually:59011 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"3", hourly:31.2332617806399, daily:234.249463354799, biweekly:2342.49463354799, annually:61111 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"4", hourly:32.3009301850148, daily:242.256976387611, biweekly:2422.56976387611, annually:63200 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"5", hourly:33.3680874987223, daily:250.260656240417, biweekly:2502.60656240417, annually:65288 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"6", hourly:34.4347337217622, daily:258.260502913217, biweekly:2582.60502913217, annually:67375 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"7", hourly:35.5008688541347, daily:266.25651640601, biweekly:2662.5651640601, annually:69461 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   01", step:"8", hourly:37.4798119186344, daily:281.098589389758, biweekly:2810.98589389758, annually:73333 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"1", hourly:36.0007155269345, daily:270.005366452009, biweekly:2700.05366452009, annually:70439 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"2", hourly:37.1532249821118, daily:278.649187365839, biweekly:2786.49187365839, annually:72694 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"3", hourly:38.3047122559542, daily:287.285341919657, biweekly:2872.85341919657, annually:74947 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"4", hourly:39.4556884391291, daily:295.917663293468, biweekly:2959.17663293468, annually:77199 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"5", hourly:40.6087089849739, daily:304.565317387305, biweekly:3045.65317387305, annually:79455 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"6", hourly:41.7591740774813, daily:313.19380558111, biweekly:3131.9380558111, annually:81706 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"7", hourly:42.9111724419912, daily:321.833793314934, biweekly:3218.33793314934, annually:83960 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   02", step:"8", hourly:44.0626597158336, daily:330.469947868752, biweekly:3304.69947868752, annually:86213 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"1", hourly:42.4956557293264, daily:318.717417969948, biweekly:3187.17417969948, annually:83147 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"2", hourly:43.9589083103343, daily:329.691812327507, biweekly:3296.91812327507, annually:86010 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"3", hourly:45.4226719820096, daily:340.670039865072, biweekly:3406.70039865072, annually:88874 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"4", hourly:46.8874578350199, daily:351.655933762649, biweekly:3516.55933762649, annually:91740 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"5", hourly:48.3501993253603, daily:362.626494940202, biweekly:3626.26494940202, annually:94602 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"6", hourly:49.8119186343657, daily:373.589389757743, biweekly:3735.89389757743, annually:97462 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"7", hourly:51.2751712153736, daily:384.563784115302, biweekly:3845.63784115302, annually:100325 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   03", step:"8", hourly:52.7977103138097, daily:395.982827353573, biweekly:3959.82827353573, annually:103304 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"1", hourly:48.6563426351835, daily:364.922569763876, biweekly:3649.22569763876, annually:95201 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"2", hourly:50.3347643872023, daily:377.510732904017, biweekly:3775.10732904017, annually:98485 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"3", hourly:52.0116528672186, daily:390.08739650414, biweekly:3900.8739650414, annually:101766 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"4", hourly:53.6900746192374, daily:402.675559644281, biweekly:4026.75559644281, annually:105050 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"5", hourly:55.3669630992538, daily:415.252223244404, biweekly:4152.52223244404, annually:108331 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"6", hourly:57.0443626699376, daily:427.832720024532, biweekly:4278.32720024532, annually:111613 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"7", hourly:58.722273331289, daily:440.417049984667, biweekly:4404.17049984667, annually:114896 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   04", step:"8", hourly:60.5637330062353, daily:454.227997546765, biweekly:4542.27997546765, annually:118499 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"1", hourly:55.4676479607482, daily:416.007359705612, biweekly:4160.07359705612, annually:108528 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"2", hourly:57.5355208013902, daily:431.516406010426, biweekly:4315.16406010426, annually:112574 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"3", hourly:59.6023714606971, daily:447.017785955228, biweekly:4470.17785955228, annually:116618 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"4", hourly:61.6707553920065, daily:462.530665440049, biweekly:4625.30665440049, annually:120665 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"5", hourly:63.739139323316, daily:478.04354492487, biweekly:4780.4354492487, annually:124712 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"6", hourly:65.8075232546254, daily:493.55642440969, biweekly:4935.5642440969, annually:128759 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"7", hourly:67.8764182766023, daily:509.073137074517, biweekly:5090.73137074517, annually:132807 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"8", hourly:69.9437800265767, daily:524.578350199325, biweekly:5245.78350199325, annually:136852 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"CS   05", step:"9", hourly:72.2815087396504, daily:542.111315547378, biweekly:5421.11315547378, annually:141426 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   01", step:"1", hourly:26.8133496882347, daily:201.10012266176, biweekly:2011.0012266176, annually:52463 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   01", step:"2", hourly:27.9817029541041, daily:209.86277215578, biweekly:2098.6277215578, annually:54749 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   01", step:"3", hourly:29.2256976387611, daily:219.192732290708, biweekly:2191.92732290708, annually:57183 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   01", step:"4", hourly:30.5320453848513, daily:228.990340386385, biweekly:2289.90340386385, annually:59739 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   01", step:"5", hourly:31.9058570990494, daily:239.29392824287, biweekly:2392.9392824287, annually:62427 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   01", step:"6", hourly:33.3542880507002, daily:250.157160380251, biweekly:2501.57160380251, annually:65261 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   02", step:"1", hourly:33.8229581927834, daily:253.672186445875, biweekly:2536.72186445875, annually:66178 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   02", step:"2", hourly:35.0132883573546, daily:262.599662680159, biweekly:2625.99662680159, annually:68507 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   02", step:"3", hourly:36.2526832260043, daily:271.895124195032, biweekly:2718.95124195032, annually:70932 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   02", step:"4", hourly:37.5411427987325, daily:281.558570990494, biweekly:2815.58570990494, annually:73453 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   03", step:"1", hourly:37.9265051620157, daily:284.448788715118, biweekly:2844.48788715118, annually:74207 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   03", step:"2", hourly:39.2824287028519, daily:294.618215271389, biweekly:2946.18215271389, annually:76860 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   03", step:"3", hourly:40.6915056731064, daily:305.186292548298, biweekly:3051.86292548298, annually:79617 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   03", step:"4", hourly:42.1557804354492, daily:316.168353265869, biweekly:3161.68353265869, annually:82482 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   04", step:"1", hourly:42.1670244301339, daily:316.252683226004, biweekly:3162.52683226004, annually:82504 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   04", step:"2", hourly:43.6394766431565, daily:327.296074823674, biweekly:3272.96074823674, annually:85385 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   04", step:"3", hourly:45.2233466216907, daily:339.17509966268, biweekly:3391.7509966268, annually:88484 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   04", step:"4", hourly:46.868547480323, daily:351.514106102423, biweekly:3515.14106102423, annually:91703 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   05", step:"1", hourly:47.2160891342124, daily:354.120668506593, biweekly:3541.20668506593, annually:92383 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   05", step:"2", hourly:48.9451088623122, daily:367.088316467341, biweekly:3670.88316467341, annually:95766 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   05", step:"3", hourly:50.7410814678524, daily:380.558111008893, biweekly:3805.58111008893, annually:99280 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   05", step:"4", hourly:52.6091178575079, daily:394.568383931309, biweekly:3945.68383931309, annually:102935 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   06", step:"1", hourly:50.0700194214454, daily:375.52514566084, biweekly:3755.2514566084, annually:97967 };
databaseReturn.push(databaseLine);
databaseLine = {classCode:"PE   06", step:"2", hourly:58.3532658693652, daily:437.649494020239, biweekly:4376.49494020239, annually:114174 };
databaseReturn.push(databaseLine);

    return databaseReturn;
}

