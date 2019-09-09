var frameModule = require("ui/frame");
var applicationModule = require("application");
var observable = require("data/observable");
var pageData = new observable.Observable();
var subNavTitle = "";
var applicationSettings = require("application-settings");
const fromObject = require("tns-core-modules/data/observable").fromObject;
var firebase = require("nativescript-plugin-firebase/app");
var firebaseBuffer = require("~/utilities/FirebaseBuffer");
var page;
var pageObject;

exports.pageLoaded = function(args) {
    pageData = fromObject({
        selectedLanguage: ((applicationSettings.getString("PreferredLanguage") == "French") ? 1 : 0),
        lblTitle: ["Home", "Accueil"],
        lblVideos: ["Videos", "Vidéos"],
        lblContact: ["Contact", "Contacts"],
        lblLookup: ["Lookup", "Consultation"],
        lblTracking: ["Tracking", "Suivis"],
        lblStudents: ["Students", "Étudiants"],
        lblCalculators: ["Calculators", "Calculateurs"],
        lblPay: ["Pay", "Paie"],
        lblAnnouncements: ["Announcements", "Annonces"],
        lblWellness: ["Mental Health and Well-being", "Santé mentale et mieux-être"]
    });

    page = args.object;
    args.object.bindingContext = pageData;
    pageObject = page;

    if( !applicationSettings.hasKey("datesHaveBeenReset")) {
        var resetToDate    = new Date('January 1, 2018 01:00:00');
        if( applicationSettings.hasKey("LastFirebaseSyncCheck") ) {
            applicationSettings.remove("LastFirebaseSyncCheck");
        }
        applicationSettings.setString( "LastFirebaseSyncCheck" , "" + resetToDate.getTime());
        
        if( applicationSettings.hasKey("LastFirebaseSync") ) {
            applicationSettings.remove("LastFirebaseSync");
        }
        applicationSettings.setString( "LastFirebaseSync" , "" + resetToDate.getTime());


        applicationSettings.setString("datesHaveBeenReset", "1.3.0");
    }

    //applicationSettings.remove("LastFirebaseSyncCheck");
    //applicationSettings.remove("LastFirebaseSync");
    //checkFirebaseData();
    
    checkFirebase();

    /*
    if( !applicationSettings.hasKey("LastFirebaseSyncCheck") ) {
        console.log("init LastFirebaseSyncCheck");
        var lastSyncCheckDate    = new Date('January 1, 2018 01:00:00');
        applicationSettings.setString("LastFirebaseSyncCheck", "" + lastSyncCheckDate.getTime());
    }
*/
    if( !applicationSettings.hasKey("PreferredLanguage")) {
        var langSection = pageObject.getViewById("languageSelection");
        langSection.visibility = "visible";
    }


};

function reloadTable(tableName, timeStampValue) {
    console.log( "reload table " + tableName);
    switch(tableName) {
        case "Categories":
            applicationModule.CategoriesCollection.get({ source: "server" }).then( refreshSnapshot => {
                if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < timeStampValue.getTime() ) {
                    applicationSettings.setString("LastFirebaseSync", "" + timeStampValue.getTime());
                }
            });
            break;
        case "Notifications":
            applicationModule.NotificationsCollection.get({ source: "server" }).then( refreshSnapshot => {
                if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < timeStampValue.getTime() ) {
                    applicationSettings.setString("LastFirebaseSync", "" + timeStampValue.getTime());
                }
            });
            break;
        case "POC":
            applicationModule.POCCollection.get({ source: "server" }).then( refreshSnapshot => {
                if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < timeStampValue.getTime() ) {
                    applicationSettings.setString("LastFirebaseSync", "" + timeStampValue.getTime());
                }
            });
            break;
        case "PayInfo":
            applicationModule.PayInfoCollection.get({ source: "server" }).then( refreshSnapshot => {
                if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < timeStampValue.getTime() ) {
                    applicationSettings.setString("LastFirebaseSync", "" + timeStampValue.getTime());
                }
            });
            break;
        case "Videos":
            applicationModule.VideosCollection.get({ source: "server" }).then( refreshSnapshot => {
                if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < timeStampValue.getTime() ) {
                    applicationSettings.setString("LastFirebaseSync", "" + timeStampValue.getTime());
                }
            });
            break;
        case "wellness-landing-page":
            applicationModule.WellnessLPCollection.get({ source: "server" }).then( refreshSnapshot => {
                refreshSnapshot.forEach( record => {

                });
                console.log("in wellness-landing-page app time = " + applicationSettings.getString("LastFirebaseSync") + " , table time = " + timeStampValue.getTime());
                if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < timeStampValue.getTime() ) {
                    applicationSettings.setString("LastFirebaseSync", "" + timeStampValue.getTime());
                }
            });
            break;
    }

}

async function refreshTable(tableName, stampDate) {
    var refreshCollection   = firebase.firestore().collection(tableName);
    console.log( "app and table : " + applicationSettings.getString("LastFirebaseSync") + "  :  " + stampDate.getTime());
    try {
        var refreshSnapshot = await refreshCollection.get();
        var array   = [];
        refreshSnapshot.forEach( record => {
            array.push(record.data());
            //console.log( record.data().TitleEN);
        });

        firebaseBuffer.writeContents( tableName, array);

        if( parseInt( applicationSettings.getString("LastFirebaseSync"), 10) < stampDate.getTime()) {
            console.log("change last sync time to " + stampDate.getTime());
            applicationSettings.setString("LastFirebaseSync", "" + stampDate.getTime());
            console.log( applicationSettings.getString("LastFirebaseSync") );
        }
    } catch(err) {
        console.log(err);
    }
}

async function checkFirebase() {
    var TODAY                   = new Date();
    var lastSyncCheckDate    = new Date('January 1, 2018 01:00:00');
    if( applicationSettings.hasKey("LastFirebaseSyncCheck") ) {
        lastSyncCheckDate    = new Date( parseInt( applicationSettings.getString("LastFirebaseSyncCheck"), 10));
    }

    console.log("last sync check date = " + lastSyncCheckDate);

    if( (TODAY - lastSyncCheckDate) >= (1000 * 60 * 60 * 24) ) {

        try {
        var login   = await firebase.auth().signInAnonymously();
        console.log(" login success");
        } catch(err) {
            console.log("login error " + err);
        }

        var updatesCollection   = firebase.firestore().collection("TableUpdates");
        try {
            var lastSyncDate    = new Date( parseInt( applicationSettings.getString("LastFirebaseSync"), 10));
            var dataSnapshot    = await updatesCollection.where( "Updated", ">", lastSyncDate ).orderBy("Updated").get();
            dataSnapshot.forEach( record => {
                console.log( "checkFirebase for " + record.data().TableName );
                refreshTable( record.data().TableName , record.data().Updated);
            });
            applicationSettings.setString("LastFirebaseSyncCheck", "" + TODAY.getTime());
        }
        catch(err) {
            console.log("Retrieval error: " + err);
        }
    }
}

var checkFirebaseData = function() {
    var TODAY                   = new Date();
    var lastSyncCheckDate    = new Date('January 1, 2018 01:00:00');
    if( applicationSettings.hasKey("LastFirebaseSyncCheck") ) {
        lastSyncCheckDate    = new Date( parseInt( applicationSettings.getString("LastFirebaseSyncCheck"), 10));
    }

    if( ((TODAY - lastSyncCheckDate) / (1000 * 60 * 60 * 24)) > 1 ) {

        var lastSyncDate    = new Date('January 1, 2018 01:00:00');
        if( applicationSettings.hasKey("LastFirebaseSync") ) {
            lastSyncDate    = new Date( parseInt( applicationSettings.getString("LastFirebaseSync"), 10));
        } else {
            applicationSettings.setString("LastFirebaseSync", "" + lastSyncDate.getTime());
        }

        console.log( "Last Sync Date = " + (lastSyncDate));

        const notificationCollection = firebase.firestore().collection("TableUpdates");

        console.log("last sync date = " + lastSyncDate);

        const query = notificationCollection.where( "Updated", ">", lastSyncDate ).orderBy("Updated");

        query.get({ source: "server" }).then( querySnapshot => {
            querySnapshot.forEach( colDoc => {
                console.log("refresh data for " + colDoc.data().TableName);
                reloadTable(colDoc.data().TableName, colDoc.data().Updated);
                /*
                firebase.firestore().collection(colDoc.data().TableName).get({ source: "server" }).then( refreshSnapshot => {
                    if( colDoc.data().Updated.getTime() > applicationSettings.getString("LastFirebaseSync") ) {
                        applicationSettings.setString("LastFirebaseSync", colDoc.data().Updated.getTime());
                    }
                },
                (errorMessage) => {

                });
                */
            });
        },
        (errorMesage) => {
            console.log("Error getting query results: " + errorMessage)
        });

        applicationSettings.setString("LastFirebaseSyncCheck", "" + TODAY.getTime());
    }
};

exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate(args.object.pageName);
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log("nav toggle");
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
exports.goToRefCalc = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("calculators-landing-page");
};
exports.goToConnect = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("connect-landing-page");
};
exports.goToWalkthroughs = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate("walkthroughs-landing-page");
}
exports.switchToFrench = function(){
    var topmost = frameModule.topmost();
    var pageDetails = String(topmost.currentPage).split("///");
    var frenchPageTitle = pageDetails[1].split("/")[1].split(".")[0] + "_FR";
    console.log(frenchPageTitle);
    topmost.navigate(frenchPageTitle);
};
exports.goToTest = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
    
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

exports.setLanguage = function(args) {
    console.log( "args = " + args.object.data );
    
    args.object.style.backgroundColor = "rgb(0,31,91)";
    args.object.style.color = "#FFF";

    applicationSettings.setString("PreferredLanguage", args.object.data);

    var topmost = frameModule.topmost();
    if( args.object.data == "French" ) {
        //topmost.navigate("FR_main-page");
        pageData.set( "selectedLanguage" , 1 );
    } else {
        //topmost.navigate("main-page");
        pageData.set( "selectedLanguage" , 0 );
    }
    var langSection = pageObject.getViewById("languageSelection");
    langSection.visibility = "collapsed";
}

exports.searchLanding = function(){
    var searchField = page.getViewById("SearchBox").text;
    
    var navigationOptions={
        moduleName:'search-page',
        context:{SearchTerm: searchField
                }
            }

    var topmost = frameModule.topmost();
    topmost.navigate(navigationOptions);
}
